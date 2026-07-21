from datetime import time

from rest_framework.response import Response
from rest_framework.views import APIView

from courses.models import Course

from .serializers import GenerateRequestSerializer
from .services.planner import generate


class GenerateScheduleView(APIView):
    def post(self, request):
        serializer = GenerateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        course_codes = data["course_codes"]
        busy_blocks = _parse_busy_blocks(data.get("busy_blocks", []))
        preferences = data.get("preferences", {})
        course_types = data.get("course_types", {})

        courses = Course.objects.filter(code__in=course_codes).prefetch_related(
            "groups__meetings"
        )
        found_codes = {c.code for c in courses}
        missing = [c for c in course_codes if c not in found_codes]

        if missing:
            return Response(
                {"error": f"Materias no encontradas: {', '.join(missing)}"},
                status=400,
            )

        courses_data = []
        for course in courses:
            groups = []
            for group in course.groups.all():
                meetings = []
                for meeting in group.meetings.all():
                    meetings.append({
                        "day": meeting.day,
                        "start": meeting.start_time,
                        "end": meeting.end_time,
                        "room": meeting.room,
                    })
                groups.append({
                    "group_number": group.group_number,
                    "meetings": meetings,
                })
            courses_data.append({
                "code": course.code,
                "name": course.name,
                "groups": groups,
            })

        if not any(c["groups"] for c in courses_data):
            return Response(
                {"error": "Las materias seleccionadas no tienen grupos disponibles."},
                status=400,
            )

        result = generate(courses_data, busy_blocks, preferences, course_types)
        return Response(result)


def _parse_busy_blocks(blocks):
    parsed = []
    for block in blocks:
        start_parts = block["start"].split(":")
        end_parts = block["end"].split(":")
        parsed.append({
            "day": block["day"],
            "start": time(int(start_parts[0]), int(start_parts[1])),
            "end": time(int(end_parts[0]), int(end_parts[1])),
            "reason": block.get("reason"),
        })
    return parsed
