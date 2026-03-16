import { useState, useEffect } from "react";
import { getSummary } from "../api/client";
import { getErrorMessage } from "../api/errors";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSummary();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchSummary} />;

  const total = data?.total_employees ?? 0;
  const presentToday = data?.total_present_today ?? 0;
  const perEmployee = data?.present_days_per_employee ?? [];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <div className="rounded-xl border border-slate-200 bg-white shadow-card p-6 hover:shadow-cardHover transition-shadow">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Employees</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white shadow-card p-6 hover:shadow-cardHover transition-shadow">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Present Today</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{presentToday}</p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden">
        <h3 className="px-4 sm:px-6 py-4 text-sm font-semibold text-slate-700 border-b border-slate-200 bg-slate-50/50">
          Present days per employee
        </h3>
        {perEmployee.length === 0 ? (
          <p className="p-6 sm:p-8 text-slate-500 text-sm text-center">No attendance data yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {perEmployee.map((row) => (
              <li
                key={row.employee_id}
                className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"
              >
                <span className="font-medium text-slate-900">{row.name || row.employee_id}</span>
                <span className="text-indigo-600 font-semibold">{row.present_days} days</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
