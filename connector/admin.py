from django.contrib import admin

from .models import Search, SearchResult, TaskQueue

class SearchAdmin(admin.ModelAdmin):
    list_filter = ('keyword', 'url_search', 'sales_search',)
    list_display = ('search_name', 'result_count',) +  list_filter
    
class TaskQueueAdmin(admin.ModelAdmin):
    list_filter = ('queue_type', 'status',)
    list_display = list_filter

class SearchResultAdmin(admin.ModelAdmin):
    list_filter = ('owner', 'search', 'status',)
    list_display = ('name',) +  list_filter

admin.site.register(Search, SearchAdmin)
admin.site.register(SearchResult, SearchResultAdmin)
admin.site.register(TaskQueue, TaskQueueAdmin)
