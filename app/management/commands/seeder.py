#-*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from app.models import MembershipType, LinkedInUser
from django.contrib.auth import get_user_model
from messenger.models import Inbox, ContactStatus
from django.utils.crypto import random
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    MAX_INT = 2147483647
    
    def create_admin(self):
        User = get_user_model()
        user = User.objects.create_superuser('admin', 'admin@cgito.net', 'tech123$%')
        print('user:', user.id)
        
    def add_arguments(self, parser):
        super(Command, self).add_arguments(parser)
        parser.add_argument("--max", "-m", default=2, type=int)
        parser.add_argument("--inbox", "-b", action='store_true')
        parser.add_argument("--admin", "-a", action='store_true')
        
    def handle(self, *args, **options):
        if (options.get('admin', False)):
            self.create_admin()
                
        if (options.get('inbox', False)):
            self.create_inboxes(options.get('max'))
            
    def create_inboxes(self, max, reset=False):
        if reset:
            Inbox.objects.all().delete()
        locations = ['Vietnam', 'Hochiminh city Vietnam', 'HaNoi Vietnam',
                     'California US', 'US', 'Canada', 'Vancouver Candada']
        now = timezone.now()
        dates = [now - timedelta(days=x) for x in range(max)]
        titles = ['CEO', 'CTO', 'HR', 'Developer', 'PM', 'Leader', 'Founder',
                  'Amatour']
        first_names = ['John', 'David', 'Arthur', 'Thomas', 'Heeze']
        last_names = ['Stephon', 'Gooze', 'Bax', 'Giss', 'Aman']
        is_connecteds = [True, False]
        industries = ["Computer/Softare", "Food and Retailer", "It Services"]
        
        owner = LinkedInUser.objects.first()
        
        for i in range(max):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            name = '{first} {last}'.format(first=first_name , last=last_name)
            company = "Company {0}".format(i)
            location = random.choice(locations)
            status = random.choice(ContactStatus.inbox_statuses)[0]
            last_activity = random.choice(dates)
            title = random.choice(titles)
            industry = random.choice(industries)
            
            is_connected = random.choice(is_connecteds)
            Inbox.objects.create(name=name, title=title, company=company,
                                 linkedin_id=str(i), is_connected=is_connected,
                                 location=location, latest_activity=last_activity,
                                 status=status, owner=owner, industry=industry)