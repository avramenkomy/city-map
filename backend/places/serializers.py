from pathlib import Path

from rest_framework import serializers

from .models import Category, Place

MAX_PLACE_IMAGE_SIZE = 2 * 1024 * 1024

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

    content_type = getattr(value, 'content-type', '')

    if content_type not in ALLOWED_PLACE_IMAGE_CONTENT_TYPES:
        raise serializers.ValidationError(
            'Unsupported image type. Please, upload JPEG, PNG or WEBP.'
        )

    extension = Path(value.name).suffix.lower()

    if extension not in ALLOWED_PLACE_IMAGE_EXTENSIONS:
        raise serializers.ValidationError(
            'Unsupported image extension. Please, upload JPEG, PNG or WEBP.'
        )

    return value

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


class PlaceCreateSerializer(serializers.ModelSerializer):
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

    def validate_image(self, value):
        return validate_place_image(value)


class PlaceUpdateSerializer(serializers.ModelSerializer):
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

    def validate_image(self, value):
        return validate_place_image(value)
