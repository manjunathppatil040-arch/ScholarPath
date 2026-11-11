# Database design — Phase 1

The initial SQLAlchemy schema covers `users`, `student_profiles`, `scholarships`, and `scholarship_sources`.

| Table | Purpose | Important constraints |
|---|---|---|
| `users` | Account identity foundation | Unique indexed email; password field stores only a future password hash |
| `student_profiles` | Optional matching attributes | One profile per user; cascade delete; sensitive category/income values nullable |
| `scholarships` | Structured public opportunity record | Unique indexed slug; indexed name, provider, status and deadline; nullable deadline and apply URL |
| `scholarship_sources` | Provenance and verification dates | Foreign key to scholarship; child records deleted with parent |

Local development defaults to SQLite to reduce setup friction. Production uses PostgreSQL via `DATABASE_URL`. Phase 1 creates tables automatically only in development. A later migration phase will add Alembic and the remaining normalized entities for eligibility rules, verification logs, deadlines, documents, applications, notifications and audit history.

No student document content is stored in this phase. Account registration and password handling are not enabled; the nullable `password_hash` column is a schema placeholder only and has no API write path.
