import { useState, useEffect } from "react";
import { getAttendance, getEmployees, updateAttendance } from "../api/client";
import { getErrorMessage } from "../api/errors";
import Badge from "../components/Badge";
import Table from "../components/Table";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Button from "../components/Button";
import Modal from "../components/Modal";

function statusVariant(s) {
  if (s === "PRESENT") return "success";
  if (s === "ABSENT") return "danger";
  return "warning";
}

export default function AttendanceRecordsPage() {
  const [list, setList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ employee: "", date_from: "", date_to: "" });
  const [editRecord, setEditRecord] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState(null);

  const fetchData = async (filterOverrides = null) => {
    setLoading(true);
    setError(null);
    const f = filterOverrides ?? filters;
    try {
      const params = {};
      if (f.employee) params.employee = f.employee;
      if (f.date_from) params.date_from = f.date_from;
      if (f.date_to) params.date_to = f.date_to;
      const [attData, empData] = await Promise.all([
        getAttendance(params),
        getEmployees(),
      ]);
      setList(Array.isArray(attData) ? attData : []);
      setEmployees(Array.isArray(empData) ? empData : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onApplyFilters = (e) => {
    e.preventDefault();
    fetchData(filters);
  };

  const openEdit = (row) => {
    setEditRecord(row);
    setEditStatus(row.status);
    setEditError(null);
  };

  const closeEdit = () => {
    if (!editSaving) {
      setEditRecord(null);
      setEditError(null);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editRecord || editSaving) return;
    setEditSaving(true);
    setEditError(null);
    try {
      await updateAttendance(editRecord.id, { status: editStatus });
      setEditRecord(null);
      fetchData(filters);
    } catch (err) {
      setEditError(getErrorMessage(err));
    } finally {
      setEditSaving(false);
    }
  };

  const columns = [
    { key: "employee_name", label: "Employee" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge variant={statusVariant(row.status)}>{row.status.replace("_", " ")}</Badge>,
    },
    {
      key: "marked_at",
      label: "Marked at",
      render: (row) => (row.marked_at ? new Date(row.marked_at).toLocaleString() : ""),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button variant="secondary" onClick={() => openEdit(row)}>
          Edit
        </Button>
      ),
    },
  ];

  if (loading && list.length === 0) return <LoadingSpinner />;
  if (error && list.length === 0) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6">Attendance Records</h2>
      <div className="rounded-xl border border-slate-200 bg-white shadow-card p-4 sm:p-6 mb-6">
        <form onSubmit={onApplyFilters} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Employee</label>
            <select
              value={filters.employee}
              onChange={(e) => setFilters((f) => ({ ...f, employee: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">From date</label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">To date</label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Apply
          </Button>
        </form>
      </div>
      {list.length === 0 ? (
        <EmptyState message="No attendance records found." />
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {list.map((row) => (
              <div
                key={row.id}
                className="rounded-xl border border-slate-200 bg-white shadow-card p-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{row.employee_name}</p>
                  <p className="text-sm text-slate-500">{row.date}</p>
                  {row.marked_at && (
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(row.marked_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(row.status)}>{row.status.replace("_", " ")}</Badge>
                  <Button variant="secondary" onClick={() => openEdit(row)}>
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
            <Table columns={columns} data={list} keyField="id" emptySlot="No records." />
          </div>
        </>
      )}

      <Modal open={!!editRecord} onClose={closeEdit} title="Edit attendance">
        {editRecord && (
          <form onSubmit={handleEditSave}>
            <p className="text-slate-600 mb-2">{editRecord.employee_name} · {editRecord.date}</p>
            {editError && <p className="text-sm text-red-600 mb-3">{editError}</p>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="HALF_DAY">Half Day</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={closeEdit} disabled={editSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={editSaving}>
                {editSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
