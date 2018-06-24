import json

from django.db import models
from django.utils import timezone

from app.models import LinkedInUser
from django.urls.base import reverse_lazy

try:
    from django.utils.encoding import force_text
except ImportError:
    from django.utils.encoding import force_unicode as force_text


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ContactStatus(object):
    ALL_N = -1  # All
    LATER_N = 200  # Later
    CONNECTED_N = 3  # connected
    CONNECT_REQUESTED_N = 1  # connect requested
    DISCONNECTED_N = 23  # disconeted
    IN_QUEUE_N = 0  # in queue
    LATER_N = 20  # later
    MESSAGE_N = 7  # message - sent message
    NO_INTEREST_N = 21  # no iterested
    OLD_CONNECT_N = 22  # old connect - use this when the contact is first imported
    REPLIED_N = 10  # replie
    TALKING_N = 12  # talking
    TALKING_REPLIED_N = 100  # talking and replied
    WELCOME_MES_N = 6  # sent welcome message
    CONNECT_REQ_N = 5  # connect request
    UNREAD_N = 200  # unread

    ALL = 'All'
    LATER = 'Later'
    MESSAGE = 'Message'
    NO_INTEREST = 'No Interest'
    OLD_CONNECT = 'Old Connect'
    REPLIED = 'Replied'
    TALKING = 'Talking'
    TALKING_REPLIED = 'Talking & Replied'

    CONNECTED = 'Connected'
    CONNECT_REQUESTED = 'Connect Requested'
    DISCONNECTED = 'Disconnected'
    IN_QUEUE = 'In Queue'
    CONNECT_REQ = 'Connect Req'

    WELCOME_MES = 'Welcome Mes'
    UNREAD = 'Unread'

    contact_statuses = (
        (ALL_N, ALL),
        (LATER_N, LATER),
        (MESSAGE_N, MESSAGE),
        (NO_INTEREST_N, NO_INTEREST),
        (OLD_CONNECT_N, OLD_CONNECT),
        (REPLIED_N, REPLIED),
        (TALKING_N, TALKING),
        (TALKING_REPLIED_N, TALKING_REPLIED),
    )

    IMPORTED = 'Imported'
    CONNECTOR = 'connector'
    MESSENGER = 'messenger'

    # connector_messengers = (
    #    (IMPORTED, IMPORTED),
    #    (IN_QUEUE, IN_QUEUE),
    # )

    inbox_statuses = (
        (ALL_N, ALL),
        (UNREAD_N, UNREAD),
        (CONNECTED_N, CONNECTED),
        (CONNECT_REQUESTED_N, CONNECT_REQUESTED),
        (DISCONNECTED_N, DISCONNECTED),
        (IN_QUEUE_N, IN_QUEUE),
        (NO_INTEREST_N, NO_INTEREST),
        (LATER_N, LATER),
        (MESSAGE_N, MESSAGE),
        (OLD_CONNECT_N, OLD_CONNECT),
        (REPLIED_N, REPLIED),
        (TALKING_N, TALKING),
        (TALKING_REPLIED_N, TALKING_REPLIED),
        (WELCOME_MES_N, WELCOME_MES),
    )

    search_result_statuses = (
        (IN_QUEUE_N, IN_QUEUE),
        (CONNECT_REQ_N, CONNECT_REQ)
    )

    CHAT_MSG = 'Chat'

    MESSSAGETYPES = (
        (REPLIED_N, REPLIED),
        (TALKING_N, TALKING),
        (TALKING_REPLIED_N, TALKING_REPLIED),
        (CONNECT_REQ_N, CONNECT_REQ)
    )
    # status for ui select
    inbox_page_statuses = (
        (ALL_N, ALL),
        (CONNECTED_N, CONNECTED),
        (CONNECT_REQUESTED_N, CONNECT_REQUESTED),
        (DISCONNECTED_N, DISCONNECTED),
        (IN_QUEUE_N, IN_QUEUE),
        (LATER_N, LATER),
        (MESSAGE_N, MESSAGE),
        (NO_INTEREST_N, NO_INTEREST),
        (OLD_CONNECT_N, OLD_CONNECT),
        (REPLIED_N, REPLIED),
        (TALKING_N, TALKING),
        (TALKING_REPLIED_N, TALKING_REPLIED),
        (WELCOME_MES_N, WELCOME_MES),
    )
    mynetwork_page_statuses = (
        (ALL_N, ALL),
        (LATER_N, LATER),
        (MESSAGE_N, MESSAGE),
        (NO_INTEREST_N, NO_INTEREST),
        (OLD_CONNECT_N, OLD_CONNECT),
        (REPLIED_N, REPLIED),
        (TALKING_N, TALKING),
        (TALKING_REPLIED_N, TALKING_REPLIED),
    )

    @staticmethod
    def valid_status(status):
        for n, v in ContactStatus.inbox_statuses:
            if n == status:
                return True
        return False


