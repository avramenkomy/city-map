from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from places.models import Category, Place

User = get_user_model()


class PlaceAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.author = User.objects.create_user(
            username='Author',
            password='test-password-123',
        )

        self.other_user = User.objects.create_user(
            username='other',
            password='test-password-123',
        )

        self.category = Category.objects.create(
            name='Parks',
            slug='parks',
        )

        self.place = Place.objects.create(
            category=self.category,
            author=self.author,
            title='Central Park',
            description='A large park in the city.',
            address='Test address',
            latitude='55.751244',
            longitude='37.618423',
        )

        self.list_url = reverse('place-list')
        self.detail_url = reverse('place-detail', kwargs={ 'pk': self.place.pk })


    def get_valid_payload(self):
        return {
            'category_id': self.category.id,
            'title': 'New Place',
            'description': 'Create from API test.',
            'address': 'Test new address',
            'latitude': '55.760000',
            'longitude': '37.620000',
        }


    def test_guest_can_list_places(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.place.title)


    def test_guest_cannot_create_place(self):
        payload = self.get_valid_payload()

        response = self.client.post(self.list_url, payload)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Place.objects.count(), 1)


    def test_authenticated_user_can_create_place(self):
        self.client.force_authenticate(user=self.author)
        payload = self.get_valid_payload()

        response = self.client.post(self.list_url, payload)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Place.objects.count(), 2)
        self.assertEqual(response.data['title'], payload['title'])
        self.assertEqual(response.data['author_username'], self.author.username)


    def test_author_can_update_own_place(self):
        self.client.force_authenticate(user=self.author)

        response = self.client.patch(
            self.detail_url,
            {
                'title': 'Updated title'
            }
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.place.refresh_from_db()

        self.assertEqual(self.place.title, 'Updated title')
        self.assertEqual(response.data['title'], 'Updated title')


    def test_other_user_cannot_update_place(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.patch(
            self.detail_url,
            {
                'title': 'Hacked title'
            }
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.place.refresh_from_db()

        self.assertEqual(self.place.title, 'Central Park')


    def test_author_can_delete_own_place(self):
        self.client.force_authenticate(user=self.author)

        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Place.objects.count(), 0)


    def test_other_user_cannot_delete_place(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Place.objects.count(), 1)
