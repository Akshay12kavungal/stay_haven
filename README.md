# StayHaven

Book hand-picked villas and homestays. Django REST API (`backend/`) + React/MUI frontend built with Vite (`front-end/`).

## Run with Docker (recommended)

```bash
cp .env.example .env          # set DJANGO_SECRET_KEY, DB_PASSWORD, DJANGO_SUPERUSER_PASSWORD
docker compose up -d --build
docker compose exec backend python manage.py seed_demo   # optional sample data
```

- Site: http://localhost:3000 (change with `WEB_PORT`)
- Admin: http://localhost:3000/admin/ or directly at http://localhost:8000/admin/

Services: `db` (Postgres 16), `backend` (Django + gunicorn; runs migrations on start), `web` (nginx serving the
React build and proxying `/api`, `/admin` and Django static files; uploaded media is served from a shared volume).

When deploying to a domain, add it to `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS` and
`DJANGO_CORS_ALLOWED_ORIGINS` in `.env`.

## Local development

Needs Python 3.12, Node 20+ and a Postgres database.

```bash
# backend
cd backend
python3 -m venv venv && venv/bin/pip install -r requirements.txt
cat > .env <<'ENV'
DB_NAME=spotyourstay
DB_USER=spot
DB_PASSWORD=spot
DB_HOST=127.0.0.1
DB_PORT=5432
DB_SSLMODE=disable
ENV
venv/bin/python manage.py migrate
venv/bin/python manage.py createsuperuser
venv/bin/python manage.py seed_demo        # optional; --offline to skip downloading photos
venv/bin/python manage.py runserver

# frontend (new terminal) — Vite proxies /api, /media and /admin to http://127.0.0.1:8000
cd front-end
npm install
npm run dev                                 # http://localhost:3000
npm run lint                                # ESLint
npm run build                               # production build in dist/
```

## Booking flow

1. `POST /api/bookings/` with `property`, `check_in`, `check_out`, `guests` (logged in). The server checks dates,
   guest limit and availability, computes the price, and creates a `pending` booking that holds the dates for 30 minutes.
2. `POST /api/bookings/{id}/pay/` records the advance payment and confirms the booking.
   **No payment gateway is integrated yet**; this endpoint marks the advance as paid.
3. `POST /api/bookings/{id}/cancel/` cancels it.

`GET /api/properties/{id}/availability/` returns booked and blocked date ranges for the calendar.
