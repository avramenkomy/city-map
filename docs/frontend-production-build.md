# Frontend production build

## Dev mode

During development the frontend runs through Vite:

```bash
cd frontend
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

API requests use relative URLs:

```javascript
fetch('/api/places/')
```

In dev mode Vite proxy forwards `/api` and `/media` to Django:

```text
http://127.0.0.1:8000
```

---

## Production build

Production build command:

```bash
cd frontend
npm run build
```

Output directory:

```text
frontend/dist/
```

The `dist/` directory contains static files:

```text
index.html
assets/*.js
assets/*.css
```

This directory is generated and must not be committed to git.

---

## API URLs in production

Vite dev proxy does not exist in production.

The frontend uses relative API URLs:

```javascript
/api/places/
/api/auth/login/
/api/feedback/
```

Therefore, in production the backend must be available on the same domain:

```text
https://example.com/api/...
```

Media files should also be available on the same domain:

```text
https://example.com/media/...
```

---

## Local checks before deployment

```bash
cd frontend
npm run lint
npm test
npm run build
npm run preview
```

Also check that there are no hardcoded local backend URLs:

```bash
grep -R "127.0.0.1\|localhost:8000\|http://localhost" src
```