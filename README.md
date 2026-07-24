# City Map — городская карта мест

**City Map** — учебно-практический fullstack-проект: интерактивная карта городских мест с backend на Django REST Framework и frontend на React.

Проект развёрнут на REG.RU shared-хостинге и доступен по домену:

```text
http://pet-city-map.ru
```

Проект создаётся как портфолио-работа frontend-разработчика с демонстрацией backend, базы данных, API, деплоя и production-настроек.

---

## 1. Текущий статус


На текущем этапе:

- проект опубликован на REG.RU;
- backend запускается через Passenger;
- используется Python 3.10;
- используется Django 5.2.x;
- база данных переведена на MySQL 8;
- вместо `mysqlclient` используется `PyMySQL[rsa]`;
- frontend собран через Vite;
- Django static отдаётся через `/static/`;
- frontend assets отдаются через `/assets/`;
- форма обратной связи сохраняет сообщение и отправляет письмо через Яндекс.Почту;
- Django admin доступен;
- production `.env` настроен на сервере.

---

## 2. Стек

### Frontend

```text
React
Vite
JavaScript
SCSS
MobX
MapLibre
i18next
```

### Backend

```text
Python 3.10
Django 5.2.x
Django REST Framework
PyMySQL
Pillow
python-dotenv
```

### Database

```text
MySQL 8
```

### Production

```text
REG.RU shared hosting
Passenger
Yandex SMTP
```

---

## 3. Почему production-связка именно такая

На REG.RU shared-хостинге были выявлены ограничения:

1. SQLite не подходит, потому что системная версия SQLite на сервере слишком старая для современной версии Django.
2. MySQL 5.7 не подходит, потому что Django требует MySQL 8.0.11+.
3. `mysqlclient` не подходит, потому что на shared-хостинге нет dev-заголовков Python для сборки пакета.
4. Python 3.12 не используем для текущей конфигурации, потому что Passenger и `.venv` должны работать на одной версии Python.
5. Django 6 не используем, потому что рабочая production-связка закреплена на Python 3.10 + Django 5.2 LTS.

Итоговая рабочая связка:

```text
Python 3.10
Django 5.2.x
DRF 3.17.1
MySQL 8
PyMySQL[rsa]
Passenger
```

---

## 4. Структура проекта

Ожидаемая локальная структура:

```text
city-map/
├── backend/
│   ├── accounts/
│   ├── config/
│   ├── feedback/
│   ├── places/
│   ├── manage.py
│   ├── requirements.txt
│   ├── requirements.regru.txt
│   ├── .env.example
│   └── .env.reg-ru.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
├── passenger_wsgi.py.example
├── README.md
└── .gitignore
```

Структура на сервере REG.RU:

```text
/var/www/u1651207/data/www/pet-city-map.ru
├── assets -> frontend/dist/assets
├── backend/
├── frontend/
├── media/
├── passenger_wsgi.py
├── passenger_wsgi.py.example
├── README.md
└── static -> backend/staticfiles
```

---

## 5. Локальный запуск backend

Перейти в backend:

```bash
cd backend
```

Создать виртуальное окружение:

```bash
python3 -m venv .venv
```

Активировать:

```bash
source .venv/bin/activate
```

Установить зависимости:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Создать `.env`:

```bash
cp .env.example .env
```

Применить миграции:

```bash
python manage.py migrate
```

Запустить backend:

```bash
python manage.py runserver
```

Проверить:

```text
http://127.0.0.1:8000/api/health/
```

---

## 6. Локальный запуск frontend

Перейти во frontend:

```bash
cd frontend
```

Установить зависимости:

```bash
npm install
```

или:

```bash
pnpm install
```

Запустить frontend:

```bash
npm run dev
```

или:

```bash
pnpm dev
```

---

## 7. Production dependencies для REG.RU

Для REG.RU используется отдельный файл:

```text
backend/requirements.regru.txt
```

Рабочий вариант:

```text
djangorestframework==3.17.1
pillow==12.3.0
python-dotenv==1.2.2
sqlparse==0.5.5
Django>=5.2,<6.0
PyMySQL[rsa]
```

В `backend/config/__init__.py` должен быть PyMySQL:

```python
import pymysql

pymysql.install_as_MySQLdb()
```

---

## 8. Production `.env` для REG.RU

На сервере файл находится здесь:

```text
/var/www/u1651207/data/www/pet-city-map.ru/backend/.env
```

Пример:

