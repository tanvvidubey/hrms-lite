from django.db.models import Count
from django.utils import timezone
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer


class EmployeeListCreateView(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"


def get_attendance_queryset(request):
    qs = Attendance.objects.select_related("employee").all()
    employee_id = request.query_params.get("employee")
    date_from = request.query_params.get("date_from")
    date_to = request.query_params.get("date_to")
    if employee_id:
        qs = qs.filter(employee_id=employee_id)
    if date_from:
        qs = qs.filter(date__gte=date_from)
    if date_to:
        qs = qs.filter(date__lte=date_to)
    return qs


class AttendanceListCreateView(generics.ListCreateAPIView):
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        return get_attendance_queryset(self.request)


class AttendanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AttendanceSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_queryset(self):
        return get_attendance_queryset(self.request)


class SummaryView(APIView):
    def get(self, request):
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        today = timezone.now().date()

        total_employees = Employee.objects.count()
        present_today = Attendance.objects.filter(date=today, status="PRESENT").values("employee").distinct().count()

        qs = Attendance.objects.filter(status="PRESENT")
        if date_from:
            qs = qs.filter(date__gte=date_from)
        if date_to:
            qs = qs.filter(date__lte=date_to)
        present_days_qs = qs.values("employee").annotate(present_days=Count("id")).order_by("-present_days")
        emp_ids = [x["employee"] for x in present_days_qs]
        employees = {e.id: e for e in Employee.objects.filter(id__in=emp_ids)}
        present_days_per_employee = [
            {
                "employee_id": str(x["employee"]),
                "name": employees[x["employee"]].name if x["employee"] in employees else "",
                "present_days": x["present_days"],
            }
            for x in present_days_qs
        ]

        return Response({
            "total_employees": total_employees,
            "total_present_today": present_today,
            "present_days_per_employee": present_days_per_employee,
        })
