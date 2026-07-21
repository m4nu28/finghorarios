from datetime import time

from django.test import TestCase

from planner.services.scoring import calculate_score


class ScoringTest(TestCase):
    def _make_meetings(self, schedule):
        meetings = []
        for day, start_h, start_m, end_h, end_m in schedule:
            meetings.append({
                "day": day,
                "start": time(start_h, start_m),
                "end": time(end_h, end_m),
            })
        return meetings

    def test_perfect_schedule(self):
        meetings = self._make_meetings([
            (0, 8, 0, 10, 0),
            (0, 10, 30, 12, 30),
            (2, 8, 0, 10, 0),
            (2, 10, 30, 12, 30),
        ])
        result = calculate_score(meetings, {"max_days": 4, "avoid_friday": True})
        self.assertGreater(result["score"], 80)
        self.assertIn("Sin viernes", result["positives"])
        self.assertEqual(result["days"], 2)

    def test_friday_penalty(self):
        meetings = self._make_meetings([
            (4, 8, 0, 10, 0),
            (4, 10, 30, 12, 30),
        ])
        result = calculate_score(meetings, {"avoid_friday": True})
        self.assertIn("Incluye viernes", result["negatives"])

    def test_gap_penalty(self):
        meetings = self._make_meetings([
            (0, 8, 0, 10, 0),
            (0, 14, 0, 16, 0),
        ])
        result = calculate_score(meetings, {})
        self.assertGreater(result["gap_minutes"], 0)

    def test_no_gaps(self):
        meetings = self._make_meetings([
            (0, 8, 0, 10, 0),
            (0, 10, 0, 12, 0),
        ])
        result = calculate_score(meetings, {})
        self.assertEqual(result["gap_minutes"], 0)
        self.assertIn("Sin tiempo muerto", result["positives"])

    def test_too_many_days_penalty(self):
        meetings = self._make_meetings([
            (0, 8, 0, 10, 0),
            (1, 8, 0, 10, 0),
            (2, 8, 0, 10, 0),
            (3, 8, 0, 10, 0),
            (4, 8, 0, 10, 0),
            (5, 8, 0, 10, 0),
        ])
        result = calculate_score(meetings, {"max_days": 4})
        self.assertIn("6 días activos", result["negatives"][0])

    def test_score_bounds(self):
        meetings = self._make_meetings([
            (0, 8, 0, 10, 0),
            (1, 8, 0, 10, 0),
            (2, 8, 0, 10, 0),
            (3, 8, 0, 10, 0),
            (4, 8, 0, 10, 0),
            (5, 8, 0, 10, 0),
        ])
        result = calculate_score(meetings, {"max_days": 2, "avoid_friday": True, "avoid_saturday": True})
        self.assertGreaterEqual(result["score"], 0)
        self.assertLessEqual(result["score"], 100)
