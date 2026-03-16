import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import EmployeeListPage from "./pages/EmployeeListPage";
import AddEmployeePage from "./pages/AddEmployeePage";
import AttendanceMarkPage from "./pages/AttendanceMarkPage";
import AttendanceRecordsPage from "./pages/AttendanceRecordsPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<EmployeeListPage />} />
          <Route path="add-employee" element={<AddEmployeePage />} />
          <Route path="mark-attendance" element={<AttendanceMarkPage />} />
          <Route path="attendance" element={<AttendanceRecordsPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
