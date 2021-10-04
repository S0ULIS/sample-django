from django.contrib.auth.models import Group, Permission, User
from django.db import models
from django.db.models.expressions import ExpressionWrapper
from django.shortcuts import render
from rest_framework.decorators import api_view
import base64
from django.core.files.base import ContentFile
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.template.defaulttags import register
import logging
from deep_translator import GoogleTranslator
import json
from django.db.models import Sum, F
from django.db.models.functions import TruncDay
# relative import of forms
from datetime import datetime
from .models import Barra, Barrita, Bebida, Config, Variedade, Estancia, Socio, Dispensacione, Dispensacion, Donacione
from .forms import BarraForm, EstanciaForm, SocioForm, VariedadeForm, DonacionForm, DispensacionForm
from .serializers import SocioSerializer
from django.contrib.auth.decorators import permission_required, user_passes_test
from django.views.decorators.csrf import csrf_exempt
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)





@permission_required('socios.add_estancia')
def EstanciaView(request):
    context ={}
    context['form']= EstanciaForm()
    
    if request.method == 'POST':
        form = EstanciaForm(request.POST)
        if form.is_valid():
            estancia = Estancia.objects.filter(socio__numeroSocio=form.cleaned_data['socio'], fin=False)
            if estancia.count()>0:
                for i in estancia:
                    i.socio.dentro = False
                    i.socio.save()
                    i.fechaSalida=datetime.utcnow()
                    i.fin = True
                    i.save()
            else:
                socio = Socio.objects.filter(numeroSocio=form.cleaned_data['socio'])[0]
                est = Estancia(socio=socio, fechaEntrada=datetime.utcnow(), fechaSalida = None, fin=False)
                est.save()
                socio.dentro = True
                socio.save()
                
        
    else:
        pass
    
    context["aforo"] = Socio.objects.filter(dentro=True).count()
    context["dataset"] = Socio.objects.filter(dentro=True)
    return render(request, "estancias.html", context)
	
@user_passes_test(lambda u: u.is_superuser)
def createUser(request):
    try:
        if request.is_ajax and request.method == "POST":
            User.objects.create_user(request.POST.get("username"), request.POST.get("email"), request.POST.get("password"))
            return JsonResponse({"result": "done"}, status=200)
        return JsonResponse(dict(), safe=False, status=404)
    except Exception as e:    
        return JsonResponse({"error": str(e)}, safe=False, status=500)

@user_passes_test(lambda u: u.is_superuser)
def configs(request):
    context = {}
    context["configs"] = Config.objects.all()

    return render(request, "config.html", context)


@user_passes_test(lambda u: u.is_superuser)
def usersView(request):
    context = {}
    context["users"] = User.objects.all()
    context["groups"] = Group.objects.all()
    context["permissions"] = Permission.objects.all()

    return render(request, "users.html", context)


@user_passes_test(lambda u: u.is_superuser)
def setConfig(request):
    try:
        if request.is_ajax and request.method == "POST":
            c, created = Config.objects.update_or_create(key=request.POST.get("key"), value=request.POST.get("value"))
            return JsonResponse({"result": "done"}, status=200)
        return JsonResponse(dict(), safe=False, status=404)
    except Exception as e:    
        return JsonResponse({"error": str(e)}, safe=False, status=500)

@user_passes_test(lambda u: u.is_superuser)
def getConfig(request):
    try:
        if request.is_ajax and request.method == "GET":
            c = Config.objects.get(key=request.GET.get("key"))
            return JsonResponse(model_to_dict(c), status=200)
        return JsonResponse(dict(), safe=False, status=404)
    except Exception as e:    
        return JsonResponse({"error": str(e)}, safe=False, status=500)

@user_passes_test(lambda u: u.is_superuser)
def addGroup(request):
    try:
        if request.is_ajax and request.method == "POST":
            Group.objects.get_or_create(name = request.POST.get("group"))
            return JsonResponse({"result": "done"}, status=200)
        return JsonResponse(dict(), safe=False, status=404)
    except Exception as e:    
        return JsonResponse({"error": str(e)}, safe=False, status=500)

