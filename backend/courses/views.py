from django.db import models
from rest_framework import generics
from rest_framework.response import Response

from .models import Course
from .serializers import CourseDetailSerializer, CourseListSerializer


class CourseListView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Course.objects.prefetch_related("groups")
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
    queryset = Course.objects.prefetch_related("groups__meetings")
    serializer_class = CourseDetailSerializer
    lookup_field = "code"
