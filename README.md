# Pantech

Корпоративный сайт + админка для редактирования контента и просмотра обращений с формы.

- **Frontend** — React 19 + Vite + TypeScript, статика отдаётся Nginx из `frontend/`.
- **Backend** — FastAPI + SQLAlchemy 2 (async) + asyncpg, миграции на Alembic.
- **БД** — PostgreSQL 15 в контейнере `db`.
- **Reverse proxy** — Nginx в контейнере `web` слушает **5173**, проксирует `/api/*` в `backend:8080`. Снаружи: `${WEB_PUBLISH_PORT:-5173}:5173`. Глобальный nginx на сервере → `127.0.0.1:5173`.

## Быстрый старт

```bash
cp .env.example .env
# Заполнить SMTP_PASS, JWT_SECRET, ADMIN_LOGIN/HASH (см. ниже)
docker compose up --build
```

После старта:
- Сайт: http://localhost:5173
- Логин админа: http://localhost:5173/in
- Админка: http://localhost:5173/a (только для авторизованных)

## Переменные окружения

Все ключевые переменные — в [.env.example](./.env.example). Самые важные:

- `ADMIN_LOGIN`, `ADMIN_PASSWORD_HASH` — учётка админа.
- `JWT_SECRET` — секрет для подписи cookie. В проде обязательно сгенерировать.
- `COOKIE_SECURE=true` за HTTPS, иначе `false` (иначе cookie не выставится через http://).
- `DATABASE_URL` — async DSN (`postgresql+asyncpg://...`).
- `RUN_SEED=1` (по умолчанию) — на старте бэкенда применяются миграции и заливается начальный контент.

### Сгенерировать пароль админа

```bash
docker compose run --rm backend python -m scripts.hash_password 'super-secret'
# выведет $2b$12$...; вставить в ADMIN_PASSWORD_HASH в .env
```

### Сгенерировать JWT_SECRET

```bash
openssl rand -hex 32
```

## Разработка

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

В dev-режиме:
- Бэкенд монтируется как volume и стартует с `--reload`.
- Порт `5432` Postgres проброшен наружу.

Фронт отдельно (если нужно горячее обновление вне Docker):

```bash
cd frontend && npm install && npm run dev
```

API в dev-режиме:
- **Docker** (`docker compose up`) — только через nginx: `http://localhost:5173/api/...`
- **`npm run dev`** — Vite проксирует `/api` → `http://127.0.0.1:8080` (нужен запущенный backend)

Системный nginx: [nginx/pan-tech.conf](./nginx/pan-tech.conf) — один `location /` на `127.0.0.1:5173` (без отдельного `/api` на :8080).

## Миграции

```bash
# применить все миграции
docker compose exec backend alembic upgrade head

# создать новую (внутри контейнера)
docker compose exec backend alembic revision -m "add column" --autogenerate
```

## Сидинг

```bash
docker compose exec backend python -m seeds.initial
```

Идемпотентно: дубликаты не вставляет.

## Структура

- `backend/` — FastAPI (`main.py`, `routes/`, `services/`, `models/`, `schemas/`, `db/`, `alembic/`, `seeds/`, `middleware/`, `scripts/`).
- `frontend/src/`
  - `pages/App/` — лендинг (тексты тянутся из `/api/content`, fallback на хардкод).
  - `pages/Auth/` — `/in` логин в админку.
  - `pages/Admin/` — лейаут админки.
    - `pages/Dashboard/` — метрики посещений и сообщений.
    - `pages/Mail/` — список сообщений из формы.
    - `pages/ContentEditor/` — табы «Тексты / Карточки / Услуги / Проекты» с CRUD.
  - `contexts/` — `AuthContext`, `ContentContext` (`t(key, fallback)`, `json(key, fallback)`).
  - `services/` — `api.ts` (fetch с `credentials: include`), `auth.ts`, типы DTO.

## Безопасность

- `.env` коммитить нельзя. Пароли SMTP/admin храните в секретах CI или сервер-side .env.
- В продакшне поставьте `COOKIE_SECURE=true` и работайте только по HTTPS.
- Старый файл `backend/logs/email_logs.json` больше не используется — все обращения хранятся в таблице `messages`.

## API

Публичные:
- `GET /api/content` — все ключи контента.
- `GET /api/cards`, `/api/services`, `/api/projects` — опубликованные сущности.
- `POST /api/messages` (или старый alias `/send-email`) — отправка письма с формы (multipart/form-data).
- `GET /api/health` — healthcheck.

Auth (cookie-based JWT):
- `POST /api/auth/login` — `{ login, password }`.
- `POST /api/auth/logout`.
- `GET /api/auth/me`.

Admin (требуют cookie `pt_admin`):
- `GET/PUT /api/admin/content`.
- `GET/POST/PUT/DELETE /api/admin/{cards|services|projects}[/id]`.
- `GET /api/admin/messages?limit&offset&q`.
- `GET /api/admin/stats`.
