from django.core.management.base import BaseCommand


class Command(BaseCommand):
    
    
    def add_arguments(self, parser):
        pass
        
    
    def handle(self, *args, **options):
        
        # check if nay Profile has days_to_live is = 0 , set its User's status to 'inactive'
        #    else deduct it 1
         
        # check if any profile - days_to_live due in next x days, send and email to ask them to make a new subscription
    
        # make a summary email to admin:
        #     those are expired 
        #     Those are due
        pass
    