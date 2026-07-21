from django.contrib import admin

from .models import Course, CourseGroup, Meeting, ScheduleSource, Semester


class MeetingInline(admin.TabularInline):
    model = Meeting
    extra = 0


class CourseGroupInline(admin.TabularInline):
    model = CourseGroup
    extra = 0


@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ("year", "period")


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "semester", "credits")
    list_filter = ("semester",)
    search_fields = ("code", "name")
    inlines = [CourseGroupInline]


@admin.register(CourseGroup)
class CourseGroupAdmin(admin.ModelAdmin):
    list_display = ("course", "group_number", "quota")
    list_filter = ("course__semester",)
    inlines = [MeetingInline]


@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ("group", "day", "start_time", "end_time", "room")
    list_filter = ("day", "group__course__semester")


@admin.register(ScheduleSource)
class ScheduleSourceAdmin(admin.ModelAdmin):
    list_display = ("source_type", "semester", "file_name", "imported_at")
    list_filter = ("source_type", "semester")
