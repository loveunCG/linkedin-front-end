from django.contrib.auth import get_user_model
from django.core import serializers
from django.core.serializers import json
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
User = get_user_model()
import pytz
from datetime import datetime


class BotTaskStatus:
    QUEUED = 'Queued'
    RUNNING = 'Running'
    PIN_REQUIRED = 'Pin Required'
    PIN_CHECKING = 'Pin Checking'
    PIN_INVALID = 'Pin Invalid'
    ERROR = 'Error'
    DONE = 'Done'
    statuses = (
        (QUEUED, QUEUED),
        (RUNNING, RUNNING),
        (PIN_REQUIRED, PIN_REQUIRED),
        (PIN_CHECKING, PIN_CHECKING),
        (PIN_INVALID, PIN_INVALID),
        (ERROR, ERROR),
        (DONE, DONE),
    )


class MemberShipField(models.Model):
    max_seat = models.IntegerField(default=1)
    max_search = models.IntegerField(default=5)
    max_search_result = models.IntegerField(default=500)
    price = models.FloatField(default=0.00)
    max_campaign = models.IntegerField(default=5)
    twoway_comm = models.BooleanField(default=True)
    welcome_message = models.BooleanField(default=True)
    custom_connect_message = models.BooleanField(default=False)
    company_title_search = models.BooleanField(default=False)
    withdrawn_invite = models.BooleanField(default=False)
    export_csv = models.BooleanField(default=False)
    day_to_live = models.IntegerField(default=7)

    class Meta:
        abstract = True


class LinkedInUser(models.Model):
    user = models.ForeignKey(User, related_name='linkedusers',
                             on_delete=models.CASCADE)
    membership = models.ManyToManyField('Membership')
    email = models.CharField(max_length=254, unique=True)
    password = models.CharField(max_length=32)
    latest_login = models.DateTimeField(blank=True, null=True)
    status = models.BooleanField(default=False)
    login_status = models.BooleanField(default=False)
    tz = models.CharField(max_length=50, default='America/New_York')
    start_from = models.IntegerField(default=0)
    start_to = models.IntegerField(default=12)
    message_limit_default = models.IntegerField(default=75)
    is_weekendwork = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    is_dev = models.BooleanField(default=False)
    # for bot ip
    bot_ip = models.GenericIPAddressField(blank=True, null=True)
    last_message_send_date = models.DateField(blank=True, null=True)
    message_count = models.IntegerField(default=0)

    def __str__(self):
        return self.email

    def get_messenger_campaigns(self):
        #
        xx = [x for x in self.messegercampaigns.all() if x.is_bulk]

        return xx

    def get_connector_campaigns(self):
        return [x for x in self.messegercampaigns.all() if x.is_bulk == False]

    def is_now_campaign_active(self):
        try:
            tz = self.tz
            account_timezone = pytz.timezone(tz)
            account_time = timezone.now().astimezone(account_timezone)
        except Exception as e:
            account_time = timezone.now()
        # check weekends
        if self.is_weekendwork == False:
            if account_time.weekday() > 4:
                return False
            
        hour = account_time.hour
        print("self.start_from == ")
        print(self.start_from)
        print("hour === ")
        print(hour)
        print("self.start_to ===== ")
        print(self.start_to)
        return self.start_from <= hour <= self.start_to

    def activate(self):
        # not using this now
        """
        membership = None
        try:
            membership = Membership.objects.get(user=self.user)

        except Exception as err:
            print('activate error:', err)
            # TODO, please check and add 'Free' membership if this is the first account
            # otherwise, show error and require add 'membership' by make payment
        """
        
        self.latest_login = timezone.now()
        self.status = True
        self.login_status = True
        self.save()
        # not use this now
        """
        if membership:
            self.membership.add(membership)
        """

class MembershipType(MemberShipField):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Membership(models.Model):
    user = models.ForeignKey(User, related_name='subscriptions',
                             on_delete=models.CASCADE)
    membership_type = models.ForeignKey(MembershipType,
                                        related_name='membership_types',
                                        on_delete=models.CASCADE
                                        )
    valid_from = models.DateTimeField(blank=True, null=True)
    valid_to = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    active = models.BooleanField(default=False)

    def __str__(self):
        return "{0}-{1}-{1}".format(self.user.email,
                                    self.membership_type.name,
                                    self.valid_to)


class BotTaskType:
    ADD_ACCOUNT = 'Add Account'

    LOGIN = 'login'
    PINVERIFY = 'pinverify'
    CONTACT = 'contact'  # get contacts
    MESSAGING = 'messaging'  # get messaging
    SEARCH = 'search'
    POSTMESSAGE = 'postmessage'  # post a message to contact
    POSTCONNECT = 'postconnect'  # post a message for connection
    CHECKMESSAGE = 'checkmessage'  # check a posted message
    CHECKCONNECT = 'checkconnect'  # check a posted connect message

    # Data_sync internal used only
    DATA_SYNC = 'Data_Sync'

    task_types = (
        (LOGIN, LOGIN),
        (PINVERIFY, PINVERIFY),
        (CONTACT, CONTACT),
        (MESSAGING, MESSAGING),
        (SEARCH, SEARCH),
        (POSTMESSAGE, POSTMESSAGE),
        (POSTCONNECT, POSTCONNECT),
        (CHECKMESSAGE, CHECKMESSAGE),
        (CHECKCONNECT, CHECKCONNECT),
    )


class BotTask(models.Model):
    owner = models.ForeignKey(LinkedInUser, related_name='bottasks',
                              on_delete=models.CASCADE)
    task_type = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    extra_info = models.TextField(blank=True, null=True)
    extra_id = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=BotTaskStatus.statuses,
                              default=BotTaskStatus.QUEUED)
    lastrun_date = models.DateTimeField(blank=True, null=True)
    completed_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.name

    def toJSON(self):
        xjson = serializers.serialize('json', [self, ])
        return xjson

    @staticmethod
    def make_bottask(**kwargs):
        """
        owner=connect_campaign.owner, task_type=BotTaskType.CHECKCONNECT,
        extra_id=chat_message.id, name=BotTaskType.CHECKCONNECT, )
        """

        return BotTask.objects.create(**kwargs)


class FreeBotIP(models.Model):
    bot_ip = models.GenericIPAddressField()

    def __str__(self):
        return str(self.bot_ip)


class AdminEmail(models.Model):
    email = models.EmailField(max_length=70, blank=True)

    def __str__(self):
        return str(self.email)