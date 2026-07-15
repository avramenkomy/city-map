from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from .models import Place
from .utils import delete_file_if_exists


@receiver(pre_save, sender=Place)
def delete_old_image_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old_place = Place.objects.get(pk=instance.pk)
    except Place.DoesNotExist:
        return

    old_image = old_place.image
    new_image = instance.image

    if old_image and old_image.name and old_image.name != new_image.name:
        delete_file_if_exists(old_image)


@receiver(post_delete, sender=Place)
def delete_place_image_on_delete(sender, instance, **kwargs):
    delete_file_if_exists(instance.image)
