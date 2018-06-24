from django import template
from jetbuzz.settings import SITE_TITLE
from app.utils import get_main_plan
register = template.Library()


@register.simple_tag
def site_title():
    return SITE_TITLE


@register.simple_tag(takes_context=True)
def current_subscription(context):
    subscriptions = context['object_list']
    if subscriptions is not None and len(subscriptions) > 0:
        
        return  subscriptions[0]
 
@register.simple_tag()
def get_plans():
    return get_main_plan()

@register.simple_tag()
def day_left(date, date2):
    #print(type(date), date, type(date2), date2)
    try:
        delta = date2 - date
    
        return delta.days
    except:
        pass
    return 0