```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=pet-city-map.ru,www.pet-city-map.ru,31.31.196.4

DJANGO_DATABASE_ENGINE=mysql
DJANGO_DATABASE_NAME=u1651207_petcity
DJANGO_DATABASE_USER=u1651207_petcity
DJANGO_DATABASE_PASSWORD=your-db-password
DJANGO_DATABASE_HOST=localhost
DJANGO_DATABASE_PORT=3306

DJANGO_EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
DJANGO_EMAIL_HOST=smtp.yandex.ru
DJANGO_EMAIL_PORT=465
DJANGO_EMAIL_USE_SSL=True
DJANGO_EMAIL_USE_TLS=False
DJANGO_EMAIL_HOST_USER=avramenkomy
DJANGO_EMAIL_HOST_PASSWORD=your-yandex-app-password
DJANGO_DEFAULT_FROM_EMAIL=City Map <avramenkomy@yandex.ru>
DJANGO_FEEDBACK_RECIPIENT_EMAIL=avramenkomy@yandex.ru
```

Важно:

- `.env` не должен попадать в Git;
- пароль базы данных не публикуется;
- пароль приложения Яндекс не публикуется;
- для Яндекса используется пароль приложения, а не обычный пароль от аккаунта.

---

## 9. Passenger

Файл на сервере:

```text
/var/www/u1651207/data/www/pet-city-map.ru/passenger_wsgi.py
```

Рабочий пример:

```python
import os
import sys
import site
import glob

PROJECT_ROOT = "/var/www/u1651207/data/www/pet-city-map.ru/backend"
VENV_ROOT = "/var/www/u1651207/data/www/pet-city-map.ru/backend/.venv"

PYTHON_VERSION = f"python{sys.version_info.major}.{sys.version_info.minor}"

for site_packages in glob.glob(os.path.join(VENV_ROOT, "lib*", PYTHON_VERSION, "site-packages")):
    site.addsitedir(site_packages)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

os.chdir(PROJECT_ROOT)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
```

Перезапуск Passenger:

```bash
cd /var/www/u1651207/data/www/pet-city-map.ru
touch .restart-app
```

---

## 10. Static и assets на REG.RU

Сбор Django static:

```bash
cd /var/www/u1651207/data/www/pet-city-map.ru/backend
source .venv/bin/activate
python manage.py collectstatic --noinput
```

На сервере используется symlink:

```text
/static/ -> backend/staticfiles
/assets/ -> frontend/dist/assets
```

Создание:

```bash
cd /var/www/u1651207/data/www/pet-city-map.ru

ln -s backend/staticfiles static
ln -s frontend/dist/assets assets
```

Проверка:

```bash
curl -I http://pet-city-map.ru/static/admin/css/base.css

FIRST_JS=$(ls frontend/dist/assets/*.js 2>/dev/null | head -n 1 | xargs -n 1 basename)
curl -I http://pet-city-map.ru/assets/$FIRST_JS
```

---

## 11. Email / SMTP

Для формы обратной связи используется Яндекс SMTP.

Рабочие настройки:

```env
DJANGO_EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
DJANGO_EMAIL_HOST=smtp.yandex.ru
DJANGO_EMAIL_PORT=465
DJANGO_EMAIL_USE_SSL=True
DJANGO_EMAIL_USE_TLS=False
DJANGO_EMAIL_HOST_USER=avramenkomy
DJANGO_DEFAULT_FROM_EMAIL=City Map <avramenkomy@yandex.ru>
DJANGO_FEEDBACK_RECIPIENT_EMAIL=avramenkomy@yandex.ru
```

Тест отправки:

```bash
cd /var/www/u1651207/data/www/pet-city-map.ru/backend
source .venv/bin/activate

python manage.py shell -c "from django.core.mail import send_mail; from django.conf import settings; result = send_mail('Тест с pet-city-map.ru', 'Если письмо пришло, SMTP Яндекс работает.', settings.DEFAULT_FROM_EMAIL, [settings.FEEDBACK_RECIPIENT_EMAIL], fail_silently=False); print('sent=', result)"
```

Ожидаемый результат:

```text
sent= 1
```

---

## 12. Production-проверки

Backend:

```bash
cd /var/www/u1651207/data/www/pet-city-map.ru/backend
source .venv/bin/activate

python manage.py check
python manage.py migrate --check
```

API:

```bash
curl -i http://pet-city-map.ru/api/health/
```

Admin:

```bash
curl -I http://pet-city-map.ru/admin/
```

Static:

```bash
curl -I http://pet-city-map.ru/static/admin/css/base.css
```

Frontend assets:

```bash
cd /var/www/u1651207/data/www/pet-city-map.ru

FIRST_JS=$(ls frontend/dist/assets/*.js 2>/dev/null | head -n 1 | xargs -n 1 basename)
curl -I http://pet-city-map.ru/assets/$FIRST_JS
```

## 13. Заметки проекта

