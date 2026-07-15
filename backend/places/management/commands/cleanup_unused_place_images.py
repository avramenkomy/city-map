from django.core.files.storage import default_storage
from django.core.management.base import BaseCommand

from places.models import Place


class Command(BaseCommand):
    help = 'Find and optionally delete unused place image files.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete',
            action='store_true',
            help='Actually delete unused filed. Without this flag, the command only shows what would be deleted.'
        )

    def handle(self, *args, **options):
        should_delete = options['delete']

        used_image_names = set(
            Place.objects
            .exclude(image='')
            .exclude(image__isnull=True)
            .values_list('image', flat=True)
        )

        try:
            _, file_names = default_storage.listdir('places')
        except FileNotFoundError:
            self.stdout.write(
                self.style.WARNING('The media/images directory does not exist.')
            )
            return

        stored_image_names = {
            f"places/{file_name}"
            for file_name in file_names
        }

        unused_image_names = sorted(stored_image_names - used_image_names)

        if not unused_image_names:
            self.stdout.write(
                self.style.SUCCESS(
                    'No unused place images found.'
                )
            )
            return

        if should_delete:
            for image_name in unused_image_names:
                default_storage.delete(image_name)
                self.stdout.write(f'Deleted: {image_name}')

            self.stdout.write(
                self.style.SUCCESS(
                    f'Deleted {len(unused_image_names)} unused place image file(s).'
                )
            )
            return

        for image_name in unused_image_names:
            self.stdout.write(f'Would delete: {image_name}')

        self.stdout.write(
            self.style.WARNING(
                'Run with --delete to actually delete these file'
            )
        )