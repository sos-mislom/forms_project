from django.urls import path
from . import views

urlpatterns = [
    path('', views.forms_list, name='forms_list'),
    path('create_form/', views.create_or_edit_form, name='create_form'),
    path('create_form/<int:form_id>/', views.create_or_edit_form, name='create_form'),
]
