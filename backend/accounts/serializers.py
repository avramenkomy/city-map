from django.contrib.auth import authenticate, get_user_model, password_validation
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

User = get_user_model()


class UserSerializar(serializers.ModelSerializer):
    is_authenticated = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'is_authenticated',
        )

    def get_is_authenticated(self, obj):
        return True


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                'User with this username already exists.'
            )

        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'passwords do not match.'
            })

        user = User (
            username=attrs['username'],
            email=attrs.get('email', '')
        )

        try:
            password_validation.validate_password(attrs['password'], user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({
                'password': list(exc.messages)
            })

        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        return User.object.create_user(
            password=password,
            **validated_data
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            username=attrs['username'],
            password=attrs['password'],
        )

        if (user is None):
            raise serializers.ValidationError('Invalid username or password.')

        attrs['user'] = user
        return attrs