@user_passes_test(lambda u: u.is_superuser)
def deleteGroup(request):
    try:
        if request.is_ajax and request.method == "POST":
            g = Group.objects.filter(name=request.POST.get("group"))
            g.delete()
            return JsonResponse({"result": "done"}, status=200)
        return JsonResponse(dict(), safe=False, status=404)
    except Exception as e:    
        return JsonResponse({"error": str(e)}, safe=False, status=500)

@user_passes_test(lambda u: u.is_superuser)
def addPermission(request):
    try:
        if request.is_ajax and request.method == "POST":
            g = Group.objects.get(name = request.POST.get("group"))
            p = Permission.objects.get(name= request.POST.get("permission"))
            g.permissions.add(p.id)
            return JsonResponse({"result": "done"}, status=200)
        return JsonResponse(dict(), safe=False, status=404)
    except Exception as e:    
        return JsonResponse({"error": str(e)}, safe=False, status=500)

@user_passes_test(lambda u: u.is_superuser)
def removePermission(request):
    try:
        if request.is_ajax and request.method == "POST":
            g = Group.objects.get(name = request.POST.get("group"))
            p = Permission.objects.get(name= request.POST.get("permission"))
            g.permissions.remove(p.id)
            return JsonResponse({"result": "done"}, status=200)
        return JsonResponse(dict(), safe=False, status=404)
    except Exception as e:    
        return JsonResponse({"error": str(e)}, safe=False, status=500)


@permission_required("socios.send_mail")
def sendMail(request):
    try:
        if request.is_ajax and request.method == "POST":
            user = Config.objects.filter(key="gmailUser")
            g = Group.objects.get_or_create(request.POST.get("group"))
            g.permissions.remove(request.POST.get("permission"))
            return JsonResponse({"result": "done"}, status=200)
        return JsonResponse(dict(), safe=False, status=404)
    except Exception as e:    
        return JsonResponse({"error": str(e)}, safe=False, status=500)



@user_passes_test(lambda u: u.is_superuser)
def deleteUser(request):
    if request.is_ajax and request.method == "POST":
        u = User.objects.filter(username=request.POST.get("username"))
        u.delete()
        return JsonResponse({"result": "done"}, status=200)
    return JsonResponse(dict(), safe=False, status=404)


@user_passes_test(lambda u: u.is_superuser)
def changeUserPassword(request):
    if request.is_ajax and request.method == "POST":
        u = User.objects.filter(username=request.POST.get("username"))
        u.set_password(request.POST.get("password"))
        return JsonResponse({"result": "done"}, status=200)
    return JsonResponse(dict(), safe=False, status=404)




@user_passes_test(lambda u: u.is_superuser)
def setGroup(request):
    if request.is_ajax and request.method == "POST":
        u = User.objects.filter(username=request.POST.get("username"))
        my_group = Group.objects.get(name=request.POST.get("group")) 
        my_group.user_set.add(u.first().id)
        return JsonResponse({"result": "done"}, status=200)
    return JsonResponse(dict(), safe=False, status=404)

@user_passes_test(lambda u: u.is_superuser)
def removeGroup(request):
    if request.is_ajax and request.method == "POST":
        u = User.objects.filter(username=request.POST.get("username"))
        my_group = Group.objects.get(name=request.POST.get("group")) 
        my_group.user_set.remove(u.first().id)
        return JsonResponse({"result": "done"}, status=200)
    return JsonResponse(dict(), safe=False, status=404)


