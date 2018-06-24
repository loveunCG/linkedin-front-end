from django.conf.urls import url
from messenger import views

urlpatterns = [
    #url(r'^messenger/$', views.messenger_home, name='messenger_home'),
    #url(r'^campaigns/$', views.campaigns, name='campaigns'),
    #url(r'^campaigns/(?P<campaign_id>\d+)/$', views.getcampaigns, name='get_campaigns'),
    #url(r'^delete_campaigns/(?P<campaign_id>\d+)/$', views.delete_campaigns, name='delete_campaigns'),
    #url(r'^update_campaigns/(?P<campaign_id>\d+)/$', views.update_campaigns, name='update_campaigns'),
    
    url(r'^campaign/contacts/', views.CampaignContactsView.as_view(),
        name='campaign-contacts'),
    url(r'^contacts/delete', views.ContactDeleteView.as_view(),
        name='contacts-delete'),
    url(r'^contact/(?P<pk>\d+)/chatmessage', views.ContactChatMessageView.as_view(),
        name='contact-chatmessage'),
    url(r'^contact/(?P<pk>\d+)/updatenote', views.ContactUpdateNoteView.as_view(),
        name='contact-update-note'),
]
