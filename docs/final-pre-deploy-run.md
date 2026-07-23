# Финальный локальный pre-deploy прогон

## Цель

Перед деплоем нужно убедиться, что проект локально проходит все основные проверки:

```text
backend check
backend tests
migrations check
collectstatic dry-run
frontend tests
frontend lint
frontend build
git status
```

---

## Backend

```bash
cd backend
source .venv/bin/activate
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
python manage.py collectstatic --dry-run --noinput
```

Ожидаемо:

```text
System check identified no issues
No changes detected
OK
collectstatic dry-run проходит без ошибок
```

---

## Frontend

```bash
cd ../frontend
npm test
npm run lint
npm run build
```

Ожидаемо:

```text
tests проходят
lint без ошибок
build проходит
frontend/dist/ создан
```

---

## Проверка Django + React build вместе

После `npm run build` можно проверить React build через Django.

В одном терминале:

```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

Открыть:

```text
http://127.0.0.1:8000/
http://127.0.0.1:8000/login
http://127.0.0.1:8000/register
http://127.0.0.1:8000/add-place
```

Проверить в DevTools → Network:

```text
/assets/index-xxxxx.js  → 200
/assets/index-xxxxx.css → 200
/api/health/            → JSON
```

---

## Проверка hardcoded localhost

Из папки frontend:

```bash
grep -R "127.0.0.1\|localhost:8000\|http://localhost" src
```

Ожидаемо:

```text
ничего не найдено
```

---

## Проверка секретов

Из корня проекта:

```bash
git status
git diff --cached
```

В git не должны попадать:

```text
backend/.env
backend/.env.production.local
backend/db.sqlite3
backend/media/
backend/staticfiles/
frontend/node_modules/
frontend/dist/
```

---

## Git status

Из корня проекта:

```bash
git status
```

Перед деплоем желательно:

```text
nothing to commit, working tree clean
```

---

## Короткая версия команд

```bash
cd backend
source .venv/bin/activate
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
python manage.py collectstatic --dry-run --noinput

cd ../frontend
npm test
npm run lint
npm run build

cd ..
git status
```

---

## Если что-то падает

Правило:

```text
не идём к деплою, пока локальный pre-deploy прогон не проходит
```

Сначала исправляем ошибку локально, потом повторяем прогон.