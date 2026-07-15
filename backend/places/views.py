from django.db.models import Q
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from .models import Category, Place
from .serializers import (
    CategorySerializer,
    PlaceSerializer,
    PlaceCreateSerializer,
    PlaceUpdateSerializer,
)


class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class PlaceListCreateAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_queryset(self):
        queryset = (
            Place.objects
            .filter(is_published=True)
            .select_related('category', 'author')
        )

        category_id = self.request.query_params.get('category')
        search = self.request.query_params.get('search', '').strip()
        mine = self.request.query_params.get('mine')

        if (category_id):
            queryset = queryset.filter(category_id=category_id)

        if (mine == '1'):
            if not self.request.user.is_authenticated:
                return queryset.none()

            queryset = queryset.filter(author=self.request.user)

        if (search):
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(address__icontains=search)
            )

        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PlaceCreateSerializer
        return PlaceSerializer

    def create(self, request, *args, **kwargs):
        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)

        place = write_serializer.save(author=request.user)

        read_serializer = PlaceSerializer(
            place,
            context=self.get_serializer_context(),
        )

        return Response(
            read_serializer.data,
            status=status.HTTP_201_CREATED
        )


class PlaceDetailAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_queryset(self):
        return (
            Place.objects
            .filter(is_published=True)
            .select_related('category', 'author')
        )

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return PlaceUpdateSerializer
        return PlaceSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        place = self.get_object()

        write_serializer = self.get_serializer(
            place,
            data=request.data,
            partial=partial
        )
        write_serializer.is_valid(raise_exception=True)
        place = write_serializer.save()

        read_serializer = PlaceSerializer(
            place,
            context=self.get_serializer_context(),
        )

        return Response(read_serializer.data)
