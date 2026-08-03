from datetime import time

from django.test import TestCase

from planner.services.planner import generate


class PlannerGenerateTest(TestCase):
    def setUp(self):
        self.courses_data = [
            {
                "code": "1030",
                "name": "GAL1",
                "groups": [
                    {
                        "group_number": "TEORICO GRUPO 1",
                        "meetings": [
                            {"day": 0, "start": time(8, 0), "end": time(10, 0), "room": "A101"},
                            {"day": 2, "start": time(8, 0), "end": time(10, 0), "room": "A101"},
                        ],
                    },
                    {
                        "group_number": "TEORICO GRUPO 2",
                        "meetings": [
                            {"day": 1, "start": time(9, 0), "end": time(11, 0), "room": "B202"},
                            {"day": 3, "start": time(9, 0), "end": time(11, 0), "room": "B202"},
                        ],
                    },
                    {
                        "group_number": "PRACTICO GRUPO 1",
                        "meetings": [
                            {"day": 2, "start": time(14, 0), "end": time(16, 0), "room": "Lab1"},
                        ],
                    },
                    {
                        "group_number": "PRACTICO GRUPO 2",
                        "meetings": [
                            {"day": 4, "start": time(14, 0), "end": time(16, 0), "room": "Lab2"},
                        ],
                    },
                ],
            },
            {
                "code": "1324",
                "name": "CDIV",
                "groups": [
                    {
                        "group_number": "TEORICO GRUPO 1",
                        "meetings": [
                            {"day": 0, "start": time(10, 30), "end": time(12, 0), "room": "C303"},
                            {"day": 2, "start": time(10, 30), "end": time(12, 0), "room": "C303"},
                        ],
                    },
                    {
                        "group_number": "PRACTICO GRUPO 1",
                        "meetings": [
                            {"day": 1, "start": time(14, 0), "end": time(16, 0), "room": "D404"},
                        ],
                    },
                ],
            },
        ]

    def test_generate_basic(self):
        result = generate(self.courses_data)
        self.assertIn("solutions", result)
        self.assertIn("total_combinations", result)
        self.assertIn("valid_combinations", result)
        self.assertEqual(result["total_combinations"], 4)

    def test_generate_both_mode(self):
        result = generate(
            self.courses_data,
            course_types={"1030": "both", "1324": "both"},
        )
        self.assertEqual(result["total_combinations"], 4)

    def test_generate_teorico_only(self):
        result = generate(
            self.courses_data,
            course_types={"1030": "teorico", "1324": "teorico"},
        )
        self.assertEqual(result["total_combinations"], 2)

    def test_generate_filters_conflicts(self):
        courses_with_conflict = [
            {
                "code": "A",
                "name": "Course A",
                "groups": [
                    {
                        "group_number": "TEORICO GRUPO 1",
                        "meetings": [
                            {"day": 0, "start": time(8, 0), "end": time(10, 0), "room": ""},
                        ],
                    },
                ],
            },
            {
                "code": "B",
                "name": "Course B",
                "groups": [
                    {
                        "group_number": "TEORICO GRUPO 1",
                        "meetings": [
                            {"day": 0, "start": time(9, 0), "end": time(11, 0), "room": ""},
                        ],
                    },
                ],
            },
        ]
        result = generate(courses_with_conflict)
        self.assertEqual(result["valid_combinations"], 0)

    def test_generate_with_busy_blocks(self):
        busy_blocks = [{"day": 1, "start": time(9, 0), "end": time(11, 0)}]
        result = generate(self.courses_data, busy_blocks=busy_blocks)
        for solution in result["solutions"]:
            for meeting in solution["meetings"]:
                if meeting["day"] == 1:
                    overlaps = meeting["start"] < busy_blocks[0]["end"] and busy_blocks[0]["start"] < meeting["end"]
                    self.assertFalse(overlaps)

    def test_generate_with_preferences(self):
        prefs = {"max_days": 3, "avoid_friday": True}
        result = generate(self.courses_data, preferences=prefs)
        self.assertGreater(len(result["solutions"]), 0)

    def test_generate_prefers_less_gap_from_fixed_block(self):
        courses_data = [
            {
                "code": "A",
                "name": "Materia A",
                "groups": [
                    {
                        "group_number": "TEORICO GRUPO 1",
                        "meetings": [
                            {"day": 0, "start": time(10, 0), "end": time(12, 0), "room": ""},
                        ],
                    },
                    {
                        "group_number": "TEORICO GRUPO 2",
                        "meetings": [
                            {"day": 0, "start": time(14, 0), "end": time(16, 0), "room": ""},
                        ],
                    },
                ],
            }
        ]
        busy_blocks = [
            {"day": 0, "start": time(8, 0), "end": time(9, 0), "fixed": True},
        ]

        result = generate(courses_data, busy_blocks=busy_blocks)

        self.assertEqual(result["solutions"][0]["groups"][0]["group_number"], "TEORICO GRUPO 1")
        self.assertEqual(result["solutions"][0]["gap_minutes"], 60)

    def test_generate_returns_meetings(self):
        result = generate(self.courses_data)
        for solution in result["solutions"]:
            self.assertIn("meetings", solution)
            self.assertIn("score", solution)
            self.assertIn("positives", solution)
            self.assertIn("negatives", solution)

    def test_groups_in_solution_include_all(self):
        result = generate(self.courses_data, course_types={"1030": "both", "1324": "both"})
        for solution in result["solutions"]:
            codes = [g["course_code"] for g in solution["groups"]]
            self.assertIn("1030", codes)
            self.assertIn("1324", codes)