@user_passes_test(lambda u: u.is_superuser)
def getPermissions(request):
    lista_permisos = [{"name": "Can change barra", "nombre": "Gestionar consumibles"},
        {"name": "Can add dispensacione", "nombre": "Realizar donaciones y dispensaciones"},
        {"name": "Can view dispensacione", "nombre": "Ver caja"},
        {"name": "Can add estancia", "nombre": "Gestionar estancias"},
        {"name": "Enviar email a socio(s)", "nombre": "Enviar emails"},
        {"name": "Can change variedade", "nombre": "Gestionar genéticas"},
        {"name": "Can view socio", "nombre": "Gestionar Socios"}]
    
    return JsonResponse(json.dumps(lista_permisos), safe=False, status=200)

@csrf_exempt
def getGroupPermissions(request):
    if request.is_ajax and request.method == "GET":
        my_group = Group.objects.get(name=request.GET.get("group")) 
        permisos = my_group.permissions.all().values("name")
        return JsonResponse(json.dumps(list(permisos)),safe=False, status=200)
    return JsonResponse(dict(), safe=False, status=404)

@user_passes_test(lambda u: u.is_superuser)
def getGroupUser(request):
    if request.is_ajax and request.method == "GET":
        u = User.objects.filter(groups__name=request.GET.get("group"))
        
        return JsonResponse(json.dumps(list(u.values("username"))), safe=False, status=200)
    return JsonResponse(dict(), safe=False, status=404)

@user_passes_test(lambda u: u.is_superuser)
def getUsers(request):
    return JsonResponse(json.dumps(list(User.objects.all().values("username"))), safe=False, status=200)

@user_passes_test(lambda u: u.is_superuser)
def getGroups(request):
    return JsonResponse(json.dumps(list(Group.objects.all().values("name"))), safe=False, status=200)



#@user_passes_test(lambda u: u.is_superuser)
def carta(request):
    # dictionary for initial data with
    # field names as keys
    context = {}
    # add the dictionary during initialization
    context["variedades"] = Variedade.objects.filter(disponible= True,tipo=request.GET.get("tipo", "Marihuana"))
         
    return render(request, "carta.html", context)


@permission_required("socios.view_socio")
def getSocio(request):
    if request.is_ajax and request.method == "GET":
        socio = Socio.objects.filter(numeroSocio=request.GET.get("nSocio", "1"))
        socioJSON = serializers.serialize('json', socio)
        return JsonResponse(socioJSON[:-3]+", \"socioId\": \""+str(socio[0].socioId)+"\"}}]", safe=False, status=200)
    return JsonResponse(dict(), safe=False, status=404)

logger = logging.getLogger(__name__)

@permission_required("socios.view_socio")
def getHistorial(request):
    context ={}
    historial = Dispensacion.objects.filter(dispensario__socioId__numeroSocio=request.GET.get("nSocio", "9")).order_by("-dispensario__fecha")
    variedades = Variedade.objects.filter(disponible=True).order_by("aportacion")
    bebidas = Bebida.objects.all().order_by("aportacion")
    context ["historial"] = historial
    context ["variedades"] = variedades
    context ["bebidas"] = bebidas
    
    return render(request, "sociosAso.html", context)

@permission_required("socios.view_socio")
def getDispensaciones(request):
    limit = 30
    context ={}
    try:
        p = int(request.GET.get("p","0")) # p = pagina
    except:
        p = 0
    ultima = (p+1)*30 >=Dispensacion.objects.all().count()
    historial = Dispensacion.objects.all().order_by("-dispensario__fecha")[p*limit:(p+1)*limit if not ultima else Dispensacion.objects.all().count()]
    context ["historial"] = historial
    context["ultima"] = (p+1)*30 >=len(Dispensacion.objects.all())
    
    return render(request, "dispensaciones.html", context)


@permission_required("socios.add_dispensacione")
def DispensacionFormView(request):
    context ={}
    variedades = Variedade.objects.filter(disponible=True).order_by("aportacion")
    context ["variedades"] = variedades
    
    
    return render(request, "dispensacionForm.html", context)




