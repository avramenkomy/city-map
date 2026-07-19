from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

from .views import frontend_app, health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check),
    path('api/', include('places.urls')),
    path('api/', include('accounts.urls')),
    path('api/', include('feedback.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(
        "/assets/",
        document_root=settings.FRONTEND_DIST_DIR / "assets",
    )

urlpatterns += [
    re_path(
        r"^(?!api/|admin/|static/|media/|assets/).*$",
        frontend_app,
        name="frontend-app",
    ),
]
