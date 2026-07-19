# Frontend assets в production

## Что создаёт Vite

Команда:

```bash
cd frontend
npm run build
```

создаёт папку:

```text
frontend/dist/
```

Пример структуры:

```text
frontend/dist/
├── index.html
└── assets/
    ├── index-xxxxx.js
    └── index-xxxxx.css
```

---

## Какие URL ожидает браузер

Внутри `index.html` Vite подключает assets примерно так:

```html
<script type="module" src="/assets/index-xxxxx.js"></script>
<link rel="stylesheet" href="/assets/index-xxxxx.css">
```

Поэтому браузер будет запрашивать:

```text
/assets/index-xxxxx.js
/assets/index-xxxxx.css
```

---

## Production URL-схема

Желаемая схема:

```text
https://example.com/             → React index.html
https://example.com/assets/...   → Vite assets
https://example.com/api/...      → Django API
https://example.com/admin/       → Django admin
https://example.com/static/...   → Django staticfiles
https://example.com/media/...    → user uploads
```

---

## Что должен делать web-server

Web-server или hosting должен отдавать:

```text
/             → frontend-dist/index.html
/assets/...   → frontend-dist/assets/...
/api/...      → Django backend
/admin/...    → Django backend
/static/...   → backend/staticfiles/...
/media/...    → backend/media/...
```

---

## SPA fallback

Для React Router routes:

```text
/login
/register
/add-place
/my-places
/places/:id/edit
```

нужно возвращать:

```text
frontend-dist/index.html
```

Но fallback не должен перехватывать:

```text
/api/...
/admin/...
/assets/...
/static/...
/media/...
```

---

## Частая ошибка

Ошибка:

```text
Refused to apply style because its MIME type ('text/html') is not a supported stylesheet MIME type
```

означает:

```text
браузер просил CSS
сервер вернул HTML
```

Чаще всего это значит, что SPA fallback слишком широкий и перехватывает `/assets/...`.