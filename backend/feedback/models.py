from django.db import models

class FeedbackMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()

    is_processed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Feedback message"
        verbose_name_plural = "Feedback messages"
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} <{self.email}>'
