from django.core.exceptions import ValidationError
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from decimal import Decimal
from django.contrib import admin
import os
from datetime import datetime
from django.utils.html import mark_safe
import gmail
import pyqrcode
import base64
from reportlab.graphics import renderPDF, renderPM
# Create your models here.

def content_file_name(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (instance.socioId, ext)
    return os.path.join('fotos', filename)


class Socio(models.Model):
    socioId = models.AutoField(primary_key=True, editable=True)
    numeroSocio = models.IntegerField(unique=True)
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=250)
    saldo = models.DecimalField(max_digits=6, decimal_places=2,validators=[MinValueValidator(Decimal('0.00'))])
    email = models.CharField(max_length=200)
    restante = models.FloatField(default=0.)
    estado = models.CharField(
        max_length=100,
        choices=(("Renovado", "Renovado"), ("No Renovado","No renovado"), ("Avisado" ,"Avisado"), ("Expulsado", "Expulsado")), 
        default="Renovado"
    )
    dentro = models.BooleanField(default=False)
    enviarMail = models.BooleanField(default=True)
    fotoPerfil = models.ImageField(upload_to="fotoPerfil")
    DNI = models.CharField(max_length=9)

    class Meta(object):
        ordering = ["-saldo","apellidos","nombre"]
        permissions = ( ("edit_socio", "Editar socio"), ("send_email", "Enviar email a socio(s)"))

    def image_tag(self):
            return mark_safe('<img src="/media/%s" width="800" height="600" />' % (self.fotoPerfil))

    def add_button(self):
        text = """<script>
		function anadir(){
	let cantidad = parseFloat(document.getElementById("mas").value);

	document.getElementById("id_saldo").value = parseFloat(document.getElementById("id_saldo").value)+cantidad;
	document.getElementById("mas").value = 0;
}
	</script>
	<input type="number" id="mas" value="0"><p>        </p>
	 <button type="button" onclick="anadir()">Añadir Saldo</button> 

"""
        return mark_safe(text)

    def qr_scanner(self):
        text = """
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://rawgit.com/schmich/instascan-builds/master/instascan.min.js"></script>
<video id="preview"></video>
<script type="text/javascript">
  let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  scanner.addListener('scan', function (content) {
    let message = atob(content);
    if(isNaN(message)){
        alert("qr Incorrecto");
    }else{
      let num = (parseInt(message)-777)/1031 ;
        window.location.href = "https://127.0.0.1:8000/admin/socios/socio/"+num.toString()+"/change/";
    }
	
	
  });
  Instascan.Camera.getCameras().then(function (cameras) {
	if (cameras.length > 1) {
	  scanner.start(cameras[1]);
	}else if (cameras.length > 0){
	  scanner.start(cameras[0]);
	 }else {
	  console.error('No cameras found.');
	}
  }).catch(function (e) {
	console.error(e);
  });
//alert("Pene");
</script>
"""
        return mark_safe(text)

    def __str__(self):
        return "%s, %s %s : %s" % (self.numeroSocio,self.nombre, self.apellidos, self.saldo)

    def save(self, *args, **kwargs):
      if self.enviarMail and self.socioId!=None:
        email = self.email
        mensaje = str(self.socioId*1031+777).encode('ascii')
        cadena = "%s" % (base64.b64encode(mensaje).decode('ascii'))
        big_code = pyqrcode.create(cadena)
        big_code.png('qrs/qr%s.png' % (self.numeroSocio), scale=6, module_color=[0, 0, 0, 128], background=[0xff, 0xff, 0xcc])
        contenido = "Bienvenido %s %s, \n Esperamos que disfrutes de nuestro club igual que nosotros lo hacemos.\n Esperamos verte pronto,\n La directiva del club" % (self.nombre, self.apellidos) 
      
	
      
        """gm = gmail.GMail('lacabanaasociacion@gmail.com','L4cabana2021')
        msg = gmail.Message('Bienvenido a la cabaña',to=self.email,text=contenido, attachments=['qrs/qr%s.png' % (self.numeroSocio)])
        gm.send(msg)"""

 
      return super(Socio, self).save( *args, **kwargs)


class Config(models.Model):
    key = models.CharField(max_length=200)
    value = models.CharField(max_length=1000)
    

