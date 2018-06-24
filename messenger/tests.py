from django.test import TestCase
from messenger.forms import CreateCampaignForm, CreateCampaignMesgForm

class TestForms(TestCase):
    
    def test_form(self):
        f1 = CreateCampaignForm()        
        self.assertFalse(f1.is_valid(), f1.errors)
        
        f1 = CreateCampaignForm({'title': 'camp1'})
        self.assertTrue(f1.is_valid(), "Form valid")
        
        f1 = CreateCampaignMesgForm()
        self.assertFalse(f1.is_valid(), "Form valid")
        
        f1 = CreateCampaignMesgForm({'title': 'camp1'})
        self.assertTrue(f1.is_valid(), "Form valid")