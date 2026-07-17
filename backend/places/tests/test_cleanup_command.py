import shutil
import tempfile
from io import StringIO

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.management import call_command
from django.test import TestCase, override_settings

from places.models import Category, Place

User = get_user_model()


class CleanupUnusedPlaceImagesCommandTests(TestCase):
    def setUp(self):
        self.temp_media_root = tempfile.mkdtemp()

        self.override = override_settings(MEDIA_ROOT=self.temp_media_root)
        self.override.enable()

        self.user = User.objects.create_user(
            username='author',
            password='test_password_123'
        )

        self.category = Category.objects.create(
            name='Parks',
            slug='parks'
        )


    def tearDown(self):
        self.override.disable()
        shutil.rmtree(self.temp_media_root, ignore_errors=True)


    def save_file(self, name, content=b'test'):
        return default_storage.save(name, ContentFile(content))


    def test_dry_run_does_not_delete_unused_files(self):
        unused_file_name = self.save_file('places/unused.jpg')

        output = StringIO()

        call_command('cleanup_unused_place_images', stdout=output)

        self.assertTrue(default_storage.exists(unused_file_name))
        self.assertIn('Would delete: places/unused.jpg', output.getvalue())


    def test_delete_removes_unused_files(self):
        unused_file_name = self.save_file('places/unused.jpg')
        output = StringIO()
        call_command(
            'cleanup_unused_place_images',
            '--delete',
            stdout=output
        )
        self.assertFalse(default_storage.exists(unused_file_name))
        self.assertIn('Deleted: places/unused.jpg', output.getvalue())


    def test_delete_keeps_used_files(self):
        used_file_name = self.save_file('places/used.jpg')
        unused_file_name = self.save_file('places/unused.jpg')

        Place.objects.create(
            category=self.category,
            author=self.user,
            title='Place',
            description='Description',
            address='address',
            latitude='55.900000',
            longitude='38.000000',
            image=used_file_name
        )

        call_command(
            'cleanup_unused_place_images',
            '--delete',
            stdout=StringIO()
        )

        self.assertTrue(default_storage.exists(used_file_name))
        self.assertFalse(default_storage.exists(unused_file_name))


    def test_command_handles_missing_places_directory(self):
        output = StringIO()

        call_command(
            'cleanup_unused_place_images',
            stdout=output,
        )

        self.assertIn(
            'The media/images directory does not exist.',
            output.getvalue(),
        )
