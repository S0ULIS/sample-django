from django.urls import path
from django.contrib.auth import views as auth_views
 
# importing views from views..py
from .views import DispensacionFormView, addGroup, addPermission, barraHistorial, barras, cajaView, carta, changeUserPassword, configs, consumibleForm, deleteGroup, getBebida, getConfig, getGroupPermissions, getGroupUser, getGroups, getPermissions, getUsers, getVariedad, postBarra, postBebida, postVariedad, removeGroup, removePermission, setConfig, setGroup, EstanciaView, createUser, deleteUser, getDispensaciones, getHistorialAjax, getSocio, postDispensacion, postSocio, postDonacion, getHistorial, getDonaciones, getSocios, usersView
from django.views.generic.base import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='mainAso.html')),
    path('login/', auth_views.LoginView.as_view()),
    path('menuCarta/', TemplateView.as_view(template_name='menuCarta.html')),
    path('carta/', carta),
    path('estancias/', EstanciaView),
    path('getSocio/', getSocio),
    path('postSocio/', postSocio),
    path('config/', configs),
    path('getConfig/', getConfig),
    path('setConfig/', setConfig),
    path('postDonacion/', postDonacion),
    path('postDispensacion/', postDispensacion),
    path('postVariedad/', postVariedad),
    path('nuevaDispensacion/', DispensacionFormView),
    path('getHistorial/', getHistorialAjax),
    path('dispensaciones/', getDispensaciones),
    path('socio/',getHistorial),
    path('donaciones/', getDonaciones),
    path('totalSocios/', getSocios),
    path('addUser/', createUser),
    path('deleteUser/', deleteUser),
    path('changeUserPassword/', changeUserPassword),
    path('setGroup/', setGroup),
    path('deleteGroup/', deleteGroup),
    path('removeGroup/', removeGroup),
    path('addGroup/', addGroup),
    path('addPermission/', addPermission),
    path('removePermission/', removePermission),
    path('users/', usersView),
    path('getUsers/', getUsers),
    path('getPermissions/', getPermissions),
    path('getGroups/', getGroups),
    path('getGroupUsers/', getGroupUser),
    path('getGroupPermissions/', getGroupPermissions),
    path('caja/', cajaView),
    path('getVariedad/',getVariedad),
    path('getBebida/', getBebida),
    path('barraHistorial/', barraHistorial),
    path('barra/', barras),
    path('postConsumible/', postBebida),
    path('postBarra/', postBarra),
    path('nuevoConsumible/', consumibleForm)
]
