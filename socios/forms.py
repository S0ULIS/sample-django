from django import forms
from .models import Socio, Variedade
# creating a form
class EstanciaForm(forms.Form):
    socio = forms.IntegerField()

class SocioForm(forms.ModelForm):
    
    class Meta:
        model = Socio
        fields = ['numeroSocio', 'nombre', 'apellidos', 'DNI', 'saldo', 'email', 'profilePhoto']

class DonacionForm(forms.Form):
    numeroSocio = forms.IntegerField()
    aportacion = forms.FloatField(min_value=0.)

class DispensacionForm(forms.Form):
    numeroSocio = forms.IntegerField()
    dispensaciones = forms.CharField()

class BarraForm(forms.Form):
    numeroSocio = forms.IntegerField()
    dispensaciones = forms.CharField()

class VariedadeForm(forms.ModelForm):

    class Meta:
        model = Variedade
        fields = ['nombre', 'tipo', 'aportacion', 'THC', 'CBD', 'sativa', 'disponible', 'fotasoYerbon']


