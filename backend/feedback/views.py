from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

from .models import FeedbackMessage
from .serializers import FeedbackMessageSerializer


class FeedbackMessageCreateAPIView(CreateAPIView):
    queryset = FeedbackMessage.objects.all()
    serializer_class = FeedbackMessageSerializer
    permission_classes = [AllowAny]
