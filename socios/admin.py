from django.contrib import admin
from .models import Socio, Variedade, Dispensacione, Barra, dispensacion_inline, Dispensacion, Bebida, barrita_inline, Barrita, Donacione, Estancia
from django.utils.html import escape
from datetime import date
import base64
# Register your models here.

@admin.register(Socio)
class SocioAdmin(admin.ModelAdmin):
    search_fields = ["=numeroSocio","nombre","apellidos"]
    list_display = ("numeroSocio", "nombre", "apellidos")
    save_on_top = True
    readonly_fields = ['socio_id','image_tag','add_button', "qr_scanner", 'codigo_qr']
    

    def socio_id(self, obj):
        return "%s" % (obj.socioId)

    def codigo_qr(self, obj):
        if obj.socioId!=None:
            mensaje = str(obj.socioId*1031+777).encode('ascii')
            return "%s" % (base64.b64encode(mensaje).decode('ascii'))
        else:
            return "Cargando"

    def socioid(self, obj):
        return "%s %s %s" % (obj.numeroSocio, obj.nombre, obj.apellidos)

@admin.register(Variedade)
class VariedadeAdmin(admin.ModelAdmin):
    list_display = ("nombreYerbon", "aportacion", "THC", "sativa")
    search_fields = ["nombre"]
    save_on_top = True
    readonly_fields = ['image_tag_yerbon', 'video_tag_yerbon']
    def nombreYerbon(self, obj):
        return obj.nombre
    
@admin.register(Barra)
class BarraAdmin(admin.ModelAdmin):
    autocomplete_fields = ["socio"]
    inlines = (barrita_inline,)
    save_on_top = Truesave_on_top = True

    list_display = ("socio", "fecha")
    readonly_fields = ["totalHoy","total","fechaDispensacion"]


    def fechaDispensacion(self, obj):
        return "%s" % (obj.fecha)

    def total(self, obj):
        bebidas = Barrita.objects.filter(barra=obj.id)
        total = 0
        for i in bebidas:
            total+=i.unidades*float(i.bebida.aportacion)

        return "%s" % (total)

    def totalHoy(self, obj):
        today_filter =  Barra.objects.filter(fecha__year=obj.fecha.year,
                                       fecha__month=obj.fecha.month,
                                       fecha__day=obj.fecha.day)
        total = 0
        for dispensacion in today_filter.all():
            if not dispensacion.fuera:
                for i in Barrita.objects.filter(barra=dispensacion.id).all():
                    total+=float(i.unidades)*float(i.bebida.aportacion)

        return "%s" % (total)
 
    def totalMes(self, obj):
        today_filter =  Barra.objects.filter(fecha__year=obj.fecha.year,
                                       fecha__month=obj.fecha.month)
        total = 0
        for dispensacion in today_filter.all():
            if not dispensacion.fuera:
                for i in Barrita.objects.filter(barra=dispensacion.id).all():
                    total+=i.unidades*float(i.bebida.aportacion)
       
        return "%s" % (total)


@admin.register(Bebida)
class BebidaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "aportacion")


@admin.register(Dispensacione)
class DonacioneAdmin(admin.ModelAdmin):
    autocomplete_fields = ["socioId"]
    inlines = (dispensacion_inline,)
    save_on_top = True
    search_fields = ["socioId__nombre","socioId__apellidos","=socioId__numeroSocio"]
    list_display = ("socioId", "fecha")
    readonly_fields = ["image_tag",'total',"totalHoy", "fechaDispensacion", "qr_scanner", "calculadora"]

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "dispensacions":
            kwargs["queryset"] = Variedade.objects.filter(disponible=True)
        return super(DonacioneAdmin, self).formfield_for_manytomany(db_field, request, **kwargs)


    def fechaDispensacion(self, obj):
        return "%s" % (obj.fecha)

    def total(self, obj):
        yerbones = Dispensacion.objects.filter(dispensario=obj.id)
        total = 0
        for i in yerbones:
            if i.tipo=="Creditos":
                total+=i.aportacion
            else:
                total+=i.aportacion*float(i.variedad.aportacion)
        return "%s" % (total)

    def totalHoy(self, obj):
        today_filter =  Dispensacione.objects.filter(fecha__year=obj.fecha.year,
                                       fecha__month=obj.fecha.month,
                                       fecha__day=obj.fecha.day)
        total = 0
        for dispensacion in today_filter.all():
            if not dispensacion.fuera:
                for i in Dispensacion.objects.filter(dispensario=dispensacion.id).all():
                    if i.tipo=="Creditos":
                        total+=i.aportacion
                    else:
                        total+=i.aportacion*float(i.variedad.aportacion)
       
        return "%s" % (total)
 
    def totalMes(self, obj):
        today_filter =  Dispensacione.objects.filter(fecha__year=obj.fecha.year,
                                       fecha__month=obj.fecha.month)
        total = 0
        for dispensacion in today_filter.all():
            if not dispensacion.fuera:
                for i in Dispensacion.objects.filter(dispensario=dispensacion.id).all():
                    if i.tipo=="Creditos":
                        total+=i.aportacion
                    else:
                        total+=i.aportacion*float(i.variedad.aportacion)
       
        return "%s" % (total)
        


@admin.register(Donacione)
class DispensacioneAdmin(admin.ModelAdmin):
    search_fields = ["socio__nombre","socio__apellidos","=socio__numeroSocio"]
    list_display = ("socio", "fecha", "aportacion")
    autocomplete_fields = ["socio"]
    readonly_fields = ["aportado"]
    
    
@admin.register(Estancia)
class EstanciaAdmin(admin.ModelAdmin):
    search_fields = ["socio__nombre","socio__apellidos","=socio__numeroSocio"]
    readonly_fields = ["fechaEntrada"]
    
