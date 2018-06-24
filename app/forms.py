from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.forms.models import ModelForm
from django.utils.translation import gettext_lazy as _

from connector.models import Search


class RegisterForm(forms.Form):
    email = forms.EmailField(max_length=254, help_text='Required. Inform a valid email address.')
    password = forms.CharField(max_length=32, widget=forms.PasswordInput)
    confirmpassword = forms.CharField(max_length=32, widget=forms.PasswordInput)


class LoginForm(forms.Form):
    email = forms.EmailField(max_length=254, help_text='Required. Inform a valid email address.')
    password = forms.CharField(max_length=32, widget=forms.PasswordInput)


class PinForm(forms.Form):
    pincode = forms.CharField(max_length=6)


class ProfileSettingsForm(forms.Form):
    email = forms.EmailField(max_length=254, label='Email')
    password = forms.CharField(max_length=32, widget=forms.PasswordInput, label='Password')
    enable_proxy = forms.BooleanField(widget=forms.CheckboxInput, label='Enable Proxy')
    proxy_address = forms.CharField(max_length=60, widget=forms.TextInput, label='Proxy Address')
    proxy_auth_type_choices = (
        ('0', '(none)'),
        ('1', 'Plain Text Authentication'),
        ('2', 'Basic Authentication Type'),
    )
    proxy_authentication_type = forms.ChoiceField(choices=proxy_auth_type_choices, label='Proxy Authentication Type')
    proxy_username = forms.CharField(max_length=254, label='Proxy Username')
    proxy_password = forms.CharField(max_length=254, widget=forms.PasswordInput, label='Proxy Password')
    license_type_choices = (
        ('0', '14-days Free Trial Basic Subscription Plan'),
        ('1', 'Basic Subscription Plan'),
        ('2', 'Pro Subscription Plan w/Sales Navigator'),
    )
    license_type = forms.ChoiceField(choices=license_type_choices, label='License Type')


User = get_user_model()


class UserRegisterForm(UserCreationForm):
    error_messages2 = {
        'email_exists': _("The email address is in-use. Please choose another one."),
    }

    def clean_email(self):
        email = self.cleaned_data.get("email")
        user = User.objects.filter(email=email).first()
        if user is not None:
            raise forms.ValidationError(
                self.error_messages2['email_exists'],
                code='email_exists',
            )

        return email

    email = forms.EmailField(
        label='Email Address',
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'type': 'text',
        }))
    password1 = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'type': 'password',
        }))

    password2 = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'type': 'password',
        }))

    class Meta:
        model = User
        fields = ('email', 'password1', 'password2', )


class SearchForm(ModelForm):
    class Meta:
        model = Search
        fields = ['search_name', 'keyword','url_search', 'sales_search', 'location', 'industry', 'company', 'title']
