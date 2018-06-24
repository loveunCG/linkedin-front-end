#-*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from app.models import MembershipType
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    MAX_INT = 2147483647
    
    def create_admin(self):
        User = get_user_model()
        user = User.objects.create_superuser('admin', 'admin@cgito.net', 'tech123$%')
        print('user:', user.id)
    def handle(self, *args, **options):
        #self.create_admin()        
        # free
        self.check_membership_type('Free')
        desc = """Add your LinkedIn account and start prospecting for new leads"""
        data = dict(day_to_live=365, price=35,
                    max_search=10, max_search_result=500,
                    max_campaign=5, description=desc)
        self.check_membership_type('Starter', **data)
        desc = """Create campaign and add new leads"""
        data.update(dict(custom_connect_message=True,
                    company_title_search=True,
                    withdrawn_invite=True, price=50,
                    max_search=50, max_search_result=750,
                    max_campaign=25, description=desc))
        
        self.check_membership_type('Professional', **data)
        desc = """Add personalized connection message and autoresponder messages"""
        data.update(dict(export_csv=True, price=75,
                         max_search=self.MAX_INT, 
                         max_search_result=self.MAX_INT,
                         max_campaign=self.MAX_INT, description=desc))
        
        self.check_membership_type('Business', **data)
    
    def check_membership_type(self, name, **kwargs):
        qs = MembershipType.objects
        if qs.filter(name=name).exists():
            print('Type:', name , ' is existed.')
            return
        
        print('Creating membership type:', name)
        data = dict(name=name)
        data.update(kwargs)        
        row = qs.create(**data)  
        print('...', row.id, '...Done.')