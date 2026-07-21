from django.db import models


class ScheduleRequest(models.Model):
    """Tracks generated schedules for analytics (optional, no auth required)."""
    created_at = models.DateTimeField(auto_now_add=True)
    courses = models.JSONField(default=list)
    result_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]
