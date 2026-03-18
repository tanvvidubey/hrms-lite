# HRMS Lite

A lightweight Human Resource Management System for managing employee records and daily attendance.
Demo: https://quess-hrms-app.netlify.app/

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
