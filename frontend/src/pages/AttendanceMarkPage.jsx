import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createAttendance, getEmployees } from "../api/client";
import { getErrorMessage, getValidationErrors } from "../api/errors";
import Button from "../components/Button";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";

export default function AttendanceMarkPage() {
  const [employees, setEmployees] = useState([]);
  const [loadingEmp, setLoadingEmp] = useState(true);
  const [errorEmp, setErrorEmp] = useState(null);
  const [form, setForm] = useState({
    employee: "",
    date: new Date().toISOString().slice(0, 10),
    status: "PRESENT",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingEmp(true);
    setErrorEmp(null);
    getEmployees()
      .then((data) => {
        if (!cancelled) setEmployees(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setErrorEmp(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoadingEmp(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee || submitting) return;
    setErrors({});
    setSubmitting(true);
    try {
      await createAttendance({
        employee: form.employee,
        date: form.date,
        status: form.status,
      });
      setSuccess("Attendance marked successfully.");
      setForm((prev) => ({
        ...prev,
        employee: "",
        date: new Date().toISOString().slice(0, 10),
        status: "PRESENT",
      }));
    } catch (err) {
      setErrors(getValidationErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEmp) return <LoadingSpinner />;
  if (errorEmp) return <ErrorState message={errorEmp} onRetry={() => window.location.reload()} />;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6">Mark Attendance</h2>
      <div className="rounded-xl border border-slate-200 bg-white shadow-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {(errors.form || errors.date) && (
            <div className="rounded-lg bg-red-50 px-3 py-2 space-y-1">
              <p className="text-sm text-red-600">{errors.form || errors.date}</p>
              {(String(errors.form || errors.date || "").toLowerCase().includes("already")) && (
                <Link to="/attendance" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 block">
                  Go to Attendance Records to edit →
                </Link>
              )}
            </div>
          )}
          {success && (
            <p className="text-sm text-emerald-700 px-3 py-2 rounded-lg bg-emerald-50">{success}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Employee *</label>
            <select
              name="employee"
              value={form.employee}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.employee ? "border-red-500" : "border-slate-300"
              }`}
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.employee_id} - {emp.name}
                </option>
              ))}
            </select>
            {errors.employee && <p className="mt-1.5 text-sm text-red-600">{errors.employee}</p>}
          </div>
          <Input
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            error={errors.date}
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status *</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="HALF_DAY">Half Day</option>
            </select>
          </div>
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Saving..." : "Mark Attendance"}
          </Button>
        </form>
      </div>
    </div>
  );
}