class CommonContactField(models.Model):
    company = models.CharField(max_length=100, db_index=True, blank=True,
                               null=True)
    industry = models.CharField(max_length=100, db_index=True, blank=True,
                                null=True)
    location = models.CharField(max_length=100, db_index=True, blank=True,
                                null=True)
    title = models.CharField(max_length=100, db_index=True, blank=True,
                             null=True)

    class Meta:
        abstract = True


class ContactField(CommonContactField):
    linkedin_id = models.CharField(max_length=50, unique=False)
    name = models.CharField(max_length=100, db_index=True)
    latest_activity = models.DateTimeField(blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    countrycode = models.CharField(max_length=3, blank=True, null=True)
    class Meta:
        abstract = True




# this is not a real entity, the list inbox with is_connected = True
"""
class Contact(TimeStampedModel, ContactField):
    owner = models.ForeignKey(LinkedInUser, related_name='contacts',
                                on_delete=models.CASCADE)

    status = models.CharField(max_length=20,
                              choices=ContactStatus.contact_statues,
                              default=ContactStatus.OLD_CONNECT)
    notes = models.TextField()

    def __str__(self):
        return force_text(str(self.account_id) + "  " + self.name)

    class Meta():
        abstract = False
        # db_table = 'contacts'
"""


class Campaign(TimeStampedModel):
    owner = models.ForeignKey(LinkedInUser, related_name='messegercampaigns',
                              on_delete=models.CASCADE)
    title = models.CharField(max_length=100, db_index=True)
    status = models.BooleanField(default=True)
    contacts = models.ManyToManyField("Inbox", related_name="campaigns")
    copy_campaign = models.ForeignKey('self', on_delete=models.SET_NULL,
                                      blank=True, null=True)

    # True is messenger campaign, false is connector campaign
    is_bulk = models.BooleanField(default=False)
    connection_message = models.TextField(max_length=2000, blank=True, null=True)
    welcome_message = models.TextField(max_length=2000, blank=True, null=True)
    welcome_time = models.IntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return self.title

    def format_message(self, contact):
        return self.connection_message.format(Name=contact.name,
                                  FirstName=contact.first_name,
                                  Company=contact.company,
                                  Title=contact.title,
                                  Location=contact.location)

    def copy_step_message(self):
        copy_campaign = self.copy_campaign
        self.welcome_message = copy_campaign.welcome_message
        self.connection_message = copy_campaign.connection_message
        self.save()
        print('self.welcome_message:', self.welcome_message)

        for cc in copy_campaign.campaignsteps.all():
            cc.clone(self)

    def get_absolute_url(self):
        kwargs = dict(pk=self.id)
        if self.is_bulk:
            return reverse_lazy('messenger-campaign', kwargs=kwargs)
        return reverse_lazy('connector-campaign', kwargs=kwargs)

    def get_message(self):
        data = {}
        data['campaign_id'] = self.id
        data['connection_message'] = self.connection_message
        data['welcome_message'] = self.welcome_message
        data['welcome_time'] = self.welcome_time
        return json.dumps((data))
    
    def get_replied_queryset(self):
        return ChatMessage.objects.filter(campaign__pk=self.pk).exclude(replied_date=None)
    
    def count_reply_other(self):
        #return len(ChatMessage.objects.filter(campaign__pk=self.pk).exclude(replied_date=None).exclude(replied_other_date=None))
        # return ChatMessage.objects.filter(campaign__pk=self.pk).exclude(replied_date=None).exclude(replied_other_date=None).count()
        qs = self.get_replied_queryset()
        return qs.exclude(campaignstep=None).count()

    def count_replies(self):
        #return len(ChatMessage.objects.filter(campaign__pk=self.pk).exclude(replied_date=None))
        # return ChatMessage.objects.filter(campaign__pk=self.pk).exclude(replied_date=None).count()
        qs = self.get_replied_queryset()
        return qs.filter(campaignstep=None).count()

    def count_sends(self):
        #return len(ChatMessage.objects.filter(campaign__pk=self.pk, is_sent=True))
        return ChatMessage.objects.filter(campaign__pk=self.pk, is_sent=True).count()

    def connected_count(self):
        # messenger one, all are connected
        if self.is_bulk:
            return 0
        
        qs = self.contacts.exclude(connected_date=None).filter(is_connected=True)
        return qs.count()
        
    
    def clone_search_rs_to_inbox(self, qs):
        # is there a better way to do this??
        qs.update(status=ContactStatus.IN_QUEUE_N,)
        for row in qs.all():
            row.attach_to_campaign(self)  


class CampaignStepField(models.Model):
    step_number = models.IntegerField(db_index=True, default=1)
    step_time = models.IntegerField(blank=True, null=True, default=0)
    message = models.TextField()
    action = models.CharField(max_length=100, db_index=True)

    class Meta:
        abstract = False


class CampaignStep(TimeStampedModel, CampaignStepField):
    campaign = models.ForeignKey(Campaign, related_name='campaignsteps',
                                 on_delete=models.CASCADE)

    class Meta():
        abstract = False

    def clone(self, parent):
        self.pk = None
        self.campaign = parent
        self.save()

    def __str__(self):
        return "{0} - {1}".format(self.campaign, self.step_time)


class MessageField(TimeStampedModel):
    text = models.TextField()
    time = models.DateTimeField()

    class Meta():
        abstract = True


class ChatMessage(MessageField):
    owner = models.ForeignKey(LinkedInUser, related_name='chatmessages',
                              on_delete=models.CASCADE)
    contact = models.ForeignKey("Inbox", related_name='contact_messages',
                                on_delete=models.SET_NULL, null=True)
    type = models.IntegerField(blank=True,
                               choices=ContactStatus.MESSSAGETYPES,
                               default=ContactStatus.TALKING_N)
    campaign = models.ForeignKey(Campaign, related_name='campaign_messages',
                                 on_delete=models.CASCADE, blank=True,
                                 null=True)
    replied_date = models.DateTimeField(blank=True, null=True)
    replied_other_date = models.DateTimeField(blank=True, null=True)

    #parent = models.ForeignKey('self', related_name='previous', blank=True,
    #                           null=True, on_delete=models.CASCADE)
    
    is_read = models.BooleanField(default=True)
    is_direct = models.BooleanField(default=True)
    is_sent = models.BooleanField(default=False)
    
    campaignstep = models.ForeignKey('CampaignStep', related_name='previous', blank=True,
                               null=True, on_delete=models.CASCADE)

    class Meta():
        abstract = False

    def __str__(self):
        if self.campaign:
            return self.campaign.title
        return self.contact.name

    def send_message(self, contact):

        self.owner = contact.owner
        self.contact = contact
        self.time = timezone.now()
        self.save()
        # change status
        if contact.status != ContactStatus.IN_QUEUE_N:
            contact.change_status(ContactStatus.TALKING_N)


class Inbox(ContactField):
    owner = models.ForeignKey(LinkedInUser, related_name='inboxes',
                              on_delete=models.CASCADE)
    # first_name = models.CharField(max_length=50, blank=True, null=True)
    # last_name = models.CharField(max_length=50, blank=True, null=True)
    status = models.IntegerField(choices=ContactStatus.inbox_statuses,
                                 default=ContactStatus.OLD_CONNECT_N)
    is_connected = models.BooleanField(default=False)

    connected_date = models.DateTimeField(blank=True, null=True)

    # to save notes at convesation on right
    notes = models.TextField(blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    countrycode = models.CharField(max_length=3, blank=True, null=True)

    class Meta():
        abstract = False

    def __str__(self):
        return self.name

    def detach_from_campaigns(self):
        self.campaigns.clear()

    def change_status(self, new_status):
        if self.status != new_status:
            self.status = new_status
            self.save()

    def attach_to_campaign(self, campaign):
        # detach from other campain
        self.detach_from_campaigns()
        self.change_status(ContactStatus.IN_QUEUE_N)
        campaign.contacts.add(self)

    # def first_name(self):
    #
    #     if self.first_name is not None:
    #         return self.first_name
    #     else:
    #         return self.name.split(' ')[0]