@permission_required("socios.view_socio")
def getDonaciones(request):
    limit = 30
    context ={}
    try:
        p = int(request.GET.get("p","0")) # p = pagina
    except:
        p = 0
    ultima = (p+1)*30 >=Donacione.objects.all().count()
    historial = Donacione.objects.all().order_by("-fecha")[p*limit:(p+1)*limit if not ultima else Donacione.objects.all().count()]
    context ["donaciones"] = historial
    context["ultima"] = ultima
    
    
    return render(request, "donaciones.html", context)


@permission_required("socios.change_variedade")
def getVariedad(request):
    if request.is_ajax and request.method == "GET":
        variedad = Variedade.objects.filter(id=request.GET.get("id", "1"))
        variedadJSON = serializers.serialize('json', variedad)
        return JsonResponse(variedadJSON, safe=False, status=200)
    return JsonResponse(dict(), safe=False, status=404)

@permission_required("socios.change_barra")
def getBebida(request):
    if request.is_ajax and request.method == "GET":
        bebida = Bebida.objects.filter(id=request.GET.get("id", "1"))
        bebidaJSON = serializers.serialize('json', bebida)
        return JsonResponse(bebidaJSON, safe=False, status=200)
    return JsonResponse(dict(), safe=False, status=404)


@permission_required("socios.change_barra")
def barras(request):
    if request.method == "GET":
        bebida = Bebida.objects.all()
        context = { "bebidas": bebida }
        return render(request, "barra.html", context)
    return JsonResponse(dict(), safe=False, status=404)

@permission_required("socios.change_barra")
def consumibleForm(request):
    if request.method == "GET":
        bebida = Bebida.objects.all()
        context = { "bebidas": bebida }
        return render(request, "barraRForms.html", context)
    return JsonResponse(dict(), safe=False, status=404)


@permission_required("socios.change_barra")
def barraHistorial(request):
    if request.method == "GET":
        limit = 30
        try:
            p = int(request.GET.get("p","0")) # p = pagina
        except:
            p = 0
        
        if 'nSocio' in request.GET:
            historial = Barrita.objects.filter(barra__socio__numeroSocio=request.GET.get("nSocio")).order_by("-barra__fecha")
        else:
            historial = Barrita.objects.all().order_by("-barra__fecha")
        ultima = (p+1)*limit >=historial.count()
        context = { "historial": historial[p*limit:(p+1)*limit if not ultima else historial.count()], "ultima": ultima }
        return render(request, "barraHistorial.html", context)
    return JsonResponse(dict(), safe=False, status=404)


@permission_required("socios.view_socio")
def getSocios(request):
    limit = 30
    context ={}
    try:
        p = int(request.GET.get("p","0")) # p = pagina
    except:
        p = 0
    ultima = (p+1)*30 >=Socio.objects.all().count()
    historial = Socio.objects.all().order_by("numeroSocio").values("nombre","apellidos","numeroSocio","estado")[p*limit:(p+1)*limit if not ultima else Socio.objects.all().count()]
    totalSocios = Socio.objects.all().values("nombre","apellidos","numeroSocio")
    context ["socios"] = historial
    context["ultima"] = ultima
    context["totalSocios"] = totalSocios
    
    return render(request, "sociosList.html", context)

