from django import forms


class SearchForm(forms.Form):
    search_name = forms.CharField(max_length=254)
    keyword = forms.CharField(max_length=254)

class CreateConnectorCampaign(forms.Form):
    connector_name =  forms.CharField(max_length=200)
    copy_connector_name = forms.CharField(max_length=200)
