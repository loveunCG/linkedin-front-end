import json

import datetime
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand
from django.utils import timezone

from app.models import BotTask, BotTaskStatus, BotTaskType
from connector.models import TaskQueue, Search
from jetbuzz.settings import MAXIMUM_CAMPAIGN_MESSAGE_PER_ACCOUNT
from messenger.models import Campaign, ChatMessage


class Command(BaseCommand):
    help = 'collect_search : it will process all pending search results'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        self.check_or_add_search_task()
        self.check_or_add_campaign_task()

    def check_or_add_search_task(self):
        pending_task_list = BotTask.objects.filter(task_type=BotTaskType.SEARCH).exclude(
            status__in=[BotTaskStatus.DONE, BotTaskStatus.ERROR])
        for pending_task in pending_task_list:
            try:
                search = Search.objects.get(id=pending_task.extra_id)
                queue_type = ContentType.objects.get_for_model(search)
                task_queue = TaskQueue.objects.filter(object_id=search.id, queue_type=queue_type)
                if task_queue:
                    task = task_queue[0]
                    pending_task.status = task.status
                    pending_task.save()
                else:
                    search = Search.objects.get(id=pending_task.extra_id)
                    TaskQueue(content_object=search, owner=pending_task.owner).save()
            except:
                print("ERROR pending_task.extra_id =")
                print(pending_task.extra_id)
                pass

    def check_or_add_campaign_task(self):
        connect_campaigns = Campaign.objects.filter(status=True)
        for connect_campaign in connect_campaigns:
            if connect_campaign.owner.is_now_campaign_active():
                queue_type = ContentType.objects.get_for_model(connect_campaign)
                task_queue = TaskQueue.objects.filter(object_id=connect_campaign.id, queue_type=queue_type)
                contacts = connect_campaign.contacts.all()
                task_type = BotTaskType.POSTMESSAGE if connect_campaign.is_bulk else BotTaskType.POSTCONNECT
                if not task_queue:
                    TaskQueue(owner=connect_campaign.owner, content_object=connect_campaign).save()
                for contact in contacts:
                    try:
                        print('contact', contact, 'campaign', connect_campaign)

                        get_chat_message = ChatMessage.objects.get(owner=connect_campaign.owner, contact=contact,
                                                                   campaign=connect_campaign)

                        if get_chat_message.is_sent and not (
                                    get_chat_message.replied_date or get_chat_message.replied_other_date):
                            check_task_type = BotTaskType.CHECKCONNECT if task_type == BotTaskType.POSTCONNECT else BotTaskType.CHECKMESSAGE
                            BotTask.objects.get_or_create(owner=connect_campaign.owner, task_type=check_task_type,
                                                          extra_id=get_chat_message.id,
                                                          name=connect_campaign)
                        continue
                    except:
                        if connect_campaign.owner.last_message_send_date == datetime.date.today() and \
                                        connect_campaign.owner.message_count >= min(
                                    MAXIMUM_CAMPAIGN_MESSAGE_PER_ACCOUNT, connect_campaign.owner.message_limit_default):
                            continue

                        if connect_campaign.owner.last_message_send_date != datetime.date.today():
                            connect_campaign.owner.last_message_send_date = datetime.date.today()
                            connect_campaign.owner.message_count = 0
                            connect_campaign.owner.save()

                        message = connect_campaign.format_message(contact)
                        chat_message = ChatMessage(owner=connect_campaign.owner, contact=contact,
                                                   campaign=connect_campaign,
                                                   text=message, time=timezone.now())
                        chat_message.save()
                        bot_task = BotTask(owner=connect_campaign.owner, task_type=task_type, extra_id=chat_message.id,
                                name=connect_campaign)
                        bot_task.save()
                        connect_campaign.owner.message_count += 1
                        connect_campaign.owner.save()
