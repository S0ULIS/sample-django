from .models import Socio, Mes
from datetime import datetime


def avisar():
	fecha = datetime.now()
	socios = Socio.objects.filter(estado="Renovado")
	for socio in socios:
		if Mes.objects.filter(fecha__month=fecha.month,socio = socio).count()==0:
			socio.estado = "Avisado"
			socio.enviarMail = False
			socio.save()
			
			
def revisar():
	fecha = datetime.now()
	socios = Socio.objects.filter(estado="Avisado")
	for socio in socios:
		if Mes.objects.filter(fecha__month=fecha.month,socio = socio).count()==0:
			socio.estado = "No Renovado"
			socio.enviarMail = False
			socio.save()