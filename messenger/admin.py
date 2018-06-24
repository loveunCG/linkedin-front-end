from django.contrib import admin

from .models import Campaign, CampaignStep, Inbox, ChatMessage

class CampaignAdmin(admin.ModelAdmin):
    pass

class InboxAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner', 'status', 'name', 'is_connected', 
                    'connected_date', 'company', 'title', 
                    'latest_activity', ) 
    list_filter = ('status', 'owner')

class CampaignStepAdmin(admin.ModelAdmin):
    pass

class ChatMessageAdmin(admin.ModelAdmin):
    list_filter = ('owner', 'contact', 'type', 'campaign')
    list_display =  ('id',) + list_filter + ('replied_date', 
                                             'replied_other_date',
                                             'short_text',) 
    
    def short_text(self, obj):
        text = obj.text
        if len(text)> 20:
            text = "{0}...".format(text[:20])
        return text
    
    
admin.site.register(Campaign, CampaignAdmin)
admin.site.register(CampaignStep, CampaignStepAdmin)
admin.site.register(Inbox, InboxAdmin)
admin.site.register(ChatMessage, ChatMessageAdmin)