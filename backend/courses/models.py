from django.db import models


class Semester(models.Model):
    year = models.PositiveIntegerField()
    period = models.CharField(max_length=10)

    class Meta:
        unique_together = ("year", "period")
        ordering = ["-year", "-period"]

    def __str__(self):
        return f"{self.year} - {self.period}"


class Course(models.Model):
    semester = models.ForeignKey(
        Semester, on_delete=models.CASCADE, related_name="courses"
    )
    code = models.CharField(max_length=10)
    name = models.CharField(max_length=200)
    credits = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.name}"


class CourseGroup(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="groups")
    group_number = models.CharField(max_length=10)
    quota = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("course", "group_number")
        ordering = ["group_number"]

    def __str__(self):
        return f"{self.course.code} - Grupo {self.group_number}"


class Meeting(models.Model):
    DAY_CHOICES = [
        (0, "Lunes"),
        (1, "Martes"),
        (2, "Miércoles"),
        (3, "Jueves"),
        (4, "Viernes"),
        (5, "Sábado"),
    ]

    group = models.ForeignKey(
        CourseGroup, on_delete=models.CASCADE, related_name="meetings"
    )
    day = models.PositiveSmallIntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50, blank=True, default="")

    class Meta:
        ordering = ["day", "start_time"]

    def __str__(self):
        day_name = self.get_day_display()
        return f"{day_name} {self.start_time}-{self.end_time} ({self.room})"


class ScheduleSource(models.Model):
    """Fuente de datos de horarios. Preparado para importación futura desde PDFs de Bedelía."""

    SOURCE_TYPES = [
        ("manual", "Manual"),
        ("pdf", "PDF Bedelía"),
        ("csv", "CSV"),
    ]

    semester = models.ForeignKey(
        Semester, on_delete=models.CASCADE, related_name="sources"
    )
    source_type = models.CharField(max_length=10, choices=SOURCE_TYPES)
    file_name = models.CharField(max_length=200, blank=True, default="")
    imported_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, default="")

    def __str__(self):
        return f"{self.get_source_type_display()} - {self.semester}"
