# Database settings

## Development

Локально проект использует SQLite:

```env
DJANGO_DATABASE_ENGINE=sqlite
```

Django хранит базу в файле:

```text
backend/db.sqlite3
```

Этот файл не коммитится.

---

## Production

В production планируется MySQL:

```env
DJANGO_DATABASE_ENGINE=mysql
DJANGO_DATABASE_NAME=city_map
DJANGO_DATABASE_USER=city_map_user
DJANGO_DATABASE_PASSWORD=real-password
DJANGO_DATABASE_HOST=localhost
DJANGO_DATABASE_PORT=3306
```

---

## Как выбирается база

В `settings.py` используется переменная:

```python
DATABASE_ENGINE = os.getenv("DJANGO_DATABASE_ENGINE", "sqlite")
```

Если значение:

```text
sqlite
```

используется SQLite.

Если значение:

```text
mysql
```

используется MySQL.

---

## Важно

MySQL driver будет добавлен отдельным шагом ближе к деплою.

Пока в development и production-like локальной проверке можно использовать SQLite.