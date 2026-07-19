# Структура деплоя

## Общая идея

Проект состоит из двух основных частей:

```text
backend  → Django / DRF API
frontend → React / Vite static build
```

В development-режиме они запускаются отдельно:

```text
frontend: http://localhost:5173
backend:  http://127.0.0.1:8000
```

В production frontend должен обращаться к backend через относительные URL:

```text
/api/...
/media/...
```

Поэтому желательно, чтобы сайт работал под одним доменом:

```text
https://example.com
https://example.com/api/...
https://example.com/media/...
```

---

## Возможная структура на сервере

```text
site-root/
├── backend/
│   ├── accounts/
│   ├── config/
│   ├── feedback/
│   ├── places/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── staticfiles/
│   └── media/
│
├── frontend-dist/
│   ├── index.html
│   └── assets/
│
└── logs/
```

---

## Что хранится в git

В git хранится:

```text
backend source code
frontend source code
requirements.txt
package.json
package-lock.json
.env.example
docs
README.md
```

В git не хранится:

```text
backend/.env
backend/.venv/
backend/db.sqlite3
backend/media/
backend/staticfiles/
frontend/node_modules/
frontend/dist/
```

---

## URL-схема production

Желаемая схема:

```text
https://example.com/             → frontend index.html
https://example.com/assets/...   → frontend assets
https://example.com/api/...      → Django API
https://example.com/admin/       → Django admin
https://example.com/static/...   → Django staticfiles
https://example.com/media/...    → Django media uploads
```

---

## Важное про SPA routes

React Router использует frontend routes:

```text
/login
/register
/add-place
/my-places
/places/:id/edit
```

В production сервер должен уметь отдавать `index.html` для frontend routes.

Иначе при прямом открытии:

```text
https://example.com/add-place
```

сервер может вернуть 404.

Это нужно будет учесть на этапе настройки хостинга.

---

## Что нужно проверить после деплоя

```text
главная страница открывается
/login открывается напрямую
/register открывается напрямую
/add-place открывается напрямую
/api/health/ отвечает
/admin/ открывается
/static/admin/... отдаёт файлы
/media/... отдаёт загруженные изображения
регистрация работает
login/logout работает
добавление места работает
загрузка изображения работает
feedback работает
```

## Frontend assets

Vite production build хранит JS/CSS в:

```text
frontend/dist/assets/
```

В production эти файлы должны быть доступны как:

```text
/assets/...
```

SPA fallback не должен перехватывать `/assets/...`.