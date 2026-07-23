# План деплоя под REG.RU / ispmanager

## Цель

Мы дошли до этапа, где нужно готовиться уже не абстрактно к production, а к конкретному хостингу:

```text
REG.RU виртуальный хостинг
ispmanager
Python / Django
Passenger через passenger_wsgi.py
MySQL
```

На этом шаге мы не заливаем проект на сервер.

Мы фиксируем план деплоя именно под схему REG.RU / ispmanager.

---

## Что важно из документации REG.RU

REG.RU описывает Django-деплой так:

```text
1. домен должен быть привязан к хостингу
2. Django доступен через ispmanager
3. в настройках сайта нужно включить CGI-скрипты и Python
4. нужно выбрать версию Python
5. по SSH создать virtualenv
6. установить зависимости
7. настроить MySQL
8. выполнить collectstatic
9. выполнить migrate
10. создать passenger_wsgi.py
11. перезапускать проект через .restart-app
```

---

# 1. Общая схема нашего проекта на сервере

Локально проект выглядит так:

```text
city-map/
├── backend/
├── frontend/
├── docs/
├── .gitignore
└── README.md
```

На сервере логично сохранить похожую структуру:

```text
/var/www/uXXXXXX/data/www/example.com/
├── backend/
│   ├── config/
│   ├── accounts/
│   ├── places/
│   ├── feedback/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── media/
│   └── staticfiles/
├── frontend/
│   └── dist/
│       ├── index.html
│       └── assets/
├── passenger_wsgi.py
└── .restart-app
```

Где:

```text
example.com заменяем на твой домен
uXXXXXX заменяем на логин услуги хостинга
```

---

## Почему `passenger_wsgi.py` в корне сайта

REG.RU в инструкции создаёт:

```text
passenger_wsgi.py
```

в корневом каталоге сайта.

То есть рядом с нашими папками:

```text
backend/
frontend/
passenger_wsgi.py
```

---

# 2. Что будет делать Django

Django будет отвечать за:

```text
/api/...
/admin/
/media/... через web-server/hosting
/static/... через web-server/hosting
React SPA fallback для frontend routes
```

Наш Django fallback уже умеет отдавать:

```text
frontend/dist/index.html
```

для frontend routes:

```text
/
/login
/register
/add-place
/my-places
/places/:id/edit
```

---

# 3. Что будет делать frontend

Frontend мы будем собирать локально:

```bash
cd frontend
npm run build
```

После этого появится:

```text
frontend/dist/
```

На сервер нужно будет загрузить именно собранный frontend:

```text
frontend/dist/index.html
frontend/dist/assets/
```

---

## Почему не нужно запускать Vite на хостинге

Vite dev-server нужен только для разработки:

```bash
npm run dev
```

На production-хостинге он не нужен.

Production frontend — это обычные статические файлы:

```text
index.html
assets/*.js
assets/*.css
```

---

# 4. Что нужно подготовить в `.env` на сервере

На сервере будет файл:

```text
backend/.env
```

Пример:

```env
DJANGO_SECRET_KEY=real-production-secret
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=example.com,www.example.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://example.com,https://www.example.com

DJANGO_DATABASE_ENGINE=mysql
DJANGO_DATABASE_NAME=real_database_name
DJANGO_DATABASE_USER=real_database_user
DJANGO_DATABASE_PASSWORD=real_database_password
DJANGO_DATABASE_HOST=localhost
DJANGO_DATABASE_PORT=3306

DJANGO_SESSION_COOKIE_SECURE=True
DJANGO_CSRF_COOKIE_SECURE=True
DJANGO_SECURE_SSL_REDIRECT=True
DJANGO_SECURE_HSTS_SECONDS=0
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=False
DJANGO_SECURE_HSTS_PRELOAD=False

DJANGO_EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DJANGO_DEFAULT_FROM_EMAIL="City Map <noreply@example.com>"
DJANGO_FEEDBACK_RECIPIENT_EMAIL=admin@example.com
DJANGO_FEEDBACK_THROTTLE_RATE=5/hour

DJANGO_EMAIL_HOST=
DJANGO_EMAIL_PORT=587
DJANGO_EMAIL_USE_TLS=True
DJANGO_EMAIL_HOST_USER=
DJANGO_EMAIL_HOST_PASSWORD=
```

---

## Почему HSTS пока 0

