# Команды первого запуска на сервере

## 1. Подключиться по SSH

```bash
ssh uXXXXXX@server-host
```

Где:

```text
uXXXXXX      — логин хостинга
server-host  — SSH-хост из панели REG.RU
```

---

## 2. Перейти в корень сайта

```bash
cd /var/www/uXXXXXX/data/www/example.com
pwd
ls -la
```

Ожидаемо должны быть:

```text
backend/
frontend/
passenger_wsgi.py.example
```

---

## 3. Создать server `.env`

```bash
cd backend
cp .env.reg-ru.example .env
nano .env
```

Заменить placeholders:

```text
example.com
www.example.com
change-me-to-a-long-random-secret
your_database_name
your_database_user
your_database_password
```

---

## 4. Создать virtualenv

```bash
python -m venv .venv
source .venv/bin/activate
which python
python --version
```

Если `python` не подходит:

```bash
python3 -m venv .venv
```

---

## 5. Установить зависимости

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 6. Установить MySQL driver

```bash
pip install mysqlclient
```

Если будет ошибка сборки, попробовать:

```bash
CFLAGS="-std=c99" pip install mysqlclient
```

REG.RU в своей Django-инструкции показывает установку `mysqlclient`, в том числе с `CFLAGS="-std=c99"`. :contentReference[oaicite:1]{index=1}

---

## 7. Проверить Django

```bash
python manage.py check
```

Ожидаемо:

```text
System check identified no issues
```

---

## 8. Выполнить миграции

```bash
python manage.py migrate
```

---

## 9. Собрать staticfiles

```bash
python manage.py collectstatic --noinput
```

После этого появится или обновится:

```text
backend/staticfiles/
```

---

## 10. Создать superuser

```bash
python manage.py createsuperuser
```

---

## 11. Настроить `passenger_wsgi.py`

Вернуться в корень сайта:

```bash
cd ..
cp passenger_wsgi.py.example passenger_wsgi.py
nano passenger_wsgi.py
```

Заменить:

```python
PROJECT_ROOT = "/var/www/uXXXXXX/data/www/example.com"
```

на реальный путь, который показывает:

```bash
pwd
```

REG.RU указывает, что `passenger_wsgi.py` создаётся в корневом каталоге сайта, а путь в `sys.path.insert(...)` нужно заменить на путь своего проекта. :contentReference[oaicite:2]{index=2}

---

## 12. Перезапустить приложение

В корне сайта:

```bash
touch .restart-app
```

REG.RU указывает, что `.restart-app` создаётся в корневой директории сайта для перезапуска Django-приложения. :contentReference[oaicite:3]{index=3}

---

## 13. Проверить сайт

Открыть:

```text
https://example.com/
https://example.com/api/health/
https://example.com/admin/
```

Ожидаемо:

```text
главная React-страница открывается
/api/health/ возвращает JSON
/admin/ открывает Django admin
```

---

## Короткая версия команд

```bash
ssh uXXXXXX@server-host
cd /var/www/uXXXXXX/data/www/example.com

cd backend
cp .env.reg-ru.example .env
nano .env

python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install mysqlclient

python manage.py check
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser

cd ..
cp passenger_wsgi.py.example passenger_wsgi.py
nano passenger_wsgi.py
touch .restart-app
```

---

## Если сайт отдаёт 500

Проверить:

```text
passenger_wsgi.py
backend/.env
virtualenv
requirements
mysqlclient
database credentials
migrations
```

---

## Если React открывается, но нет CSS/JS

Проверить:

```text
frontend/dist/assets/
```

И открыть напрямую:

```text
https://example.com/assets/index-xxxxx.js
https://example.com/assets/index-xxxxx.css
```

Если вместо CSS/JS приходит HTML, значит web-server или fallback неправильно обрабатывает `/assets/...`.

---

## Если POST-запросы дают CSRF error

Проверить:

```env
DJANGO_CSRF_TRUSTED_ORIGINS=https://example.com,https://www.example.com
DJANGO_CSRF_COOKIE_SECURE=True
```

И убедиться, что сайт открыт именно по HTTPS.