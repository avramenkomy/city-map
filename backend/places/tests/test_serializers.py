from django.test import TestCase

from places.models import Category
from places.serializers import PlaceCreateSerializer


class PlaceCreateSerializerTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Parks',
            slug='parks'
        )

        self.valid_data = {
            'category_id': self.category.id,
            'title': 'Central Park',
            'description': 'A large city park.',
            'address': 'Test address',
            'latitude': '55.751244',
            'longitude': '37.618423',
        }

    def test_serializer_accept_valid_data(self):
        serializer = PlaceCreateSerializer(data=self.valid_data)

        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_serializer_rejects_blank_title(self):
        data = {
            **self.valid_data,
            'title': '',
        }

        serializer = PlaceCreateSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)

    def test_serializer_rejects_latitude_greater_than_90(self):
        data = {
            **self.valid_data,
            'latitude': '91'
        }

        serializer = PlaceCreateSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn('latitude', serializer.errors)

    def test_serializer_rejects_latitude_less_than_minus_90(self):
        data = {
            **self.valid_data,
            'latitude': '-91'
        }

        serializer = PlaceCreateSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn('latitude', serializer.errors)

    def test_serializer_rejects_longitude_greater_than_180(self):
        data = {
            **self.valid_data,
            'longitude': '181'
        }

        serializer = PlaceCreateSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn('longitude', serializer.errors)

    def test_serializer_rejects_longitude_less_than_minus_180(self):
        data = {
            **self.valid_data,
            'longitude': '-181'
        }

        serializer = PlaceCreateSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn('longitude', serializer.errors)

    def test_serializer_rejects_unknown_category(self):
        data = {
            **self.valid_data,
            'category_id': 999
        }

        serializer = PlaceCreateSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn('category_id', serializer.errors)