На первом деплое лучше оставить:

```env
DJANGO_SECURE_HSTS_SECONDS=0
```

HSTS включают только после того, как HTTPS точно работает стабильно.

Если включить HSTS слишком рано и ошибиться с HTTPS, браузер может долго принудительно открывать сайт только по HTTPS.

---

# 5. MySQL

Для production на REG.RU нам понадобится MySQL.

Мы уже подготовили в `settings.py` режим:

```env
DJANGO_DATABASE_ENGINE=mysql
```

Но пока не добавляли в requirements:

```text
mysqlclient
```

На этапе реального деплоя нужно будет проверить, устанавливается ли `mysqlclient` на хостинге.

Вероятная команда:

```bash
CFLAGS="-std=c99" pip install mysqlclient
```

Если установка пройдёт успешно, потом добавим `mysqlclient` в:

```text
backend/requirements.txt
```

---

# 6. `passenger_wsgi.py`

Нам нужно будет создать файл:

```text
passenger_wsgi.py
```

в корне сайта на сервере.

Шаблон для нашего проекта:

```python
# -*- coding: utf-8 -*-
import os
import sys

PROJECT_ROOT = "/var/www/uXXXXXX/data/www/example.com"
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")

sys.path.insert(0, BACKEND_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
```

---

## Что заменить

```python
PROJECT_ROOT = "/var/www/uXXXXXX/data/www/example.com"
```

Заменить на реальный путь к сайту на хостинге.

Примерный путь можно узнать в ispmanager или через SSH командой:

```bash
pwd
```

в корневом каталоге сайта.

---

## Почему `BACKEND_DIR`

У нас `manage.py` и папка `config/` лежат не в корне сайта, а внутри:

```text
backend/
```

Поэтому Python должен видеть именно:

```text
.../example.com/backend
```

Иначе импорт:

```python
config.settings
```

не найдётся.

---

# 7. Команды на сервере

Примерная последовательность после загрузки файлов:

```bash
cd /var/www/uXXXXXX/data/www/example.com/backend

python -m venv .venv
source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
```

Если используем MySQL:

```bash
CFLAGS="-std=c99" pip install mysqlclient
```

Потом:

```bash
python manage.py check
python manage.py migrate
python manage.py collectstatic --noinput
```

---

# 8. Перезапуск приложения

После изменения Python-кода или настроек нужно перезапустить Passenger-приложение.

Для этого в корне сайта создаётся файл:

```bash
touch .restart-app
```

Пример:

```bash
cd /var/www/uXXXXXX/data/www/example.com
touch .restart-app
```

---

# 9. Что ещё нужно решить позже

## Static files

Django static:

```text
/static/...
```

должен смотреть в:

```text
backend/staticfiles/
```

## Media files

User uploads:

```text
/media/...
```

должен смотреть в:

```text
backend/media/
```

## Frontend assets

Vite assets:

```text
/assets/...
```

должны смотреть в:

```text
frontend/dist/assets/
```

Эти маршруты желательно настроить на уровне web-server/hosting, чтобы Django не отдавал большие static/assets/media файлы сам.

---

# 10. Предварительный checklist перед реальным деплоем

Перед тем как реально заливать проект, нужно знать:

```text
домен
логин хостинга uXXXXXX
реальный путь к корню сайта
доступна ли нужная версия Python
есть ли SSH-доступ
есть ли MySQL-база
имя базы
пользователь базы
пароль базы
как в ispmanager настроить static/media/assets
```

---

# 11. Создать документацию

Создай файл:

```text
docs/reg-ru-deployment-plan.md
```

Содержимое можно взять из этого конспекта.

---

# 12. README.md

Добавь в заметки:

```markdown
- [План деплоя REG.RU / ispmanager](docs/reg-ru-deployment-plan.md)
```

---

# 13. Коммит

```bash
git status
git add docs/reg-ru-deployment-plan.md README.md
git commit -m "docs: add reg ru deployment plan"
```

---

## Итог

В этом шаге мы:

```text
изучили production-схему REG.RU / ispmanager
зафиксировали структуру проекта на сервере
подготовили шаблон passenger_wsgi.py
описали server .env
описали команды установки backend
зафиксировали отдельные вопросы по static/media/assets
подготовились к реальному деплою
```

Следующий шаг:

```text
добавить passenger_wsgi.py.example в проект
```