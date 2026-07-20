# Production-like Django check

## Цель

Проверить Django локально с:

```env
DJANGO_DEBUG=False
```

до реального деплоя.

---

## Локальный env-файл

Создать файл:

```text
backend/.env.production.local
```

Этот файл не коммитится.

Пример:

```env
DJANGO_SECRET_KEY=test-production-secret-change-me
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
DJANGO_CSRF_TRUSTED_ORIGINS=http://127.0.0.1:8000,http://localhost:8000

DJANGO_SESSION_COOKIE_SECURE=False
DJANGO_CSRF_COOKIE_SECURE=False
DJANGO_SECURE_SSL_REDIRECT=False
DJANGO_SECURE_HSTS_SECONDS=0
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=False
DJANGO_SECURE_HSTS_PRELOAD=False
```

---

## Загрузка env в shell

```bash
cd backend
set -a
source .env.production.local
set +a
```

---

## Проверки

```bash
source .venv/bin/activate
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
python manage.py collectstatic --noinput
python manage.py runserver
```

---

## Что проверять в браузере

```text
http://127.0.0.1:8000/api/health/
http://127.0.0.1:8000/api/categories/
http://127.0.0.1:8000/api/places/
http://127.0.0.1:8000/admin/
```

---

## Важно

При `DEBUG=False` Django локально не отдаёт `/assets/` и `/media/`, потому что эти debug routes отключены.

В production эти URL должен отдавать web-server/hosting.