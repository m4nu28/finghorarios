from datetime import time

from django.test import TestCase

from planner.services.combinations import (
    combination_to_meetings,
    generate_combinations,
    get_groups_by_course,
    parse_group_type,
)


class ParseGroupTypeTest(TestCase):
    def test_teorico(self):
        self.assertEqual(parse_group_type("TEORICO GRUPO 1"), "teorico")

    def test_practico(self):
        self.assertEqual(parse_group_type("PRACTICO GRUPO 2"), "practico")

    def test_colaborativo(self):
        self.assertEqual(parse_group_type("COLABORATIVO GRUPO 1"), "colaborativo")

    def test_other(self):
        self.assertEqual(parse_group_type("A1"), "other")


class CombinationsTest(TestCase):
    def setUp(self):
        self.courses_data = [
            {
                "code": "1030",
                "name": "GAL1",
                "groups": [
                    {
                        "group_number": "TEORICO GRUPO 1",
                        "meetings": [
                            {"day": 0, "start": time(8, 0), "end": time(9, 0), "room": "A101"},
                        ],
                    },
                    {
                        "group_number": "TEORICO GRUPO 2",
                        "meetings": [
                            {"day": 1, "start": time(9, 0), "end": time(10, 0), "room": "B202"},
                        ],
                    },
                    {
                        "group_number": "PRACTICO GRUPO 1",
                        "meetings": [
                            {"day": 2, "start": time(10, 0), "end": time(12, 0), "room": "Lab1"},
                        ],
                    },
                    {
                        "group_number": "PRACTICO GRUPO 2",
                        "meetings": [
                            {"day": 3, "start": time(10, 0), "end": time(12, 0), "room": "Lab2"},
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
                            {"day": 0, "start": time(14, 0), "end": time(15, 0), "room": "C303"},
                        ],
                    },
                    {
                        "group_number": "PRACTICO GRUPO 1",
                        "meetings": [
                            {"day": 4, "start": time(8, 0), "end": time(10, 0), "room": "Lab3"},
                        ],
                    },
                ],
            },
        ]

    def test_get_groups_by_course(self):
        result = get_groups_by_course(self.courses_data)
        self.assertIn("1030", result)
        self.assertIn("teorico", result["1030"]["by_type"])
        self.assertIn("practico", result["1030"]["by_type"])
        self.assertEqual(len(result["1030"]["by_type"]["teorico"]), 2)
        self.assertEqual(len(result["1030"]["by_type"]["practico"]), 2)

    def test_generate_combinations_both(self):
        groups = get_groups_by_course(self.courses_data)
        combinations = generate_combinations(groups, {"1030": "both", "1324": "both"})
        self.assertEqual(len(combinations), 4)

    def test_generate_combinations_teorico_only(self):
        groups = get_groups_by_course(self.courses_data)
        combinations = generate_combinations(groups, {"1030": "teorico", "1324": "teorico"})
        self.assertEqual(len(combinations), 2)

    def test_combination_to_meetings_includes_all_groups(self):
        groups = get_groups_by_course(self.courses_data)
        combinations = generate_combinations(groups, {"1030": "both", "1324": "both"})
        meetings = combination_to_meetings(combinations[0])
        course_codes = [m["course_code"] for m in meetings]
        self.assertIn("1030", course_codes)
        self.assertIn("1324", course_codes)

    def test_combination_to_meetings_teorico_and_practico(self):
        groups = get_groups_by_course(self.courses_data)
        combinations = generate_combinations(groups, {"1030": "both"})
        meetings = combination_to_meetings(combinations[0])
        gal_meetings = [m for m in meetings if m["course_code"] == "1030"]
        self.assertGreaterEqual(len(gal_meetings), 2)

    def test_single_course_with_types(self):
        single = [self.courses_data[0]]
        groups = get_groups_by_course(single)
        combinations = generate_combinations(groups, {"1030": "both"})
        self.assertEqual(len(combinations), 4)
