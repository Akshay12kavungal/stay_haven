#!/bin/sh
set -e

python manage.py migrate --noinput

# Optionally create an admin account on first start.
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py createsuperuser --noinput \
    --username "$DJANGO_SUPERUSER_USERNAME" \
    --email "${DJANGO_SUPERUSER_EMAIL:-admin@example.com}" 2>/dev/null \
    && echo "Created superuser $DJANGO_SUPERUSER_USERNAME" \
    || echo "Superuser $DJANGO_SUPERUSER_USERNAME already exists"
fi

exec "$@"
