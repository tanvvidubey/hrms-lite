import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export async function getEmployees() {
  const { data } = await client.get("/employees/");
  return data.results ?? data;
}

export async function getEmployee(id) {
  const { data } = await client.get(`/employees/${id}/`);
  return data;
}

export async function createEmployee(payload) {
  const { data } = await client.post("/employees/", payload);
  return data;
}

export async function updateEmployee(id, payload) {
  const { data } = await client.patch(`/employees/${id}/`, payload);
  return data;
}

export async function deleteEmployee(id) {
  await client.delete(`/employees/${id}/`);
}

export async function getAttendance(params = {}) {
  const { data } = await client.get("/attendance/", { params });
  return data.results ?? data;
}

export async function getAttendanceRecord(id) {
  const { data } = await client.get(`/attendance/${id}/`);
  return data;
}

export async function createAttendance(payload) {
  const { data } = await client.post("/attendance/", payload);
  return data;
}

export async function updateAttendance(id, payload) {
  const { data } = await client.patch(`/attendance/${id}/`, payload);
  return data;
}

export async function deleteAttendance(id) {
  await client.delete(`/attendance/${id}/`);
}

export async function getSummary(params = {}) {
  const { data } = await client.get("/summary/", { params });
  return data;
}

export { client };
