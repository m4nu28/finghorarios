from datetime import time

from django.test import TestCase

from planner.services.conflicts import (
    busy_blocks_conflict,
    combination_has_conflict,
    meetings_overlap,
    times_overlap,
)


class TimesOverlapTest(TestCase):
    def test_overlapping_times(self):
        self.assertTrue(times_overlap(time(8, 0), time(10, 0), time(9, 0), time(11, 0)))

    def test_adjacent_times_no_overlap(self):
        self.assertFalse(times_overlap(time(8, 0), time(9, 0), time(9, 0), time(10, 0)))

    def test_contained_times(self):
        self.assertTrue(times_overlap(time(8, 0), time(12, 0), time(9, 0), time(10, 0)))

    def test_no_overlap(self):
        self.assertFalse(times_overlap(time(8, 0), time(9, 0), time(10, 0), time(11, 0)))

    def test_same_time(self):
        self.assertTrue(times_overlap(time(8, 0), time(9, 0), time(8, 0), time(9, 0)))


class MeetingsOverlapTest(TestCase):
    def test_same_day_overlap(self):
        a = {"day": 0, "start": time(8, 0), "end": time(10, 0)}
        b = {"day": 0, "start": time(9, 0), "end": time(11, 0)}
        self.assertTrue(meetings_overlap(a, b))

    def test_different_day_no_overlap(self):
        a = {"day": 0, "start": time(8, 0), "end": time(10, 0)}
        b = {"day": 1, "start": time(8, 0), "end": time(10, 0)}
        self.assertFalse(meetings_overlap(a, b))

    def test_same_day_no_overlap(self):
        a = {"day": 0, "start": time(8, 0), "end": time(9, 0)}
        b = {"day": 0, "start": time(9, 0), "end": time(10, 0)}
        self.assertFalse(meetings_overlap(a, b))


class CombinationConflictTest(TestCase):
    def test_no_conflict(self):
        meetings = [
            {"day": 0, "start": time(8, 0), "end": time(9, 0)},
            {"day": 0, "start": time(10, 0), "end": time(11, 0)},
        ]
        self.assertFalse(combination_has_conflict(meetings))

    def test_has_conflict(self):
        meetings = [
            {"day": 0, "start": time(8, 0), "end": time(10, 0)},
            {"day": 0, "start": time(9, 0), "end": time(11, 0)},
        ]
        self.assertTrue(combination_has_conflict(meetings))

    def test_empty_meetings(self):
        self.assertFalse(combination_has_conflict([]))


class BusyBlocksConflictTest(TestCase):
    def test_no_conflict(self):
        meetings = [
            {"day": 0, "start": time(8, 0), "end": time(9, 0)},
        ]
        blocks = [{"day": 0, "start": time(14, 0), "end": time(16, 0)}]
        self.assertFalse(busy_blocks_conflict(meetings, blocks))

    def test_has_conflict(self):
        meetings = [
            {"day": 0, "start": time(8, 0), "end": time(10, 0)},
        ]
        blocks = [{"day": 0, "start": time(9, 0), "end": time(11, 0)}]
        self.assertTrue(busy_blocks_conflict(meetings, blocks))

    def test_different_day_no_conflict(self):
        meetings = [
            {"day": 0, "start": time(8, 0), "end": time(10, 0)},
        ]
        blocks = [{"day": 1, "start": time(8, 0), "end": time(10, 0)}]
        self.assertFalse(busy_blocks_conflict(meetings, blocks))

    def test_empty_blocks(self):
        meetings = [
            {"day": 0, "start": time(8, 0), "end": time(10, 0)},
        ]
        self.assertFalse(busy_blocks_conflict(meetings, []))
