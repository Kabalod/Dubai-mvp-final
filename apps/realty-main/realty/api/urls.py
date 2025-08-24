from django.urls import path
from .health import health_check

app_name = "api"

urlpatterns = [
    path("health/", health_check, name="health_check"),
]
