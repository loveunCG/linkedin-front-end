# -*- coding: utf-8 -*-
"""
Created on Wed Apr 25 15:33:20 IST 2018

@author: Chetna
"""

# Python imports


# Django imports
import json

from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404, redirect
from django.urls.base import reverse_lazy, reverse
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.generic.base import View
from django.views.generic.edit import UpdateView, CreateView
from connector.models import TaskQueue, SearchResult
from messenger.forms import UpdateContactNoteForm, CreateChatMesgForm

from .models import Inbox, ContactStatus, Campaign, ChatMessage
from app.models import BotTask, BotTaskType


# from django.http import HttpResponseRedirect
# from django.shortcuts import render, redirect
# local imports
decorators = (never_cache, login_required,)


class AjaxHttpResponse(object):
    payload = dict(ok=True)

    def AjaxResponse(self, payload=None):
        if payload is None:
            payload = self.payload
        json_data = json.dumps(payload)
        return HttpResponse(json_data, content_type='application/json')


@method_decorator(decorators, name='dispatch')
class ContactStatusView(View):
    def get(self, request, pk):
        contact = get_object_or_404(Inbox, pk=pk)
        new_status = request.GET.get('status', None)
        if new_status is None or ContactStatus.valid_status(new_status):
            raise Exception("Invalid status")
        contact = Inbox.objects.filter(id=pk)
        print(contact)
        contact.status = new_status
        contact.update(status=int(new_status))
        json_data = json.dumps(dict(ok=True))
        return HttpResponse(json_data, content_type='application/json')


# not sure if it can be fit in Updateview

@method_decorator(decorators, name='dispatch')
class CampaignContactsView(AjaxHttpResponse, View):
    def post(self, request):
        data = request.POST
        campaign_id = data.get('campaign')

        print(campaign_id)

        campaign = get_object_or_404(Campaign, pk=campaign_id)

        with transaction.atomic():

            cids = data.get('cid').split(',')
            for cid in cids:
                contact = get_object_or_404(Inbox, pk=cid)
                contact.attach_to_campaign(campaign)

        return self.AjaxResponse()


@method_decorator(decorators, name='dispatch')
class ContactDeleteView(AjaxHttpResponse, View):
    def _delete_contact(self, contact):
        # delete its clone in searchResult first
        print(contact)
        if contact.is_connected:
            # channged status only
            contact.change_status(ContactStatus.OLD_CONNECT_N)
            return

        searchobj = SearchResult.objects.filter(linkedin_id=contact.linkedin_id,
                                    owner=contact.owner)
        for search in searchobj:
            search.status = ContactStatus.CONNECT_REQ_N
            search.save()
        ChatMessage.objects.filter(contact_id=contact.id).delete()

        print(contact)
        contact.delete()

    def post(self, request):
        # cids = request.POST.get('cid')
        cids = request.POST.get('cid', '').split(',')
        print(cids)
        if len(cids) > 0:
            for cid in cids:
                if cid is '':
                    continue
                print(cid)
                contact = get_object_or_404(Inbox, pk=cid)
                if contact.owner.user != request.user:
                    raise Exception("Invalid Contact")

                contact.detach_from_campaigns()
                self._delete_contact(contact)
        return self.AjaxResponse()


@method_decorator(decorators, name='dispatch')
class ContactUpdateNoteView(UpdateView):
    template_name = 'app/includes/rightbox_contact_info.html'
    template_name2 = 'app/includes/rightbox_contact_info_empty.html'
    form_class = UpdateContactNoteForm
    model = Inbox

    def get_template_names(self):
        ctx = self.get_context_data()
        if ctx['object'].is_connected is False:
            return self.template_name2
        return self.template_name

    def get_success_url(self):
        return reverse_lazy('accounts')

    def get_context_data(self, **kwargs):
        ctx = super(ContactUpdateNoteView, self).get_context_data(**kwargs)

        contact = ctx['object']
        owner = contact.owner
        qs = ChatMessage.objects.filter(owner=owner,
                                        contact=contact).order_by('time')
        ctx['chats'] = qs.all()[:10]
        ctx['chatform'] = CreateChatMesgForm()
        # print('ctx:', ctx)
        return ctx


@method_decorator(decorators, name='dispatch')
class ContactChatMessageView(AjaxHttpResponse, CreateView):
    model = ChatMessage
    form_class = CreateChatMesgForm

    def form_valid(self, form):
        
        chat = form.save(commit=False)
        contact = get_object_or_404(Inbox, pk=self.kwargs.get('pk'))
        contact.status = ContactStatus.TALKING_N
        contact.save()
        chat.send_message(contact)
        # place a taskscheduel record
        BotTask.make_bottask(owner=chat.owner, name=chat, extra_id=chat.id,
                            task_type=BotTaskType.POSTMESSAGE)
        #print('chat:', chat)
        #return super(ContactChatMessageView, self).form_valid(form)
        return self.AjaxResponse()

    def form_invalid(self, form):
        #print('invalid form:', form)
        return super(ContactChatMessageView, self).form_invalid(form)

    def get_success_url(self):
        return  reverse_lazy('contact-update-note',
                                      kwargs=self.kwargs)
