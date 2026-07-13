from rest_framework import serializers

from .models import Category, Place

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


class PlaceCreateSerializaer(serializers.ModelSerializer):
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
        )