@api_view(["POST","PUT"])
@permission_required("socios.view_socio")
def postSocio(request):
    if request.is_ajax and request.method == "POST":
        numbers = ["numeroSocio", "saldo"]
        form = SocioForm(request.POST)
        data = form.data
        clean_data = dict()
        for key in data:
            if key in numbers:
                clean_data[key] = float(data[key])
            elif data[key] == "true":
                clean_data[key] = True
            elif data[key] == "false":
                clean_data[key] = False
            else:
                clean_data[key] = data[key]

        socio = Socio(**clean_data)
        image_data = clean_data["profilePhoto"]
        format, imgstr = image_data.split(';base64,')
        ext = format.split('/')[-1]

        data = ContentFile(base64.b64decode(imgstr))  
        file_name = clean_data["nombre"]+" "+clean_data["apellidos"]+str(clean_data["numeroSocio"]) + ext
        socio.save()
        socio.fotoPerfil.save(file_name, data, save=True)
        #return JsonResponse(socioJSON[:-3]+", \"socioId\": \""+str(socio.socioId)+"\"}}]", safe=False, status=200)
        return JsonResponse(clean_data, safe=False, status=200)

    elif request.is_ajax and request.method == "PUT":
        numbers = ["numeroSocio", "saldo"]
        form = SocioForm(request.data)
        data = form.data
        clean_data = dict()
        for key in data:
            if key in numbers:
                clean_data[key] = float(data[key])
            elif data[key] == "true":
                clean_data[key] = True
            elif data[key] == "false":
                clean_data[key] = False
            else:
                clean_data[key] = data[key]
        socio = Socio.objects.filter(numeroSocio=clean_data["numeroSocio"])
        image_data = clean_data["profilePhoto"]
        if image_data!="":
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]

            data = ContentFile(base64.b64decode(imgstr))  
            file_name = clean_data["nombre"]+" "+clean_data["apellidos"]+str(clean_data["numeroSocio"]) + ext
            socio.first().fotoPerfil.save(file_name, data, save=True)
        
        
        socio.update(**clean_data)

        return JsonResponse(clean_data, safe=False, status=200)

    
    return JsonResponse({"error": "error al guardar socio"}, safe=False, status=404)

@api_view(["POST","PUT"])
@permission_required("socios.change_variedade")
def postVariedad(request):
    if request.is_ajax and request.method == "POST":
        numbers = ["aportacion", "CBD", "sativa", "THC"]
        form = VariedadeForm(request.POST)
        data = form.data
        clean_data = dict()
        for key in data:
            if key in numbers:
                clean_data[key] = float(data[key])
            elif data[key] == "true":
                clean_data[key] = True
            elif data[key] == "false":
                clean_data[key] = False
            else:
                clean_data[key] = data[key]

        variedad = Variedade(**clean_data)
        image_data = clean_data["fotasoYerbon"]
        format, imgstr = image_data.split(';base64,')
        ext = format.split('/')[-1]

        data = ContentFile(base64.b64decode(imgstr))  
        file_name = clean_data["nombre"]+"-"+str(clean_data["aportacion"]) + ext
        
        variedad.save()
        variedad.fotoYerbon.save(file_name, data, save=True)
        #return JsonResponse(socioJSON[:-3]+", \"socioId\": \""+str(socio.socioId)+"\"}}]", safe=False, status=200)
        return JsonResponse(clean_data, status=200)
    
    elif request.is_ajax and request.method == "PUT":
        numbers = ["aportacion", "CBD", "sativa", "THC"]
        form = VariedadeForm(request.data)
        data = form.data
        clean_data = dict()
        for key in data:
            if key in numbers:
                clean_data[key] = float(data[key])
            elif data[key] == "true":
                clean_data[key] = True
            elif data[key] == "false":
                clean_data[key] = False
            else:
                clean_data[key] = data[key]

        variedad = Variedade.objects.filter(id=int(request.GET.get("id")))
        image_data = clean_data["fotasoYerbon"]
        if image_data!="":
            
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]

            data = ContentFile(base64.b64decode(imgstr))  
            file_name = clean_data["nombre"]+"-"+str(clean_data["aportacion"]) + ext
            variedad.first().fotoYerbon.save(file_name, data, save=True)
        variedad.update(**clean_data)

        return JsonResponse(clean_data, status=200)
    
    return JsonResponse({"error": "error al guardar la variedad"}, safe=False, status=404)

