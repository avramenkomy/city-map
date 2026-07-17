from django.urls import path

from .views import FeedbackMessageCreateAPIView

urlpatterns = [
    path('feedback/', FeedbackMessageCreateAPIView.as_view(), name='feedback-create'),
]
