import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";

const nav = [
  { to: "/", label: "Employees" },
  { to: "/add-employee", label: "Add Employee" },
  { to: "/mark-attendance", label: "Mark Attendance" },
  { to: "/attendance", label: "Attendance Records" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white border-b border-slate-200 shadow-card">
        <h1 className="text-lg font-semibold text-slate-900">HRMS Lite</h1>
        <button
          type="button"
          onClick={() => setSidebarOpen((o) => !o)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      <div
        className={`fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm lg:hidden transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-slate-200 shadow-card transition-transform duration-200 ease-out lg:static lg:z-0 lg:shadow-none lg:flex lg:flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="hidden lg:flex flex-col h-full">
          <div className="p-5 border-b border-slate-200">
            <h1 className="text-lg font-semibold text-slate-900">HRMS Lite</h1>
          </div>
          <nav className="p-3 flex-1 overflow-y-auto">
            {nav.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass} onClick={() => setSidebarOpen(false)}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="lg:hidden pt-14 flex flex-col h-full">
          <nav className="p-3 flex-1 overflow-y-auto">
            {nav.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass} onClick={() => setSidebarOpen(false)}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
