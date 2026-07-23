# REG.RU server env

## Основная идея

На сервере должен быть реальный файл:

```text
backend/.env
```

Он не коммитится.

В git хранится только шаблон:

```text
backend/.env.reg-ru.example
```

---

## Как использовать на сервере

В папке backend:

```bash
cp .env.reg-ru.example .env
nano .env
```

Заменить placeholders:

```text
example.com
change-me-to-a-long-random-secret
your_database_name
your_database_user
your_database_password
```

на реальные значения.

---

## Важные production-настройки

```env
DJANGO_DEBUG=False
DJANGO_DATABASE_ENGINE=mysql
DJANGO_SESSION_COOKIE_SECURE=True
DJANGO_CSRF_COOKIE_SECURE=True
DJANGO_SECURE_SSL_REDIRECT=True
```

---

## HSTS

Для первого деплоя оставить:

```env
DJANGO_SECURE_HSTS_SECONDS=0
```

HSTS включается позже, когда HTTPS точно работает стабильно.

---

## SMTP

На первом деплое можно оставить:

```env
DJANGO_EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

SMTP будет настроен отдельным шагом.