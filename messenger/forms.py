from django import forms
from django.utils.translation import gettext_lazy as _

from messenger.models import Campaign, CampaignStep, ChatMessage, Inbox
from django.forms.models import inlineformset_factory


css_form_attrs = {'class': 'form-control',
                  'placeholder': 'Textarea'}
textarea_css = {'class': ''}
# textarea_css.update({'rows': 20})


# css_form_attrs = {'class': 'form-control'}
# textarea_css = css_form_attrs
# textarea_css.update({'rows': 3})

class CreateCampaignForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        is_bulk = kwargs.pop('is_bulk', False)
        owner_id = kwargs.pop('owner_id', None)
        super(CreateCampaignForm, self).__init__(*args, **kwargs)
        if owner_id:
            self.fields['copy_campaign'].queryset = Campaign.objects.filter(
                owner_id=owner_id, is_bulk=is_bulk)
        else:
            self.fields['copy_campaign'].queryset = Campaign.objects.filter(
                is_bulk=is_bulk)

    title = forms.CharField(
        label=_('NAME YOUR CONNECTION CAMPAIGN'),
        widget=forms.TextInput(
            attrs=css_form_attrs)
    )

    copy_campaign = forms.ModelChoiceField(
        required=False,
        label=_('COPY STEPS FROM AN EXISTING CONNECTION CAMPAIGN'),
        widget=forms.Select(attrs=css_form_attrs),
        queryset=Campaign.objects.all()
    )

    class Meta:
        model = Campaign
        fields = ('title', 'copy_campaign',)


class CreateChatMesgForm(forms.ModelForm):
    textarea_css['placeholder'] = 'Introduce yourself to the contact'
    text = forms.CharField(
        widget=forms.Textarea(attrs=textarea_css))

    class Meta:
        model = ChatMessage
        fields = ('text',)


class UpdateContactNoteForm(forms.ModelForm):
    notes = forms.CharField(
        widget=forms.Textarea(attrs=textarea_css))

    class Meta:
        model = Inbox
        fields = ('notes',)


class CreateCampaignMesgForm(CreateCampaignForm):
    def __init__(self, *args, **kwargs):
        super(CreateCampaignMesgForm, self).__init__(*args, **kwargs)
        self.fields['title'].label = 'Messenger Campaign name'
        self.fields['copy_campaign'].label = 'Copy Messenger Campaign steps from'


class UpdateCampWelcomeForm(forms.ModelForm):
    welcome_message = forms.CharField(
        label=_('Message'),
        widget=forms.Textarea(attrs=textarea_css))

    class Meta:
        model = Campaign
        fields = ('welcome_message',)


WELCOME_TIMES = (
    (0, "SEND IMMEDIATELY AFTER CONNECTING IF NO REPLY"),
    (15, "SEND 15 MIN AFTER CONNECTING IF NO REPLY"),
    (30, "SEND 30 MIN AFTER CONNECTING IF NO REPLY"),
    (45, "SEND 45 MIN AFTER CONNECTING IF NO REPLY"),
    (60, "SEND 1 HOUR AFTER CONNECTING IF NO REPLY"),
    (240, "SEND 4 HOURS AFTER CONNECTING IF NO REPLY"),
    (480, "SEND 8 HOURS AFTER CONNECTING IF NO REPLY"),
    (720, "SEND 12 HOURS AFTER CONNECTING IF NO REPLY"),
    (1440, "SEND 24 HOURS AFTER CONNECTING IF NO REPLY"),
    (2880, "SEND 48 HOURS AFTER CONNECTING IF NO REPLY"),
    (4320, "SEND 72 HOURS AFTER CONNECTING IF NO REPLY"),
    (7200, "SEND 5 DAYS AFTER CONNECTING IF NO REPLY"),
)

STEP_TIMES = (
    (1, "SEND 1 DAY AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (2, "SEND 2 DAYS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (3, "SEND 3 DAYS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (4, "SEND 4 DAYS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (5, "SEND 5 DAYS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (6, "SEND 6 DAYS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (7, "SEND 7 DAYS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (8, "SEND 8 DAYS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (9, "SEND 9 DAYS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (10, "SEND 10 DAYS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (14, "SEND 2 WEEKS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (28, "SEND 4 WEEKS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (60, "SEND 2 MONTHS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (90, "SEND 3 MONTHS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (180, "SEND 6 MONTHS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (270, "SEND 9 MONTHS AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (365, "SEND 1 YEAR AFTER PREVIOUS MESSAGE IF NO REPLY"),
    (730, "SEND 2 YEARS AFTER PREVIOUS MESSAGE IF NO REPLY"),
)


class UpdateCampConnectForm(forms.ModelForm):
    textarea_css['placeholder'] = 'Introduce yourself to the contact'
    connection_message = forms.CharField(
        widget=forms.Textarea(attrs=textarea_css))

    class Meta:
        model = Campaign
        fields = ('connection_message',)


class CampaignStepForm(forms.ModelForm):
    step_time = forms.ChoiceField(
        widget=forms.Select(attrs=css_form_attrs),
        choices=STEP_TIMES,
        )
    textarea_css['placeholder'] = 'Send your welcome message to the contact'
    message = forms.CharField(
        label=_('Welcome Message'),

        widget=forms.Textarea(attrs=textarea_css))

    class Meta:
        model = CampaignStep
        fields = ('step_time', 'message',)


InlineCampaignStepFormSet = inlineformset_factory(Campaign, CampaignStep,
                                                  form=CampaignStepForm,
                                                  fields=('step_time', 'message'),
                                                  extra=1, can_delete=True)

