from django.contrib import admin
from .models import Employee, Attendance


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ["employee_id", "name", "email", "department", "designation"]


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ["employee", "date", "status", "marked_at"]
    list_filter = ["status", "date"]
