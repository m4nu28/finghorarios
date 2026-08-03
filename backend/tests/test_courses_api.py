from django.test import TestCase
from rest_framework.test import APIClient

from courses.models import Course, Semester


class CourseApiSemesterTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_course_list_defaults_to_latest_semester(self):
        sem1 = Semester.objects.create(year=2026, period="sem1")
        sem2 = Semester.objects.create(year=2026, period="sem2")
        Course.objects.create(semester=sem1, code="OLD", name="Materia vieja")
        Course.objects.create(semester=sem2, code="NEW", name="Materia nueva")

        res = self.client.get("/api/courses/")

        self.assertEqual(res.status_code, 200)
        codes = [course["code"] for course in res.data["data"]]
        self.assertEqual(codes, ["NEW"])

    def test_course_list_can_filter_semester(self):
        sem1 = Semester.objects.create(year=2026, period="sem1")
        sem2 = Semester.objects.create(year=2026, period="sem2")
        Course.objects.create(semester=sem1, code="OLD", name="Materia vieja")
        Course.objects.create(semester=sem2, code="NEW", name="Materia nueva")

        res = self.client.get("/api/courses/?year=2026&period=sem1")

        self.assertEqual(res.status_code, 200)
        codes = [course["code"] for course in res.data["data"]]
        self.assertEqual(codes, ["OLD"])