class Variedade(models.Model):
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(
        max_length=100,
        choices=(("Marihuana", "Marihuana"), ("BHO","BHO"), ("Polen" ,"Polen"),("Cones", "Cones"),("Consumible", "Consumible")), 
        default="Marihuana"
    )
    aportacion = models.DecimalField(max_digits=6, decimal_places=2,validators=[MinValueValidator(Decimal('0.00'))])
    THC = models.DecimalField(max_digits=4, decimal_places=2,validators=[MinValueValidator(Decimal('0.00'))])
    CBD = models.DecimalField(max_digits=4, decimal_places=2,validators=[MinValueValidator(Decimal('0.00'))], default=Decimal('0.00'))
    sativa = models.DecimalField(max_digits=4, decimal_places=2,validators=[MinValueValidator(Decimal('0.00'))])
    disponible = models.BooleanField(default=False)
    fotasoYerbon = models.CharField(max_length=1000)
    fotoYerbon = models.ImageField(upload_to="fotoYerbones", blank=True)
    videoYerbon = models.FileField(upload_to="videoYerbones", blank=True)
    stock = models.DecimalField(max_digits=5, decimal_places=2,validators=[MinValueValidator(Decimal('0.00'))])


    class Meta(object):
        ordering = ["tipo","nombre"]

    def video_tag_yerbon(self):
        return mark_safe('<video src="/media/%s" width="800" height="600" controls/>' % (self.videoYerbon))

    def image_tag_yerbon(self):
        return mark_safe('<img src="/media/%s" width="800" height="600" />' % (self.fotoYerbon))

    def __str__(self):
        return "%s %s" % (self.nombre, self.aportacion)


class Bebida(models.Model):
    nombre = models.CharField(max_length=500)

    aportacion = models.DecimalField(max_digits=6, decimal_places=2,validators=[MinValueValidator(Decimal('0.00'))])

    def __str__(self):
    	return "%s %s" % (self.nombre, self.aportacion)

class Estancia(models.Model):
	socio = models.ForeignKey("Socio", on_delete=models.PROTECT);
	fechaEntrada = models.DateTimeField(auto_now_add=True)
	fechaSalida = models.DateTimeField(auto_now_add=False, blank = True, null=True)
	fin = models.BooleanField(default=False)

	def __str__(self):
		return str(self.socio.nombre) + " , "+str(self.fechaEntrada)
    
class Mes(models.Model):
	socio = models.ForeignKey("Socio", on_delete=models.PROTECT);
	fecha = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return str(self.socio.nombre) + " , "+str(self.fechaEntrada.month)

    

class Barra(models.Model):
    socio = models.ForeignKey("Socio", on_delete=models.PROTECT)
    aportado = models.BooleanField(default=False)
    articulos = models.ManyToManyField(Bebida, related_name="Bebidas", through="Barrita")
    fuera = models.BooleanField(default=False)
    fecha = models.DateTimeField(auto_now_add=True)


    def save(self, *args, **kwargs):
        if not self.aportado and self.id!=None and not self.fuera:
            socio = self.socio
            bebidas = Barrita.objects.filter(barra=self.id)
            total = 0.
            for i in bebidas:
                total+=float(i.unidades)*float(i.bebida.aportacion)

            if total-0.01>socio.saldo:
                raise ValidationError("El coste de la retirada no puede ser mayor a los créditos del socio")
            else:
                
                socio.saldo -= Decimal(total)
                self.aportado=True
                socio.save()
                return super(Barra, self).save( *args, **kwargs)
        else:
            return super(Barra, self).save( *args, **kwargs)
   

    def __str__(self):
        return str(self.socio) + " , "+str(self.fecha)
    


class Barrita(models.Model):
	unidades = models.IntegerField()
	bebida = models.ForeignKey(Bebida, on_delete=models.PROTECT)
	barra = models.ForeignKey(Barra,on_delete=models.CASCADE)


