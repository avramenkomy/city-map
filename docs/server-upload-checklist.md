Далее — **список файлов и папок для загрузки на сервер**.

По актуальной инструкции REG.RU для Django используется `passenger_wsgi.py` в корневой директории сайта, миграции выполняются через `manage.py migrate`, статика собирается через `collectstatic`, а перезапуск делается созданием `.restart-app` в корне сайта. ([Help Рег.][1])

---

# Server upload checklist

## 1. Создай ветку

```bash
git status
git switch -c docs/server-upload-checklist
```

---

## 2. Создай файл

```text
docs/server-upload-checklist.md
```

```bash
mkdir -p docs
touch docs/server-upload-checklist.md
```

---

## 3. Общая структура на сервере

Примерно так:

```text
/var/www/uXXXXXX/data/www/example.com/
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
├── frontend/
│   └── dist/
│       ├── index.html
│       └── assets/
├── passenger_wsgi.py
└── .restart-app
```

`passenger_wsgi.py` должен лежать в корне сайта, а `.restart-app` создаётся там же только для перезапуска приложения. ([Help Рег.][1])

---

## 4. Backend: что загружать

Нужно загрузить:

```text
backend/accounts/
backend/config/
backend/feedback/
backend/places/
backend/manage.py
backend/requirements.txt
backend/.env.reg-ru.example
```

Можно загрузить:

```text
backend/.env.example
```

Но настоящий серверный файл должен быть создан отдельно:

```text
backend/.env
```

---

## 5. Backend: что НЕ загружать

Не загружаем:

```text
backend/.venv/
backend/.venv-check/
backend/__pycache__/
backend/db.sqlite3
backend/media/ старые локальные файлы
backend/staticfiles/ старую локальную сборку
backend/.env
backend/.env.production.local
```

`.venv` создаётся заново на сервере, потому что REG.RU-инструкция предполагает создание virtualenv на хостинге под выбранную версию Python. ([Help Рег.][1])

---

## 6. Frontend: что загружать

Перед загрузкой локально:

```bash
cd frontend
npm run build
```

Загрузить на сервер:

```text
frontend/dist/
```

То есть:

```text
frontend/dist/index.html
frontend/dist/assets/
```

---

## 7. Frontend: что НЕ загружать

Не нужно загружать:

```text
frontend/node_modules/
frontend/.vite/
```

Если загружаешь production-набор вручную, можно не загружать:

```text
frontend/src/
frontend/package.json
frontend/package-lock.json
```

Для работы сайта нужен именно готовый build:

```text
frontend/dist/
```

---

## 8. Root-файлы

В корне сайта нужен:

```text
passenger_wsgi.py
```

Но в git у нас лежит шаблон:

```text
passenger_wsgi.py.example
```

На сервере:

```bash
cp passenger_wsgi.py.example passenger_wsgi.py
```

Потом заменить путь:

```python
PROJECT_ROOT = "/var/www/uXXXXXX/data/www/example.com"
```

на реальный путь.

---

## 9. `.restart-app`

Заранее загружать не нужно.

После изменений на сервере:

```bash
touch .restart-app
```

REG.RU указывает, что после перезапуска этот файл удаляется автоматически. ([Help Рег.][1])

---

## 10. Минимальный upload checklist

На сервер загрузить:

```text
backend/accounts/
backend/config/
backend/feedback/
backend/places/
backend/manage.py
backend/requirements.txt
backend/.env.reg-ru.example

frontend/dist/

passenger_wsgi.py.example
```

На сервере создать вручную:

```text
backend/.env
passenger_wsgi.py
backend/.venv/
backend/staticfiles/
backend/media/
```

---

## 11. README.md

Добавь:

```markdown
- [Список файлов для загрузки на сервер](docs/server-upload-checklist.md)
```

---

## 12. Коммит

```bash
git status
git add docs/server-upload-checklist.md README.md
git commit -m "docs: add server upload checklist"
```

---

Подробный конспект:

[Скачать step-82-server-upload-checklist.md](sandbox:/mnt/data/step-82-server-upload-checklist.md)

[1]: https://help.reg.ru/support/hosting/php-asp-net-i-skripty/kak-ustanovit-django-na-hosting?utm_source=chatgpt.com "Как установить Django на хостинг | Рег.ру"
