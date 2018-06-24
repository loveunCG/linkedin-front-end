from pinax import stripe

def get_main_plan():
    plans = stripe.models.Plan.objects.exclude(stripe_id__contains='2').order_by('amount')
    return plans

def get_current_plan(user):
    pass


