import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../api/client";
import { getValidationErrors } from "../api/errors";
import Button from "../components/Button";
import Input from "../components/Input";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    email: "",
    department: "",
    designation: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.employee_id?.trim()) next.employee_id = "Employee ID is required.";
    if (!form.name?.trim()) next.name = "Name is required.";
    if (!form.email?.trim()) next.email = "Email is required.";
    else if (!emailRegex.test(form.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    setErrors({});
    try {
      await createEmployee({
        employee_id: form.employee_id.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department.trim() || undefined,
        designation: form.designation.trim() || undefined,
      });
      navigate("/");
    } catch (err) {
      setErrors(getValidationErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6">Add Employee</h2>
      <div className="rounded-xl border border-slate-200 bg-white shadow-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.form && (
            <p className="text-sm text-red-600 px-3 py-2 rounded-lg bg-red-50">{errors.form}</p>
          )}
          <Input
            label="Employee ID"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            error={errors.employee_id}
            required
          />
          <Input label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            label="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
            error={errors.department}
          />
          <Input
            label="Designation"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            error={errors.designation}
          />
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate("/")} className="sm:order-1">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="sm:order-2">
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
