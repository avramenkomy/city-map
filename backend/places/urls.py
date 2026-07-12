from django.urls import path

from .views import CategoryListAPIView, PlaceListCreateAPIView, PlaceDetailAPIView

urlpatterns = [
    path('categories/', CategoryListAPIView.as_view(), name='category_list'),
    path('places/', PlaceListCreateAPIView.as_view(), name='place-list'),
    path('places/<int:pk>/', PlaceDetailAPIView.as_view(), name='place-detail'),
]
