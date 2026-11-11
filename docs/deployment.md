# Deployment notes

## Frontend (current)

From the repository root, run `npm install`, `npm run build`, then deploy the Vite output directory `dist` to Vercel. The frontend does not need environment variables.

## API (Phase 1 scaffold)

From `backend/`, create a virtual environment, install `requirements.txt`, copy `.env.example` to `.env`, and start `uvicorn app.main:app --reload`. Local API docs are at `/docs`. SQLite is the default for development.

For a hosted API, use a managed PostgreSQL service and configure `DATABASE_URL`, `APP_ENV=production`, and `FRONTEND_ORIGINS` in the host’s environment settings. Use a Python version supported by all installed packages. Production migrations and auth must be completed before storing student records. The API is not yet deployed or connected to the Vercel frontend.
