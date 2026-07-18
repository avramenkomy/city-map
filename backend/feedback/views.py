from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle

from .models import FeedbackMessage
from .serializers import FeedbackMessageSerializer
from .services import send_feedback_notification


class FeedbackMessageCreateAPIView(CreateAPIView):
    queryset = FeedbackMessage.objects.all()
    serializer_class = FeedbackMessageSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'feedback'


    def perform_create(self, serializer):
        feedback_message = serializer.save()
        send_feedback_notification(feedback_message)
