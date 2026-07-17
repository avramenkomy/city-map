from rest_framework import serializers

from .models import FeedbackMessage


class FeedbackMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackMessage
        fields = ( 'id', 'name', 'email', 'message', 'created_at', )
        read_only_fields = ( 'id', 'created_at', )


    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError('Name is required.')
        return value


    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError('Message is required.')
        return value
    