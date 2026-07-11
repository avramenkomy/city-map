from django.urls import path

from .views import (
  CsrfCookieAPIView,
  CurrentUserAPIView,
  LoginAPIView,
  LogoutAPIView,
  RegisteAPIView,
)

urlpatterns = [
    path('auth/csrf/', CsrfCookieAPIView.as_view(), name='auth-csrf'),
    path('auth/me/', CurrentUserAPIView.as_view(), name='auth-me'),
    path('auth/register/', RegisteAPIView.as_view(), name='auth-register'),
    path('auth/login/', LoginAPIView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutAPIView.as_view(), name='auth-logout'),
]
