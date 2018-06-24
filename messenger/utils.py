import calendar
import datetime
import json

import time
from django.utils import timezone

from connector.models import SearchResult
from messenger.models import ChatMessage, Inbox, Campaign, ContactStatus
from django.db.models import Count


def set_data(connection, time_diff_cmp, key, data):
    time_diff = timezone.now() - connection.time
    if time_diff.days <= time_diff_cmp:
        data[key]['connection_request'] += 1
        if connection.is_sent:
            data[key]['connected'] += 1
        if connection.replied_date:
            data[key]['replied'] += 1


def calculate_communication_stats(linkedin_user_id):
    data = {
        'h24': {'connection_request': 0, 'connected': 0, 'replied': 0, 'replied_others': 0},
        'h48': {'connection_request': 0, 'connected': 0, 'replied': 0, 'replied_others': 0},
        'h72': {'connection_request': 0, 'connected': 0, 'replied': 0, 'replied_others': 0},
        'w1': {'connection_request': 0, 'connected': 0, 'replied': 0, 'replied_others': 0},
        'm1': {'connection_request': 0, 'connected': 0, 'replied': 0, 'replied_others': 0},
    }

    connections = ChatMessage.objects.filter(owner__id=linkedin_user_id)

    for connection in connections:
        set_data(connection, 1, 'h24', data)
        set_data(connection, 2, 'h48', data)
        set_data(connection, 3, 'h72', data)
        set_data(connection, 7, 'w1', data)
        set_data(connection, 30, 'm1', data)
    return data


def calculate_connections(linkedin_user_id, status):
    data = {'h24': 0, 'h48': 0, 'h72': 0, 'd7': 0, 'm1': 0}
    connections = Inbox.objects.filter(owner__id=linkedin_user_id, status__in=status)
    for connection in connections:
        if connection.connected_date:
            time_diff = timezone.now() - connection.connected_date
            if time_diff.days <= 1:
                data['h24'] += 1
            if time_diff.days <= 1:
                data['h48'] += 1
            if time_diff.days <= 1:
                data['h72'] += 1
            if time_diff.days <= 7:
                data['d7'] += 1
            if time_diff.days <= 30:
                data['m1'] += 1

    data['connection_count'] = len(connections)
    return data


def calculate_dashboard_data(owner):
    campaigns = Campaign.objects.filter(owner=owner, is_bulk=False)
    campaign_members = 0
    connected_members = 0
    for campaign in campaigns:
        campaign_members_list = campaign.contacts.all()
        campaign_members += len(campaign_members_list)
        connected_members += len(campaign_members_list.filter(is_connected=True).exclude(connected_date=None))

    all_chat_messages = ChatMessage.objects.filter(owner=owner, campaign__is_bulk=False)

    invitations_sent = len(all_chat_messages.filter(type=ContactStatus.CONNECT_REQ_N))
    replied = len(all_chat_messages.exclude(replied_date=None))

    return {
        'campaign_members': campaign_members,
        'connected_members': connected_members,
        'invitations_sent': invitations_sent,
        'invitation_rate': int(invitations_sent / campaign_members) if campaign_members else 0,
        'pending_rate': 100 - int(invitations_sent / campaign_members) if campaign_members else 0,
        'replied': replied,
        'campaign_members_p': int(
            max(campaign_members, invitations_sent, replied) / campaign_members * 100) if campaign_members else 0,
        'invitations_sent_p': int(
            max(campaign_members, invitations_sent, replied) / invitations_sent * 100) if invitations_sent else 0,
        'replied_p': int(max(campaign_members, invitations_sent, replied) / replied * 100) if replied else 0,
        'time': timezone.datetime.now(),
    }


def calculate_connection_stat_graph(owner=None):
    now = time.localtime()
    last_12_months = [time.localtime(time.mktime((now.tm_year, now.tm_mon - n, 1, 0, 0, 0, 0, 0, 0)))[:2] for n in
                      range(13)]
    print(last_12_months)
    labels = []
    contacts_list = []
    invitations_list = []
    replied_list = []

    campaigns = Campaign.objects.filter(owner=owner, is_bulk=False)

    max_p = 0
    for month in last_12_months:
        labels += [calendar.month_name[month[1]] + ', ' + str(month[0])]
        monthly_campaign = campaigns.filter(created_at__month=month[1], created_at__year=month[0])
        for mc in monthly_campaign:
            contacts_list_last = len(mc.contacts.all())
            contacts_list += [contacts_list_last]
            max_p = max_p if max_p > contacts_list_last else contacts_list_last
            all_chat_messages = ChatMessage.objects.filter(owner=owner, campaign__is_bulk=False,
                                                           campaign__in=monthly_campaign)
            invitations_list += [len(all_chat_messages.filter(type=ContactStatus.CONNECT_REQ_N))]
            replied_list += [len(all_chat_messages.exclude(replied_date=None))]

    labels = json.dumps(labels)
    contacts_list = json.dumps(contacts_list)
    invitations_list = json.dumps(invitations_list)
    replied_list = json.dumps(replied_list)
    return {
        'labels': labels,
        'contacts_list': contacts_list,
        'invitations_list': invitations_list,
        'replied_list': replied_list,
        'max': max_p
    }


def calculate_map_data(owner):
    search_results = SearchResult.objects.filter(owner=owner).values('countrycode').annotate(
        total=Count('countrycode')).order_by('countrycode')

    result_data = {}
    for result in search_results:
        if not result['countrycode']:
            continue
        result['countrycode'] = result['countrycode'].lower()
        if result['countrycode'] in result_data.keys():
            result_data[result['countrycode']] += result['total']
        else:
            result_data[result['countrycode']] = result['total']
    map_data = json.dumps(result_data)
    print(map_data)
    return {
        'map_data': map_data

    }