- [TODO проекта](docs/todo.md)
- [Чеклист перед деплоем](docs/pre-deploy-checklist.md)
- [Frontend production build](docs/frontend-production-build.md)
- [Структура деплоя](docs/deployment-structure.md)
- [Frontend assets в production](docs/frontend-assets-production.md)
- [Production-like Django check](docs/production-like-check.md)
- [Database settings](docs/database-settings.md)
- [Backend requirements](docs/backend-requirements.md)
- [Frontend dependencies](docs/frontend-dependencies.md)
- [Финальный pre-deploy прогон](docs/final-pre-deploy-run.md)
- [План деплоя REG.RU / ispmanager](docs/reg-ru-deployment-plan.md)
- [Passenger WSGI](docs/passenger-wsgi.md)
- [REG.RU server env](docs/reg-ru-env.md)
- [Список файлов для загрузки на сервер](docs/server-upload-checklist.md)
- [Команды первого запуска на сервере](docs/server-first-run-commands.md)

---

# План доработок

## Этап 1. Синхронизация сервера и локального проекта

Цель: перенести все исправления, сделанные на REG.RU, обратно в локальный проект.

Нужно перенести и зафиксировать:

- `backend/config/settings.py`;
- `backend/config/urls.py`;
- `backend/config/__init__.py`;
- `backend/requirements.regru.txt`;
- `backend/.env.reg-ru.example`;
- `passenger_wsgi.py.example`;
- `README.md`;
- изменения в feedback/email-настройках;
- исправление `DEFAULT_FROM_EMAIL`;
- настройки `static`, `media`, `FRONTEND_DIST_DIR`;
- production-проверки.

После переноса:

```bash
git status
git add .
git commit -m "chore: sync REG.RU production deployment settings"
```

---

## Этап 2. HTTPS и production security

Цель: перевести проект на HTTPS и включить безопасные Django-настройки.

План:

- подключить SSL-сертификат в REG.RU;
- проверить `https://pet-city-map.ru`;
- добавить `CSRF_TRUSTED_ORIGINS`;
- включить secure cookies;
- после проверки включить редирект HTTP → HTTPS.

После HTTPS:

```python
CSRF_TRUSTED_ORIGINS = [
    "https://pet-city-map.ru",
    "https://www.pet-city-map.ru",
]

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

---

## Этап 3. Backup

Цель: защитить проект от потери данных.

Нужно настроить backup:

- MySQL-базы;
- папки `media/`;
- production `.env`;
- исходников backend/frontend;
- финального `passenger_wsgi.py`.

---

## Этап 4. Улучшение feedback

Цель: сделать форму обратной связи устойчивой.

План:

- логировать ошибки отправки email;
- не ронять API, если письмо не отправилось;
- добавить honeypot-поле от спама;
- ограничить длину сообщения;
- улучшить текст письма;
- добавить тесты на отправку feedback.

---

## Этап 5. Улучшение Django admin

Цель: сделать админку удобной для управления проектом.

План:

- настроить `list_display`;
- добавить `search_fields`;
- добавить `list_filter`;
- сделать важные поля readonly;
- настроить отображение мест, категорий и сообщений feedback.

---

## Этап 6. Основной функционал карты

Цель: развить проект как полноценное портфолио-приложение.

План:

- добавить места на карту;
- настроить категории;
- реализовать фильтрацию;
- реализовать поиск;
- добавить карточку места;
- подключить изображения;
- улучшить MapLibre-интерфейс;
- добавить модерацию мест.

---

## Этап 7. Авторизация и роли

Цель: показать полноценную backend/frontend-архитектуру.

План:

- авторизация пользователей;
- роли `admin`, `moderator`, `user`;
- личный кабинет;
- предложения новых мест пользователями;
- модерация пользовательских предложений.

---

## Ближайший рабочий план

Текущий приоритет:

```text
1. Перенести серверные изменения в локальную версию.
2. Обновить README.md.
3. Проверить локальный backend.
4. Проверить локальный frontend.
5. Зафиксировать изменения в Git.
6. После этого перейти к HTTPS.
```

---

## Команды после переноса в локальный проект

```bash
cd path/to/local/city-map

git status
```

Проверить backend:

```bash
cd backend
source .venv/bin/activate
python manage.py check
```

Проверить frontend:

```bash
cd ../frontend
npm install
npm run build
```

После проверки:

```bash
git add .
git commit -m "chore: sync production deployment configuration"
```

---

## Важные замечания

- Не хранить `.env` в Git.
- Не публиковать пароли базы данных.
- Не публиковать пароли приложений Яндекс.
- Не менять глобальные настройки REG.RU без проверки других сайтов на этом хостинге.
- Перед изменениями MySQL/Python на хостинге делать backup.
- Для production на REG.RU использовать Python 3.10 и Django 5.2.x.
