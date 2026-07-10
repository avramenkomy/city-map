from django.contrib import admin

from .models import Category, Place

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
  list_display = ('id', 'name', 'slug')
  search_fields = ('name', 'slug')
  prepopulated_fields = {'slug': ('name',)}

@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
  list_display = (
    'id',
    'title',
    'category',
    'author',
    'is_published',
    'created_at'
  )
  list_filter = ('category', 'is_published', 'created_at')
  search_fields = ('title', 'description', 'address')
  readonly_fields = ('created_at', 'updated_at')
