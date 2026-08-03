from datetime import time

from django.test import TestCase

from courses.models import Course, Meeting
from courses.scraper import _parse_format_engineering, save_to_db


class ScraperParsingTests(TestCase):
    def test_engineering_parser_accepts_accented_group_and_dash_variants(self):
        courses = {}
        data = [
            ["Asignatura: MAT 01 – Cálculo Diferencial", "Lunes", "Martes"],
            ["TEÓRICO GRUPO 1", "08:00 - 10:00\nA11", ""],
            ["PRÁCTICO GRUPO 2", "", "10:00 - 12:00\nA12"],
        ]

        _parse_format_engineering(data, courses, None, None)

        self.assertIn("MAT-01", courses)
        self.assertEqual(courses["MAT-01"]["name"], "Cálculo Diferencial")
        self.assertIn("TEORICO GRUPO 1", courses["MAT-01"]["groups"])
        self.assertIn("PRACTICO GRUPO 2", courses["MAT-01"]["groups"])
        self.assertEqual(
            courses["MAT-01"]["groups"]["TEORICO GRUPO 1"]["meetings"][0]["room"],
            "A11",
        )


class ScraperSaveTests(TestCase):
    def test_save_to_db_replaces_existing_course_meetings(self):
        first = [
            {
                "code": "MAT-01",
                "name": "Cálculo",
                "groups": {
                    "TEORICO GRUPO 1": {
                        "group_number": "TEORICO GRUPO 1",
                        "meetings": [
                            {"day": 0, "start": time(8), "end": time(10), "room": "A11"}
                        ],
                    }
                },
            }
        ]
        second = [
            {
                "code": "MAT-01",
                "name": "Cálculo",
                "groups": {
                    "TEORICO GRUPO 1": {
                        "group_number": "TEORICO GRUPO 1",
                        "meetings": [
                            {"day": 1, "start": time(9), "end": time(11), "room": "B22"}
                        ],
                    }
                },
            }
        ]

        save_to_db(first, 2026, "sem2")
        save_to_db(second, 2026, "sem2")

        course = Course.objects.get(code="MAT-01")
        meetings = list(Meeting.objects.filter(group__course=course))
        self.assertEqual(len(meetings), 1)
        self.assertEqual(meetings[0].day, 1)
        self.assertEqual(meetings[0].room, "B22")
