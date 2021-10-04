from .models import Socio
from rest_framework import serializers


class SocioSerializer(serializers.ModelSerializer):

  fotoPerfil = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
  class Meta:
      model = Socio
      fields = ('nombre', 'apellidos', 'saldo', 'fotoPerfil', 'DNI', 'email', 'dentro')

