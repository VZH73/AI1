from django.contrib import admin
from django.urls import path

from core.views import homepage

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", homepage, name="homepage"),
]
