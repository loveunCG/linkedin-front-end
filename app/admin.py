from django.contrib import admin

from .models import (Membership, MembershipType,
                     LinkedInUser, BotTask, FreeBotIP, AdminEmail)

class MembershipAdmin(admin.ModelAdmin):
    pass

class MembershipTypeAdmin(admin.ModelAdmin):
    pass

class LinkedInUserAdmin(admin.ModelAdmin):
    list_filter = ('user', 'status', 'login_status')
    list_display = ('email', ) + list_filter

class BotTaskAdmin(admin.ModelAdmin):
    list_filter = ('owner', 'status')
    list_display = ('name', 'task_type', 'extra_info',
                    'completed_date') + list_filter

class FreeBotIPAdmin(admin.ModelAdmin):
    list_filter = ('bot_ip', )
    list_display = list_filter
  
admin.site.register(Membership, MembershipAdmin)
admin.site.register(MembershipType, MembershipTypeAdmin)
admin.site.register(LinkedInUser, LinkedInUserAdmin)
admin.site.register(BotTask, BotTaskAdmin)
admin.site.register(FreeBotIP, FreeBotIPAdmin)
admin.site.register(AdminEmail)
