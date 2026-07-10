from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import Category, Place
from .serializers import CategorySerializer, PlaceSerializer

# Create your views here.

class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class PlaceListAPIView(ListAPIView):
    serializer_class = PlaceSerializer

    def get_queryset(self):
        return (
            Place.objects
            .filter(is_published=True)
            .select_related('category', 'author')
        )

class PlaceDetailAPIView(RetrieveAPIView):
    serializer_class = PlaceSerializer

    def get_queryset(self):
        return (
            Place.objects
            .filter(is_published=True)
            .select_related('category', 'author')
        )
    