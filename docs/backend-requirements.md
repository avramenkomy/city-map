# Backend requirements

## Основной файл

Backend-зависимости хранятся в:

```text
backend/requirements.txt
```

На сервере установка выполняется так:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Как обновить requirements.txt

```bash
cd backend
source .venv/bin/activate
pip freeze > requirements.txt
```

---

## Проверка

```bash
python manage.py check
python manage.py test
```

---

## MySQL driver

Для MySQL позже может понадобиться:

```text
mysqlclient
```

Пока он не добавлен специально.

Причина:

```text
на разных хостингах установка mysqlclient зависит от системных библиотек
```

Мы добавим MySQL driver отдельным шагом при реальной настройке MySQL.