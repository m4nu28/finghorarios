from datetime import time

from django.core.management.base import BaseCommand

from courses.models import Course, CourseGroup, Meeting, Semester


class Command(BaseCommand):
    help = "Carga datos de prueba para FING Horarios"

    def handle(self, *args, **options):
        semester, _ = Semester.objects.get_or_create(year=2025, period="sem1")

        courses_data = [
            {
                "code": "1030",
                "name": "GAL1 - Álgebra Lineal",
                "credits": 8,
                "groups": [
                    {
                        "number": "A1",
                        "meetings": [
                            {"day": 0, "start": time(7, 30), "end": time(9, 0), "room": "A101"},
                            {"day": 2, "start": time(7, 30), "end": time(9, 0), "room": "A101"},
                            {"day": 4, "start": time(7, 30), "end": time(9, 0), "room": "A101"},
                        ],
                    },
                    {
                        "number": "A2",
                        "meetings": [
                            {"day": 1, "start": time(9, 0), "end": time(10, 30), "room": "B202"},
                            {"day": 3, "start": time(9, 0), "end": time(10, 30), "room": "B202"},
                            {"day": 5, "start": time(9, 0), "end": time(10, 30), "room": "B202"},
                        ],
                    },
                    {
                        "number": "T1",
                        "meetings": [
                            {"day": 0, "start": time(10, 0), "end": time(12, 0), "room": "Lab3"},
                            {"day": 2, "start": time(10, 0), "end": time(12, 0), "room": "Lab3"},
                        ],
                    },
                    {
                        "number": "T2",
                        "meetings": [
                            {"day": 1, "start": time(14, 0), "end": time(16, 0), "room": "Lab4"},
                            {"day": 3, "start": time(14, 0), "end": time(16, 0), "room": "Lab4"},
                        ],
                    },
                ],
            },
            {
                "code": "1324",
                "name": "CDIV - Cálculo Diferencial",
                "credits": 10,
                "groups": [
                    {
                        "number": "A1",
                        "meetings": [
                            {"day": 0, "start": time(9, 0), "end": time(10, 30), "room": "C303"},
                            {"day": 2, "start": time(9, 0), "end": time(10, 30), "room": "C303"},
                            {"day": 4, "start": time(9, 0), "end": time(10, 30), "room": "C303"},
                        ],
                    },
                    {
                        "number": "A2",
                        "meetings": [
                            {"day": 1, "start": time(7, 30), "end": time(9, 0), "room": "D404"},
                            {"day": 3, "start": time(7, 30), "end": time(9, 0), "room": "D404"},
                            {"day": 5, "start": time(7, 30), "end": time(9, 0), "room": "D404"},
                        ],
                    },
                    {
                        "number": "T1",
                        "meetings": [
                            {"day": 0, "start": time(14, 0), "end": time(16, 0), "room": "Lab1"},
                            {"day": 2, "start": time(14, 0), "end": time(16, 0), "room": "Lab1"},
                        ],
                    },
                ],
            },
            {
                "code": "1446",
                "name": "PROG2 - Programación 2",
                "credits": 8,
                "groups": [
                    {
                        "number": "A1",
                        "meetings": [
                            {"day": 1, "start": time(10, 30), "end": time(12, 0), "room": "Lab5"},
                            {"day": 3, "start": time(10, 30), "end": time(12, 0), "room": "Lab5"},
                        ],
                    },
                    {
                        "number": "A2",
                        "meetings": [
                            {"day": 0, "start": time(16, 0), "end": time(17, 30), "room": "Lab5"},
                            {"day": 2, "start": time(16, 0), "end": time(17, 30), "room": "Lab5"},
                        ],
                    },
                    {
                        "number": "T1",
                        "meetings": [
                            {"day": 1, "start": time(14, 0), "end": time(16, 0), "room": "Lab6"},
                            {"day": 3, "start": time(14, 0), "end": time(16, 0), "room": "Lab6"},
                        ],
                    },
                ],
            },
            {
                "code": "1156",
                "name": "LOG1 - Introducción a la Lógica",
                "credits": 6,
                "groups": [
                    {
                        "number": "A1",
                        "meetings": [
                            {"day": 0, "start": time(12, 0), "end": time(13, 30), "room": "E505"},
                            {"day": 2, "start": time(12, 0), "end": time(13, 30), "room": "E505"},
                        ],
                    },
                    {
                        "number": "A2",
                        "meetings": [
                            {"day": 1, "start": time(16, 0), "end": time(17, 30), "room": "E505"},
                            {"day": 3, "start": time(16, 0), "end": time(17, 30), "room": "E505"},
                        ],
                    },
                    {
                        "number": "T1",
                        "meetings": [
                            {"day": 4, "start": time(10, 0), "end": time(12, 0), "room": "Lab2"},
                        ],
                    },
                ],
            },
            {
                "code": "1605",
                "name": "ARQ1 - Arquitectura de Computadoras",
                "credits": 8,
                "groups": [
                    {
                        "number": "A1",
                        "meetings": [
                            {"day": 1, "start": time(7, 30), "end": time(9, 0), "room": "F606"},
                            {"day": 3, "start": time(7, 30), "end": time(9, 0), "room": "F606"},
                        ],
                    },
                    {
                        "number": "A2",
                        "meetings": [
                            {"day": 0, "start": time(9, 0), "end": time(10, 30), "room": "F606"},
                            {"day": 2, "start": time(9, 0), "end": time(10, 30), "room": "F606"},
                        ],
                    },
                    {
                        "number": "T1",
                        "meetings": [
                            {"day": 5, "start": time(9, 0), "end": time(11, 0), "room": "Lab7"},
                        ],
                    },
                ],
            },
        ]

        created_count = 0
        for course_data in courses_data:
            course, created = Course.objects.get_or_create(
                code=course_data["code"],
                semester=semester,
                defaults={
                    "name": course_data["name"],
                    "credits": course_data["credits"],
                },
            )
            if created:
                created_count += 1

            for group_data in course_data["groups"]:
                group, _ = CourseGroup.objects.get_or_create(
                    course=course,
                    group_number=group_data["number"],
                )
                for meeting_data in group_data["meetings"]:
                    Meeting.objects.get_or_create(
                        group=group,
                        day=meeting_data["day"],
                        start_time=meeting_data["start"],
                        end_time=meeting_data["end"],
                        defaults={"room": meeting_data["room"]},
                    )

        self.stdout.write(
            self.style.SUCCESS(f"Datos cargados: {created_count} materias nuevas")
        )
