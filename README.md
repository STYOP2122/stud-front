# StudWork Frontend

React + TypeScript + Vite клиент маркетплейса StudWork.

## Live demo

После деплоя: **https://STYOP2122.github.io/stud-front/**

Нужен работающий API (см. [stud-back](https://github.com/STYOP2122/stud-back)).

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:5173 — API проксируется на `http://localhost:5000`.

## Переменные окружения

| Переменная | Описание |
|---|---|
| `VITE_API_URL` | Origin бэкенда, напр. `https://studwork-api.onrender.com` (без `/api`) |
| `VITE_BASE_PATH` | Базовый путь для GitHub Pages: `/stud-front/` |

В GitHub: **Settings → Secrets and variables → Actions → Variables** → `VITE_API_URL`.

## Тестовые аккаунты

| Email | Пароль | Роль |
|---|---|---|
| `customer@test.com` | `123456` | Заказчик |
| `executor@test.com` | `123456` | Исполнитель (PRO) |
| `writer@test.com` | `123456` | Исполнитель |
| `admin@test.com` | `123456` | Админ |

## GitHub Pages

Workflow `.github/workflows/deploy-pages.yml` деплоит ветку `main` автоматически.
В репозитории включите **Settings → Pages → Source: GitHub Actions**.
