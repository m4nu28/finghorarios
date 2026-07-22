from django.urls import path

from .views import GenerateScheduleView

app_name = "planner"

urlpatterns = [
    path("", GenerateScheduleView.as_view(), name="generate"),
]
