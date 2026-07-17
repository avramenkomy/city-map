import shutil
import tempfile
from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse

from PIL import Image

from rest_framework import status
from rest_framework.test import APIClient

from places.models import Category, Place

User = get_user_model()

TEMP_MEDIA_ROOT = tempfile.mkdtemp()

@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class PlaceImageUploadAPITests(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEMP_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username='author',
            password='test-password-123',
        )

        self.category = Category.objects.create(
            name='Parks',
            slug='parks',
        )

        self.list_url = reverse('place-list')

    def create_test_image_file(self, name='test.jpg', image_format='JPEG', content_type='image/jpeg'):
        image = Image.new('RGB', (100, 100))
        image_file = BytesIO()
        image.save(image_file, format=image_format)
        image_file.seek(0)

        return SimpleUploadedFile(name, image_file.read(), content_type=content_type)


    def get_valid_payload(self, image=None):
        payload = {
            'category_id': self.category.id,
            'title': 'Place with image',
            'description': 'Test description',
            'address': 'Test address',
            'latitude': '55.751244',
            'longitude': '37.618423',
        }

        if image:
            payload['image'] = image

        return payload


    def test_authenticated_user_can_create_place_with_image(self):
        self.client.force_authenticate(user=self.user)

        image = self.create_test_image_file()
        payload = self.get_valid_payload(image=image)

        response = self.client.post(self.list_url, payload, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Place.objects.count(), 1)

        place = Place.objects.first()

        self.assertTrue(place.image)
        self.assertTrue(place.image.name.startswith('places/'))
        self.assertTrue(place.image.storage.exists(place.image.name))


    def test_api_rejects_fake_image_file(self):
        self.client.force_authenticate(user=self.user)

        fake_image = SimpleUploadedFile(
            'fake.jpg', b'This is not a real image.', content_type='image/jpeg',
        )

        payload = self.get_valid_payload(image=fake_image)

        response = self.client.post(self.list_url, payload, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('image', response.data)
        self.assertEqual(Place.objects.count(), 0)

    def test_replacing_image_deletes_old_file(self):
        self.client.force_authenticate(user=self.user)

        old_image = self.create_test_image_file(name='old.jpg')
        place = Place.objects.create(
            category=self.category,
            author=self.user,
            title='Place',
            description='Description',
            address='address',
            latitude='55.900000',
            longitude='38.000000',
            image=old_image
        )

        old_image_name = place.image.name

        self.assertTrue(place.image.storage.exists(old_image_name))

        detail_url = reverse('place-detail', kwargs={ 'pk': place.pk })

        new_image = self.create_test_image_file(name='new.jpg')

        response = self.client.patch(detail_url, { 'image': new_image }, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        place.refresh_from_db()

        self.assertNotEqual(place.image.name, old_image_name)
        self.assertFalse(place.image.storage.exists(name=old_image_name))
        self.assertTrue(place.image.storage.exists(name=place.image.name))


    def test_deleting_place_deletes_image_file(self):
        self.client.force_authenticate(user=self.user)

        image = self.create_test_image_file(name='delete-me.jpg')
        place = Place.objects.create(
            category=self.category,
            author=self.user,
            title='Place',
            description='Description',
            address='address',
            latitude='55.900000',
            longitude='38.000000',
            image=image
        )

        image_name = place.image.name

        self.assertTrue(place.image.storage.exists(image_name))

        detail_url = reverse('place-detail', kwargs={ 'pk': place.pk })

        response = self.client.delete(detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(place.image.storage.exists(image_name))
        self.assertEqual(Place.objects.count(), 0)
