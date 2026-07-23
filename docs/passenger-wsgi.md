# Passenger WSGI

## Для чего нужен файл

На REG.RU / ispmanager Django-проект запускается через:

```text
passenger_wsgi.py
```

Этот файл должен лежать в корне сайта на сервере.

---

## Почему в git лежит `.example`

В репозитории хранится:

```text
passenger_wsgi.py.example
```

А реальный серверный файл:

```text
passenger_wsgi.py
```

не коммитится, потому что содержит абсолютный путь к конкретному серверу.

---

## Как использовать на сервере

В корне сайта:

```bash
cp passenger_wsgi.py.example passenger_wsgi.py
```

Открыть `passenger_wsgi.py` и заменить:

```python
PROJECT_ROOT = "/var/www/uXXXXXX/data/www/example.com"
```

на реальный путь.

---

## Проверка пути

В корне сайта на сервере можно выполнить:

```bash
pwd
```

Эта команда покажет абсолютный путь.

---

## Перезапуск

После изменения Python-кода или `passenger_wsgi.py`:

```bash
touch .restart-app
```

Файл создаётся в корне сайта.

Passenger перезапустит приложение и удалит файл автоматически.

---

## Важно

У нас Django-проект лежит внутри папки:

```text
backend/
```

Поэтому в `passenger_wsgi.py.example` добавляется путь:

```python
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
sys.path.insert(0, BACKEND_DIR)
```

Это нужно, чтобы Python нашёл:

```python
config.settings
```