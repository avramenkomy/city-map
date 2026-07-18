from django.contrib.auth import login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LoginSerializer, RegisterSerializer, UserSerializar


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CsrfCookieAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'detail': 'CSRF cookie set.'})


class CurrentUserAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'is_authenticated': False})

        serializer = UserSerializar(request.user)
        return Response(serializer.data)


@method_decorator(csrf_protect, name='dispatch')
class RegisteAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        login(request, user)

        return Response(
            UserSerializar(user).data,
            status.HTTP_201_CREATED
        )


@method_decorator(csrf_protect, name='dispatch')
class LoginAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        login(request, user)

        return Response(UserSerializar(user).data)


@method_decorator(csrf_protect, name='dispatch')
class LogoutAPIView(APIView):
    parser_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({'detail': 'Logged out.'})


