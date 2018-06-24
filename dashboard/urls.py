from django.conf.urls import url

# settings

from .views import DashBoard, Proxy


urlpatterns = [
    url(r'bot_status/(?P<pk>(\d+))', Proxy.check_bot_status, name='bot-status'),
    url(r'bot_log/(?P<pk>(\d+))', Proxy.bot_list_view, name='bot-log'),
    url(r'bot_list/(?P<pk>(\d+))', Proxy.bot_list, name='bot-list'),
    url(r'^$', DashBoard.as_view(), name='dashboard'),
    url(r'update_status', Proxy.update_status, name='updateStatus'),
    url(r'update_ip', Proxy.update_ip, name='updateIp'),
    url(r'get_account_list/', Proxy.get_linkedin_user_list, name='get_linked_list')
]
