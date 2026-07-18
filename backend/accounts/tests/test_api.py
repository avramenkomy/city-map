from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()


class AuthAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.csrf_url = reverse('auth-csrf')
        self.me_url = reverse('auth-me')
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.logout_url = reverse('auth-logout')

        self.register_payload = {
            'username': 'ivan',
            'email': 'ivan@example.com',
            'password': 'test-password-123',
            'password_confirm': 'test-password-123',
        }


    def test_guest_current_user_returns_not_authenticated(self):
        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'is_authenticated': False})


    def test_csrf_endpoint_returns_success(self):
        response = self.client.get(self.csrf_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'detail': 'CSRF cookie set.'})


    def test_user_can_register(self):
        response = self.client.post(
            self.register_url,
            self.register_payload,
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

        user = User.objects.first()

        self.assertEqual(user.username, self.register_payload['username'])
        self.assertEqual(user.email, self.register_payload['email'])

        self.assertEqual(response.data['username'], self.register_payload['username'])
        self.assertEqual(response.data['email'], self.register_payload['email'])
        self.assertTrue(response.data['is_authenticated'])


    def test_user_is_authenticated_after_register(self):
        register_response = self.client.post(
            self.register_url,
            self.register_payload,
            format='json',
        )

        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        me_response = self.client.get(self.me_url)

        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertTrue(me_response.data['is_authenticated'])
        self.assertEqual(me_response.data['username'], self.register_payload['username'])


    def test_register_rejects_duplicate_username(self):
        User.objects.create_user(
            username='ivan',
            email='old@example.com',
            password='test-password-123',
        )

        response = self.client.post(
            self.register_url,
            self.register_payload,
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertEqual(User.objects.count(), 1)


    def test_register_rejects_password_mismatch(self):
        payload = {
            **self.register_payload,
            'password_confirm': 'another-password-123',
        }

        response = self.client.post(
            self.register_url,
            payload,
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_confirm', response.data)
        self.assertEqual(User.objects.count(), 0)


    def test_user_can_login(self):
        User.objects.create_user(
            username='ivan',
            email='ivan@example.com',
            password='test-password-123',
        )

        response = self.client.post(
            self.login_url,
            {
                'username': 'ivan',
                'password': 'test-password-123',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_authenticated'])
        self.assertEqual(response.data['username'], 'ivan')


    def test_login_rejects_invalid_credentials(self):
        User.objects.create_user(
            username='ivan',
            email='ivan@example.com',
            password='test-password-123',
        )

        response = self.client.post(
            self.login_url,
            {
                'username': 'ivan',
                'password': 'wrong-password',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)


    def test_current_user_returns_authenticated_user(self):
        user = User.objects.create_user(
            username='ivan',
            email='ivan@example.com',
            password='test-password-123',
        )

        self.client.force_login(user)

        response = self.client.get(self.me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_authenticated'])
        self.assertEqual(response.data['username'], user.username)
        self.assertEqual(response.data['email'], user.email)


    def test_user_can_logout(self):
        user = User.objects.create_user(
            username='ivan',
            email='ivan@example.com',
            password='test-password-123',
        )

        self.client.force_login(user)

        logout_response = self.client.post(self.logout_url)

        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        self.assertEqual(logout_response.data, {'detail': 'Logged out.'})

        me_response = self.client.get(self.me_url)

        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data, {'is_authenticated': False})