from rest_framework import serializers
from .models import Employee, Attendance


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ["id", "employee_id", "name", "email", "department", "designation", "created_at", "updated_at"]

    def validate_employee_id(self, value):
        value = (value or "").strip()
        if not value:
            raise serializers.ValidationError("Employee ID is required.")
        qs = Employee.objects.filter(employee_id__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("An employee with this Employee ID already exists.")
        return value

    def validate_name(self, value):
        if not (value or "").strip():
            raise serializers.ValidationError("Name is required.")
        return value.strip()

    def validate_email(self, value):
        if not (value or "").strip():
            raise serializers.ValidationError("Email is required.")
        value = value.strip()
        qs = Employee.objects.filter(email__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("An employee with this email already exists.")
        return value


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.name", read_only=True)

    class Meta:
        model = Attendance
        fields = ["id", "employee", "employee_name", "date", "status", "marked_at"]

    def validate_status(self, value):
        allowed = ["PRESENT", "ABSENT", "HALF_DAY"]
        if value not in allowed:
            raise serializers.ValidationError(f"Status must be one of: {', '.join(allowed)}")
        return value

    def validate(self, data):
        employee = data.get("employee")
        date = data.get("date")
        if employee and date and not self.instance:
            if Attendance.objects.filter(employee=employee, date=date).exists():
                raise serializers.ValidationError(
                    "Attendance for this employee on this date is already marked. Edit the existing record from Attendance Records."
                )
        if employee and date and self.instance:
            qs = Attendance.objects.filter(employee=employee, date=date).exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {"date": "Another attendance record already exists for this employee on this date."}
                )
        return data
