# HRMS Lite

A lightweight Human Resource Management System for managing employee records and daily attendance. Single admin, no authentication.

## Tech stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios
- **Backend:** Django, Django REST Framework
- **Database:** PostgreSQL (production) / SQLite (local default)
- **Deployment:** Vercel (frontend), Render (backend)

## Local setup

### Backend

1. From the project root:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Copy env example and set variables:
   ```bash
   cp .env.example .env
   ```
   For local dev you can leave `DATABASE_URL` unset to use SQLite. Set `SECRET_KEY`, and optionally `CORS_ALLOWED_ORIGINS` (default includes `http://localhost:5173`).
3. Run migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   API base: `http://localhost:8000/api/`

### Frontend

1. From the project root:
   ```bash
   cd frontend
   npm install
   ```
2. Copy env example and set API URL:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_API_BASE_URL=http://localhost:8000/api` for local backend.
3. Start the dev server:
   ```bash
   npm run dev
   ```
   App: `http://localhost:5173`

## Environment variables

### Backend (`.env`)

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret key (required in production) |
| `DEBUG` | Set to `False` in production |
| `ALLOWED_HOSTS` | Comma-separated hosts (e.g. `your-app.onrender.com`) |
| `DATABASE_URL` | PostgreSQL URL (e.g. from Render). If unset, SQLite is used. |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins (e.g. your Vercel URL) |

### Frontend (`.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Full backend API base URL (e.g. `https://your-backend.onrender.com/api`) |

## API reference

Base path: `/api/`

### Employees

- `GET /api/employees/` — List (paginated). Response: `{ "count", "results": [...] }`
- `POST /api/employees/` — Create. Body: `employee_id`, `name`, `email`, optional `department`, `designation`
- `GET /api/employees/<id>/` — Retrieve
- `PATCH /api/employees/<id>/` — Partial update
- `DELETE /api/employees/<id>/` — Delete

### Attendance

- `GET /api/attendance/` — List. Query: `employee`, `date_from`, `date_to`
- `POST /api/attendance/` — Create. Body: `employee` (UUID), `date` (YYYY-MM-DD), `status` (PRESENT \| ABSENT \| HALF_DAY)
- `GET /api/attendance/<id>/` — Retrieve
- `PATCH /api/attendance/<id>/` — Partial update
- `DELETE /api/attendance/<id>/` — Delete

### Summary (dashboard)

- `GET /api/summary/` — Query: optional `date_from`, `date_to`. Response: `total_employees`, `total_present_today`, `present_days_per_employee`

Validation errors: `{ "field_name": ["message"] }`. Other errors: `{ "detail": "message" }`.

## Deployment notes

- **Backend (Render):** Use a Web Service. Set build command to install deps; run `python manage.py migrate` in a release command or build step; start with `gunicorn config.wsgi:application`. Add a PostgreSQL database and set `DATABASE_URL`. Set `CORS_ALLOWED_ORIGINS` to your Vercel app URL.
- **Frontend (Vercel):** Set root to `frontend`, build command `npm run build`, output `dist`. Set `VITE_API_BASE_URL` to the Render backend API URL (e.g. `https://your-app.onrender.com/api`).

See `docs/DEPLOYMENT_CHECKLIST.md` for a step-by-step deployment checklist.

## Assumptions / limitations

- Single admin; no login or permissions.
- No leave, payroll, or advanced HR features.
- One attendance record per employee per day (duplicate date for same employee returns 400).
