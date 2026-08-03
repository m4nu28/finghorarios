from django.db import models
from rest_framework import generics
from rest_framework.response import Response

from .models import Course, Semester
from .serializers import CourseDetailSerializer, CourseListSerializer


def get_requested_semester(request):
    year = request.query_params.get("year")
    period = request.query_params.get("period")
    queryset = Semester.objects.all()
    if year:
        queryset = queryset.filter(year=year)
    if period:
        queryset = queryset.filter(period=period)
    return queryset.first()


class CourseListView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Course.objects.prefetch_related("groups")
        semester = get_requested_semester(self.request)
        if semester:
            queryset = queryset.filter(semester=semester)
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                models.Q(code__icontains=search) | models.Q(name__icontains=search)
            )
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({"data": serializer.data})


class CourseDetailView(generics.RetrieveAPIView):
    serializer_class = CourseDetailSerializer
    lookup_field = "code"

    def get_queryset(self):
        queryset = Course.objects.prefetch_related("groups__meetings")
        semester = get_requested_semester(self.request)
        if semester:
            queryset = queryset.filter(semester=semester)
        return queryset
