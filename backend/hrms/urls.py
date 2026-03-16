from django.urls import path

from . import views

urlpatterns = [
    path("employees/", views.EmployeeListCreateView.as_view()),
    path("employees/<uuid:id>/", views.EmployeeDetailView.as_view()),
    path("attendance/", views.AttendanceListCreateView.as_view()),
    path("attendance/<uuid:id>/", views.AttendanceDetailView.as_view()),
    path("summary/", views.SummaryView.as_view()),
]