class Dispensacione(models.Model):
    socioId = models.ForeignKey(
        'Socio',
        on_delete=models.PROTECT
    )
    fuera = models.BooleanField(default=False)
    aportado = models.BooleanField(default=False)
    dispensaciones = models.ManyToManyField(Variedade, related_name="Selecciones", through="Dispensacion")
    fecha = models.DateTimeField(auto_now_add=True)

    def image_tag(self):
            return mark_safe('<img id="imagenSocio" src="/media/%s" width="160" height="120" />' % (self.socioId.fotoPerfil))

    class Meta(object):
        ordering = ["-fecha"]

    def qr_scanner(self):
        text = """
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://rawgit.com/schmich/instascan-builds/master/instascan.min.js"></script>
<video id="preview"></video>
<style>
#imagenSocio{
	float:right;
	margin-right: 3em;
}
</style>
<script type="text/javascript">
  let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  scanner.addListener('scan', function (content) {
    let message = atob(content);
    if(isNaN(message)){
        alert("qr Incorrecto");
    }else{
      let num = (parseInt(message)-777)/1031;
	console.log(num.toString());
        document.getElementById("id_socioId").value=num.toString();
    }
	
	
  });
  Instascan.Camera.getCameras().then(function (cameras) {
	if (cameras.length > 1) {
	  scanner.start(cameras[1]);
	}else if (cameras.length > 0){
	  scanner.start(cameras[0]);
	 }else {
	  console.error('No cameras found.');
	}
  }).catch(function (e) {
	console.error(e);
  });
</script>
"""
        return mark_safe(text)

    def calculadora(self):
        text = ""
        for x in Dispensacion.objects.filter(dispensario=self.id):
            if x.tipo=="Creditos":
                text+="<p>%s: %s g</p>" % (x.variedad.nombre, round(x.aportacion/float(x.variedad.aportacion),3))
        return mark_safe(text)


    def save(self, *args, **kwargs):
        if (not self.aportado and self.id!=None and not self.fuera):
            socio = self.socioId
            yerbones = Dispensacion.objects.filter(dispensario=self.id)
            total = 0
            for i in yerbones:
                if i.unidades=="Creditos":
                    total+=i.cantidad
                else:
                    total+=i.cantidad*float(i.variedad.aportacion)
                i.variedad.stock-=Decimal(i.cantidad)
                if i.variedad.stock<=0:
                    i.variedad.disponible=False
                    i.variedad.stock=0
                i.variedad.save()

            if total>socio.saldo:
                raise ValidationError("El coste de la retirada no puede ser mayor a los créditos del socio")
            else:

                socio.saldo -= Decimal(total)
                self.aportado=True
                socio.save()

                return super(Dispensacione, self).save( *args, kwargs)
        else:
            if self.id!=None:
                yerbones = Dispensacion.objects.filter(dispensario=self.id)
                for dispensacion in yerbones:
                    if dispensacion.unidades=="Creditos":
                        dispensacion.cantidad = round(dispensacion.cantidad/float(dispensacion.variedad.aportacion),3)
                        dispensacion.unidades="Gramos"
                        dispensacion.save()
            return super(Dispensacione, self).save( *args, kwargs)
   

    def __str__(self):
        return str(self.socioId) + " , "+str(self.fecha)


class Dispensacion(models.Model):
	cantidad = models.FloatField()
	unidades = models.CharField(
        max_length=100,
        choices=(("Creditos", "Creditos"), ("Gramos","Gramos")), 
        default="Creditos"
    )
	variedad = models.ForeignKey(Variedade,on_delete=models.PROTECT,limit_choices_to={'disponible': True},)
	dispensario = models.ForeignKey(Dispensacione,on_delete=models.CASCADE, null=True)

	def __str__(self):
        	return str(self.unidades) + " , "+str(self.cantidad)

class Donacione(models.Model):
    aportacion = models.FloatField()
    fecha = models.DateTimeField(auto_now_add=True)
    socio = models.ForeignKey("Socio", on_delete=models.PROTECT)
    aportado = models.BooleanField(default=False, editable=False)

    def save(self, *args, **kwargs):
        if self.id!=None and not self.aportado:
            self.socio.saldo+=Decimal(self.aportacion)
            self.socio.save()
            self.aportado = True
            if self.aportacion>=10 and Mes.objects.filter(socio=self.socio, fecha__month=datetime.now().month).count()==0:
                mes = Mes(socio=self.socio, fecha=datetime.now())
                mes.save()
                self.socio.estado = "Renovado"
                self.socio.save()   
        return super(Donacione, self).save( *args, **kwargs)

    def __str__(self):
        return str(self.socio) + " , "+str(self.aportacion)


class dispensacion_inline(admin.TabularInline):
    model = Dispensacion
    extra = 1

class barrita_inline(admin.TabularInline):
    model = Barrita
    extra = 1