@permission_required("socios.change_variedade")
def postDonacion(request):
    if request.is_ajax and request.method == "POST":
        numbers = ["aportacion", "numeroSocio"]
        form = DonacionForm(request.POST)
        data = form.data
        clean_data = dict()
        for key in data:
            if key in numbers:
                clean_data[key] = float(data[key])
            elif data[key] == "true":
                clean_data[key] = True
            elif data[key] == "false":
                clean_data[key] = False
            else:
                clean_data[key] = data[key]
        socio = Socio.objects.filter(numeroSocio=clean_data["numeroSocio"]).first()
        donacion = Donacione(aportacion = clean_data["aportacion"], socio=socio)
        donacion.save()
        donacion.save()
        socioJSON = SocioSerializer(socio)
        #return JsonResponse(socioJSON[:-3]+", \"socioId\": \""+str(socio.socioId)+"\"}}]", safe=False, status=200)
        return JsonResponse(socioJSON.data, status=200)
    
    return JsonResponse({"error": "error al guardar la variedad"}, safe=False, status=404)


@permission_required("socios.view_socio")
def getHistorialAjax(request):
    if request.is_ajax and request.method == "GET":
        historial = Dispensacion.objects.filter(dispensario__socioId__numeroSocio=request.GET.get("nSocio", "9")).order_by("-dispensario__fecha")
        response = json.dumps(list())
        result = []
        for disp in historial.values("variedad__tipo", "variedad__nombre", "dispensario__fecha", "cantidad"):
            temp = disp
            temp["dispensario__fecha"] = temp["dispensario__fecha"].strftime("%Y-%m-%d %H:%M:%S")
            result.append(temp)
        return JsonResponse(json.dumps(result), safe=False, status=200)


    return JsonResponse({"error": "endpoint no encontrado"}, safe=False, status=404)




@permission_required("socios.change_variedade")
def postDispensacion(request):
    if request.is_ajax and request.method == "POST":
        numbers = ["numeroSocio"]
        form = DispensacionForm(request.POST)
        data = form.data
        clean_data = dict()
        for key in data:
            if key in numbers:
                clean_data[key] = float(data[key])
            elif data[key] == "true":
                clean_data[key] = True
            elif data[key] == "false":
                clean_data[key] = False
            else:
                clean_data[key] = data[key]
        
        socio = Socio.objects.filter(numeroSocio=clean_data["numeroSocio"]).first()
        dispensario = Dispensacione(socioId=Socio.objects.filter(numeroSocio=clean_data["numeroSocio"]).first())
        dispensario.save(commit=False)
        for disp in clean_data["dispensaciones"].split("{;}")[:-1]:
            datos = disp.split("/*/")
            dispensacion = Dispensacion(dispensario=dispensario,cantidad = float(datos[0]), unidades = datos[1], variedad=Variedade.objects.filter(id=int(datos[2])).first() )
            dispensacion.save()

        dispensario.save()
        socioJSON = SocioSerializer(socio)
        #return JsonResponse(socioJSON[:-3]+", \"socioId\": \""+str(socio.socioId)+"\"}}]", safe=False, status=200)
        return JsonResponse(socioJSON.data, status=200)
    
    return JsonResponse({"error": "error al guardar la dispensacion"}, safe=False, status=404)


@permission_required("socios.change_barra")
def postBebida(request):
    if request.is_ajax and request.method == "POST":
        numbers = ["aportacion"]
        form = VariedadeForm(request.POST)
        data = form.data
        clean_data = dict()
        for key in data:
            if key in numbers:
                clean_data[key] = float(data[key])
            elif data[key] == "true":
                clean_data[key] = True
            elif data[key] == "false":
                clean_data[key] = False
            else:
                clean_data[key] = data[key]

        variedad = Bebida(**clean_data)
        
        
        variedad.save()
        #return JsonResponse(socioJSON[:-3]+", \"socioId\": \""+str(socio.socioId)+"\"}}]", safe=False, status=200)
        return JsonResponse(clean_data, status=200)

    elif request.is_ajax and request.method == "PUT":
        numbers = ["aportacion"]
        form = VariedadeForm(request.POST)
        data = form.data
        clean_data = dict()
        for key in data:
            if key in numbers:
                clean_data[key] = float(data[key])
            elif data[key] == "true":
                clean_data[key] = True
            elif data[key] == "false":
                clean_data[key] = False
            else:
                clean_data[key] = data[key]

        variedad = Bebida.objects.filter(id=int(clean_data["id"]))
        
        variedad.update(**clean_data)
        #return JsonResponse(socioJSON[:-3]+", \"socioId\": \""+str(socio.socioId)+"\"}}]", safe=False, status=200)
        return JsonResponse(clean_data, status=200)


    
    return JsonResponse({"error": "error al guardar la Bebida"}, safe=False, status=404)




