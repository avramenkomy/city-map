# Чеклист перед деплоем

## Backend

### Тесты

```bash
cd backend
source .venv/bin/activate
python manage.py test
```

Ожидаемый результат:

```text
OK
```

---

### Django system check

```bash
cd backend
source .venv/bin/activate
python manage.py check
```

Ожидаемый результат:

```text
System check identified no issues
```

---

### Проверка migrations

```bash
cd backend
source .venv/bin/activate
python manage.py makemigrations --check --dry-run
```

Ожидаемый результат:

```text
No changes detected
```

Если Django сообщает, что есть новые migrations, нужно создать их и закоммитить.

---

### Локальный backend server

```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

Проверить в браузере:

```text
http://127.0.0.1:8000/api/health/
http://127.0.0.1:8000/api/categories/
http://127.0.0.1:8000/api/places/
http://127.0.0.1:8000/admin/
```

---

## Frontend

### Установка зависимостей

```bash
cd frontend
npm install
```

---

### Unit tests

```bash
cd frontend
npm test
```

Ожидаемый результат:

```text
Test Files passed
Tests passed
```

---

### ESLint

```bash
cd frontend
npm run lint
```

Ожидаемый результат:

```text
нет ошибок
```

Warnings можно разбирать отдельно, но перед деплоем лучше стремиться к чистому результату.

---

### Production build

```bash
cd frontend
npm run build
```

Ожидаемый результат:

```text
dist/ создан без ошибок
```

---

### Preview production build

```bash
cd frontend
npm run preview
```

Проверить страницу, которую покажет Vite preview.

Важно: preview проверяет frontend build, но API-запросы могут требовать отдельно запущенный backend.

---

## Frontend pages

Проверить вручную:

```text
/
 /login
/register
/feedback
/add-place
/my-places
/places/:id/edit
несуществующий route → NotFoundPage
```

---

## Основные пользовательские сценарии

### Guest

- открыть главную страницу
- посмотреть карту
- посмотреть список мест
- открыть модальное окно места
- перейти на `/add-place`
- убедиться, что guest перенаправлен на `/login`

### Auth

- зарегистрироваться
- выйти
- войти
- открыть `/add-place`
- добавить место
- проверить, что место появилось в списке
- открыть `/my-places`
- отредактировать своё место
- удалить своё место

### Feedback

- открыть `/feedback`
- отправить пустую форму
- проверить frontend validation
- отправить корректную форму
- проверить success message
- проверить обработку `429 Too Many Requests`, если throttle легко воспроизвести

### Map / Coordinates

- ввести невалидную широту
- убедиться, что проект не падает
- ввести невалидную долготу
- убедиться, что проект не падает
- выбрать точку на карте
- убедиться, что latitude/longitude обновились

### Image upload

- загрузить JPEG
- загрузить PNG
- загрузить WEBP
- попробовать файл больше 2 MB
- попробовать неподдерживаемый тип файла
- заменить фото у места
- удалить место и проверить, что backend не падает

---

## Environment files

Проверить, что в git нет настоящих секретов:

```bash
git status
git diff --cached
```

Настоящий файл:

```text
backend/.env
```

не должен попасть в git.

В git должен быть только пример:

```text
backend/.env.example
```

---

## Component tests

Компонентное тестирование frontend временно отложено до этапа после первого деплоя.

Пока перед деплоем можно оставить только utility tests:

```text
coordinates.test.js
validatePlaceForm.test.js
validateAuthForms.test.js
validateFeedbackForm.test.js
validatePlaceImageFile.test.js
```

После деплоя вернёмся к тестам React-компонентов:

```text
FieldError
LoginPage
RegisterPage
FeedbackPage
PlaceForm
ProtectedRoute
GuestOnlyRoute
```

---

## Git

Перед деплоем проверить:

```bash
git status
git log --oneline -10
```

Рабочее дерево должно быть чистым:

```text
nothing to commit, working tree clean
```