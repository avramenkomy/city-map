from django.contrib import admin

from .models import FeedbackMessage

@admin.register(FeedbackMessage)
class FeedbackMessageAdmin(admin.ModelAdmin):
    list_display = ( 'id', 'name', 'email', 'is_processed', 'created_at', )
    list_filter = ( 'is_processed', 'created_at', )
    search_fields = ( 'name', 'email', 'message', )
    readonly_fields = ( 'created_at', )
