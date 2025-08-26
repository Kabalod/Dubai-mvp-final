# from allauth.account.decorators import secure_admin_login
import os

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
# login_not_required отсутствует в Django 4.2 — используем прямой view без декоратора
from django.http import FileResponse
from django.http import HttpResponse
from django.urls import include
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
try:
    # Используем только в DEBUG; в проде отсутствует
    from falco.urls import errors_urlpatterns
except Exception:
    errors_urlpatterns = []
# Health check через отдельный пакет не обязателен в MVP
try:
    from health_check.views import MainView  # type: ignore
except Exception:  # pragma: no cover
    MainView = None
# from realty.main.schema import schema
# from strawberry.django.views import GraphQLView
from django.views.generic import RedirectView
from django.urls import reverse_lazy
from django.http import JsonResponse

# admin.autodiscover()
# admin.site.login = secure_admin_login(admin.site.login)


def download_db_dump(request, filename):
    """
        We try to return the file `filename` from MEDIA_ROOT.
    If the file is not found, we return a list of files and folders in MEDIA_ROOT.
    """
    file_path = os.path.join(settings.MEDIA_ROOT, filename)

    if os.path.exists(file_path):
        return FileResponse(
            open(file_path, "rb"),
            as_attachment=True,
            filename=filename,
        )
    else:
        items = os.listdir(settings.MEDIA_ROOT)
        content = "File not found. But here is what I see in MEDIA_ROOT:\n\n"
        content += "\n".join(items)
        return HttpResponse(content, content_type="text/plain")


urlpatterns = [
    # path(".well-known/security.txt", falco_views.security_txt),
    # path("robots.txt", falco_views.robots_txt),
    # path("", include(favicon_urlpatterns)),
    # path(
    #     "home/",
    #     RedirectView.as_view(url=reverse_lazy("rental_transactions_list")),
    #     name="home",
    # ),
    # path(
    #     "graphql/",
    #     csrf_exempt(GraphQLView.as_view(schema=schema, graphiql=True)),
    # ),
    # Локальный health-check пакетом optional
    *([path("health/", MainView.as_view())] if MainView else []),
    # Отключено для MVP: allauth не используется
    # path("accounts/", include("allauth.urls")),
    # Прямой лёгкий healthcheck, не зависящий от импорта API
    path("healthz/", lambda request: JsonResponse({"status": "ok"})),
    path("api/", include("realty.api.urls")),
    path(settings.ADMIN_URL, admin.site.urls),
    # path("download-dbdump/<str:filename>/", download_db_dump, name="download-db-dump")),
    # path("", include("realty.main.urls")),
    # path("experiments/", include("realty.pfimport.urls")),
    # path("", include("realty.building_reports.urls")),
    # path("r2d2/", include("realty.reports.urls", namespace="reports")),
]

# DEBUG
if settings.DEBUG:
    from debug_toolbar.toolbar import debug_toolbar_urls

    urlpatterns += [
        path("__reload__/", include("django_browser_reload.urls")),
        *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),
        *debug_toolbar_urls(),
        *errors_urlpatterns,
    ]