@permission_required("socios.change_barra")
def postBarra(request):
    if request.is_ajax and request.method == "POST":
        numbers = ["numeroSocio"]
        form = BarraForm(request.POST)
        data = form.data
        clean_data = dict()
        for key in data:
            if key in numbers:
                clean_data[key] = float(data[key])
            elif data[key] == "true":
                clean_data[key] = True
            elif data[key] == "false":
                clean_data[key] = False
            else:
                clean_data[key] = data[key]
        socio = Socio.objects.filter(numeroSocio=clean_data["numeroSocio"]).first()
        barra = Barra(socio=socio)
        barra.save()
        for disp in clean_data["dispensaciones"].split("{;}")[:-1]:
            datos = disp.split("/*/")
            dispensacion = Barrita(barra=barra,unidades = float(datos[0]), bebida=Bebida.objects.filter(id=int(datos[1])).first() )
            dispensacion.save()

        barra.save()
        socioJSON = SocioSerializer(socio)
        #return JsonResponse(socioJSON[:-3]+", \"socioId\": \""+str(socio.socioId)+"\"}}]", safe=False, status=200)
        return JsonResponse(socioJSON.data, status=200)
    
    return JsonResponse({"error": "error al guardar la consumicion de barra"}, safe=False, status=404)


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

@permission_required("socios.view_dispensacione")
def cajaView(request):
    limit = 30
    context ={}
    try:
        p = int(request.GET.get("p","0")) # p = pagina
    except:
        p = 0
    ultima = (p+1)*30 >=Socio.objects.all().count()
    historico_dispensaciones = Dispensacion.objects.annotate(total_dispensado=Sum(
        ExpressionWrapper(
            F('cantidad') * F('variedad__aportacion'),
             output_field=models.FloatField()))).values("total_dispensado", "dispensario__fecha").order_by("-dispensario__fecha")
    historico_donaciones = Donacione.objects.all()
    result1 = {}
    for disp in historico_dispensaciones:
        temp = disp
        if temp["dispensario__fecha"]!=None:
            if temp["dispensario__fecha"].strftime("%Y-%m-%d") in result1:
                result1[temp["dispensario__fecha"].strftime("%Y-%m-%d")]+=temp["total_dispensado"]
            else:
                result1[temp["dispensario__fecha"].strftime("%Y-%m-%d")] = temp["total_dispensado"]
    
    result2 = {}
    for disp in historico_donaciones:
        temp = disp
        if temp.fecha!=None:
            if temp.fecha.strftime("%Y-%m-%d") in result2:
                result2[temp.fecha.strftime("%Y-%m-%d")]+=temp.aportacion
            else:
                result2[temp.fecha.strftime("%Y-%m-%d")] = temp.aportacion

    result = {}
    total_fechas = list(set(result1.keys()).union(set(result2.keys())))
    total_fechas.sort(reverse=True)
    for fecha in total_fechas:
        result[fecha] = {"dispensacion": 0, "donacion": 0}
        if fecha in result1:
            result[fecha]["dispensacion"] = result1[fecha]
        if fecha in result2:
            result[fecha]["donacion"] = result2[fecha]
    


    context = {"historico": result[p*limit:(p+1)*limit if not ultima else Socio.objects.all().count()], "ultima": ultima}
    return render(request, "caja.html", context)
