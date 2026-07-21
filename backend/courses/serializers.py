from rest_framework import serializers

from .models import Course, CourseGroup, Meeting, Semester


class MeetingSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source="get_day_display", read_only=True)

    class Meta:
        model = Meeting
        fields = ["id", "day", "day_display", "start_time", "end_time", "room"]


class CourseGroupSerializer(serializers.ModelSerializer):
    meetings = MeetingSerializer(many=True, read_only=True)

    class Meta:
        model = CourseGroup
        fields = ["id", "group_number", "quota", "meetings"]


class CourseListSerializer(serializers.ModelSerializer):
    group_count = serializers.SerializerMethodField()
    group_types = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ["id", "code", "name", "credits", "group_count", "group_types"]

    def get_group_count(self, obj):
        return obj.groups.count()

    def get_group_types(self, obj):
        from planner.services.combinations import parse_group_type
        types = set()
        for g in obj.groups.all():
            types.add(parse_group_type(g.group_number))
        return sorted(types)


class CourseDetailSerializer(serializers.ModelSerializer):
    groups = CourseGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ["id", "code", "name", "credits", "groups"]


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ["id", "year", "period"]
