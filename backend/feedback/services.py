import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_feedback_notification(feedback_message):
    recipient_email = settings.FEEDBACK_RECIPIENT_EMAIL

    if not recipient_email:
        logger.warning('Feedback recipient email is not configured.')
        return False

    subject = f'New feedback message from {feedback_message.message}'

    message = (
        'New feedback message received.\n\n'
        f'Name: {feedback_message.name}\n'
        f'Email: {feedback_message.email}\n'
        f'Created at: {feedback_message.created_at}'
        'Message:\n'
        f'{feedback_message.message}'
    )

    try:
        sent_count = send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
    except Exception:
        logger.exception('Failed to send feedback notification email.')
        return False

    return sent_count > 0