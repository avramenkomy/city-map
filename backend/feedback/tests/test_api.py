from unittest.mock import patch

from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.throttling import ScopedRateThrottle

from feedback.models import FeedbackMessage

@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL='City Map <noreply@example.com>',
    FEEDBACK_RECIPIENT='admin@example.com',
    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': [
            'rest_framework.authentication.SessionAuthentication',
        ],
        'DEFAULT_PERMISSION_CLASSES': [
            'rest_framework.permissions.AllowAny',
        ],
        'DEFAULT_THROTTLE_RATES': {
          'feedback': '100/hour'
        }
    }
)
class FeedbackAPITests(TestCase):
    def setUp(self):
        cache.clear()

        self.client = APIClient()
        self.url = reverse('feedback-create')

        self.valid_payload = {
            'name': 'Ivan',
            'email': 'ivan@example.com',
            'message': 'I found a bug on the map page.'
        }

        mail.outbox = []

    def test_guest_can_send_feedback(self):
        response = self.client.post(
            self.url,
            self.valid_payload,
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FeedbackMessage.objects.count(), 1)

        feedback_message = FeedbackMessage.objects.first()

        self.assertEqual(feedback_message.name, self.valid_payload['name'])
        self.assertEqual(feedback_message.email, self.valid_payload['email'])
        self.assertEqual(feedback_message.message, self.valid_payload['message'])
        self.assertFalse(feedback_message.is_processed)


    def test_feedback_send_creates_email_notification(self):
        response = self.client.post(
            self.url,
            self.valid_payload,
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(mail.outbox), 1)

        email = mail.outbox[0]

        self.assertEqual(email.to, ['admin@example.com'])
        self.assertIn('New feedback message from Ivan', email.subject)
        self.assertIn('Ivan', email.body)
        self.assertIn('ivan@example.com', email.body)
        self.assertIn('I found a bug on the map page.', email.body)


    def test_feedback_rejects_blank_name(self):
        payload = {
            **self.valid_payload,
            'name': ' ',
        }

        response = self.client.post(
            self.url,
            payload,
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)
        self.assertEqual(FeedbackMessage.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)


    def test_feedback_rejects_invalid_email(self):
        payload = {
            **self.valid_payload,
            'email': 'non-valid-email',
        }

        response = self.client.post(
            self.url,
            payload,
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertEqual(FeedbackMessage.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)


    def test_feedback_rejects_blank_message(self):
        payload = {
            **self.valid_payload,
            'message': ' ',
        }

        response = self.client.post(
            self.url,
            payload,
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('message', response.data)
        self.assertEqual(FeedbackMessage.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)


    @override_settings(FEEDBACK_RECIPIENT_EMAIL='')
    def test_feedback_is_saved_when_recipient_email_is_not_configured(self):
        response = self.client.post(
            self.url,
            self.valid_payload,
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FeedbackMessage.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 0)


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL='City Map <noreply@example.com>',
    FEEDBACK_RECIPIENT='admin@example.com',
)
class FeedbackThrottleTests(TestCase):
    def setUp(self):
        cache.clear()

        self.client = APIClient()
        self.url = reverse('feedback-create')

        self.valid_payload = {
            'name': 'Ivan',
            'email': 'ivan@example.com',
            'message': 'I found a bug on the map page.'
        }

        mail.outbox = []


    def tearDown(self):
        cache.clear()


    def test_feedback_endpoint_is_throttled(self):
        throttle_rates = {
            **ScopedRateThrottle.THROTTLE_RATES,
            'feedback': '2/hour',
        }

        with patch.object( ScopedRateThrottle, 'THROTTLE_RATES', throttle_rates ):

          first_response = self.client.post(
              self.url,
              self.valid_payload,
              format='json',
          )
          second_response = self.client.post(
              self.url,
              self.valid_payload,
              format='json',
          )
          third_response = self.client.post(
              self.url,
              self.valid_payload,
              format='json',
          )

        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(third_response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

        self.assertEqual(FeedbackMessage.objects.count(), 2)
        self.assertEqual(len(mail.outbox), 2)
