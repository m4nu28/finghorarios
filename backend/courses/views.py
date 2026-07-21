from django.db import models
from rest_framework import generics

from .models import Course
from .serializers import CourseDetailSerializer, CourseListSerializer


class CourseListView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Course.objects.all()
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                models.Q(code__icontains=search) | models.Q(name__icontains=search)
            )
        return queryset


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.prefetch_related("groups__meetings")
    serializer_class = CourseDetailSerializer
    lookup_field = "code"
