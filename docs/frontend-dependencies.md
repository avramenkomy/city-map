# Frontend dependencies

## Основные файлы

Frontend-зависимости описаны в:

```text
frontend/package.json
frontend/package-lock.json
```

`package.json` хранит список зависимостей и scripts.

`package-lock.json` фиксирует точные версии установленных пакетов.

---

## Установка во время разработки

```bash
cd frontend
npm install
```

---

## Чистая установка перед деплоем

```bash
cd frontend
rm -rf node_modules
npm ci
```

`npm ci` устанавливает зависимости строго по `package-lock.json`.

---

## Проверки

```bash
npm test
npm run lint
npm run build
```

---

## Preview production build

```bash
npm run preview
```

---

## Важно

Папка:

```text
frontend/dist/
```

создаётся командой:

```bash
npm run build
```

и не коммитится в git.

---

## API URLs

Frontend должен использовать относительные API URLs:

```text
/api/...
/media/...
```

Не нужно хардкодить:

```text
http://127.0.0.1:8000
http://localhost:8000
```

Проверка:

```bash
grep -R "127.0.0.1\|localhost:8000\|http://localhost" src
```