from decimal import Decimal
from pathlib import Path

from PIL import Image, UnidentifiedImageError
from rest_framework import serializers

from .models import Category, Place

MIN_LATITUDE = Decimal('-90')
MAX_LATITUDE = Decimal('90')
MIN_LONGITUDE = Decimal('-180')
MAX_LONGITUDE = Decimal('180')

MAX_PLACE_IMAGE_SIZE = 2 * 1024 * 1024
MAX_PLACE_IMAGE_WIDTH = 4000
MAX_PLACE_IMAGE_HEIGHT = 4000

ALLOWED_PLACE_IMAGE_CONTENT_TYPES = {
    'image/jpeg', 'image/png', 'image/webp',
}

ALLOWED_PLACE_IMAGE_EXTENSIONS = {
    '.jpg', '.jpeg', '.png', '.webp',
}


def validate_place_image(value):
    if not value:
        return value

    if value.size > MAX_PLACE_IMAGE_SIZE:
        raise serializers.ValidationError(
            'Image file is too large. Max size is 2MB.'
        )

    content_type = getattr(value, 'content_type', '')

    if content_type not in ALLOWED_PLACE_IMAGE_CONTENT_TYPES:
        raise serializers.ValidationError(
            'Unsupported image type. Please, upload JPEG, PNG or WEBP.'
        )

    extension = Path(value.name).suffix.lower()

    if extension not in ALLOWED_PLACE_IMAGE_EXTENSIONS:
        raise serializers.ValidationError(
            'Unsupported image extension. Please, upload JPEG, PNG or WEBP.'
        )

    try:
        image = Image.open(value)
        width, height = image.size
        image.verify()
    except (UnidentifiedImageError, OSError):
        raise serializers.ValidationError(
            'Invalid Image file.'
        )
    finally:
        value.seek(0)

    if (width > MAX_PLACE_IMAGE_WIDTH or height > MAX_PLACE_IMAGE_HEIGHT):
        raise serializers.ValidationError(
            'Image dimansions are too large. Max size is 4000x4000px.'
        )

    return value


def validate_required_text(value, message):
    if not value or not value.strip():
        raise serializers.ValidationError(message)
    return value


def validate_decimal_range(value, min_value, max_value, message):
    if value < min_value or value > max_value:
        raise serializers.ValidationError(message)
    return value


class PlaceFieldsValidationMixin:
    def validate_title(self, value):
        return validate_required_text(value, 'Title is required.')

    def validate_latitude(self, value):
        return validate_decimal_range(
            value,
            MIN_LATITUDE,
            MAX_LATITUDE,
            'Latitude must be between -90 and 90.',
        )

    def validate_longitude(self, value):
        return validate_decimal_range(
            value,
            MIN_LONGITUDE,
            MAX_LONGITUDE,
            'Longitude must be between -180 and 180.',
        )

    def validate_image(self, value):
        return validate_place_image(value)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            'id', 'name', 'slug',
        )

class PlaceSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Place
        fields = (
            'id',
            'category',
            'author_username',
            'title',
            'description',
            'address',
            'latitude',
            'longitude',
            'image',
            'is_published',
            'created_at',
            'updated_at',
        )


class PlaceCreateSerializer(PlaceFieldsValidationMixin, serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
    )

    class Meta:
        model = Place
        fields = (
            'category_id',
            'title',
            'description',
            'address',
            'latitude',
            'longitude',
            'image',
        )


class PlaceUpdateSerializer(PlaceFieldsValidationMixin, serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False,
    )

    class Meta:
        model = Place
        fields = (
            'category_id',
            'title',
            'description',
            'address',
            'latitude',
            'longitude',
            'image',
        )
