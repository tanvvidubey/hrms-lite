import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../api/client";
import { getErrorMessage } from "../api/errors";
import Button from "../components/Button";
import Table from "../components/Table";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

export default function EmployeeListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmployees();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await deleteEmployee(deleteModal.id);
      setDeleteModal(null);
      await fetchList();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "employee_id", label: "Employee ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "designation", label: "Designation" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button variant="danger" onClick={() => setDeleteModal({ id: row.id, name: row.name })}>
          Delete
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchList} />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Employees</h2>
        <Link to="/add-employee" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Add Employee</Button>
        </Link>
      </div>
      {list.length === 0 ? (
        <EmptyState
          message="No employees yet. Add one to get started."
          action={
            <Link to="/add-employee">
              <Button>Add Employee</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {list.map((row) => (
              <div
                key={row.id}
                className="rounded-xl border border-slate-200 bg-white shadow-card p-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate">{row.name}</p>
                  <p className="text-sm text-slate-500 truncate">{row.employee_id} · {row.email}</p>
                  {(row.department || row.designation) && (
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {[row.department, row.designation].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <Button variant="danger" onClick={() => setDeleteModal({ id: row.id, name: row.name })}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
            <Table columns={columns} data={list} keyField="id" emptySlot="No employees." />
          </div>
        </>
      )}
      <Modal open={!!deleteModal} onClose={() => !deleting && setDeleteModal(null)} title="Delete employee?">
        {deleteModal && (
          <>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <strong>{deleteModal.name}</strong>? This cannot be undone.
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="danger" onClick={handleDelete} disabled={deleting} className="sm:order-2">
                {deleting ? "Deleting..." : "Delete"}
              </Button>
              <Button variant="secondary" onClick={() => setDeleteModal(null)} disabled={deleting} className="sm:order-1">
                Cancel
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
