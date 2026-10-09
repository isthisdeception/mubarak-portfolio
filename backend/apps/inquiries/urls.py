from django.urls import path
from apps.inquiries.views import ContactCreateView

urlpatterns = [
    path('contact/', ContactCreateView.as_view(), name='contact_create'),
]
