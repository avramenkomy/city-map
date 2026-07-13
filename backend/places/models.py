from django.db import models
from django.conf import settings

# Create your models here.

class Category(models.Model):
  name = models.CharField(max_length=100)
  slug = models.SlugField(max_length=120, unique=True)

  class Meta:
    verbose_name = 'Category'
    verbose_name_plural = 'Categories'
    ordering = ['name']

  def __str__(self):
    return self.name


class Place(models.Model):
  category = models.ForeignKey(
    Category,
    on_delete=models.PROTECT,
    related_name='places',
  )
  author = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='places',
  )
  title = models.CharField(max_length=200)
  description = models.TextField(blank=True)
  address = models.CharField(max_length=255, blank=True)

  latitude = models.DecimalField(max_digits=9, decimal_places=6)
  longitude = models.DecimalField(max_digits=9, decimal_places=6)

  image = models.ImageField(upload_to='places/', blank=True, null=True)

  is_published = models.BooleanField(default=True)

  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    verbose_name = 'Place'
    verbose_name_plural = 'Places'
    ordering=['-created_at']

  def __str__(self):
    return self.title
