# StudWork Frontend

Веб-интерфейс маркетплейса StudWork. Пользователи могут создавать задания, просматривать заказы, отправлять отклики, общаться и управлять своим профилем. Для администрации предусмотрены страницы управления пользователями и заказами.

Backend находится в [stud-back](https://github.com/STYOP2122/stud-back).

## Технологии

React 19, TypeScript, Vite, Redux Toolkit, React Router и Axios.

## Локальный запуск

Понадобятся Node.js и npm с поддержкой версии Vite из `package.json`, а также запущенный StudWork API.

```bash
git clone https://github.com/STYOP2122/stud-front.git
cd stud-front
npm install
npm run dev
```

Откройте `http://localhost:5173`. Сервер разработки перенаправляет `/api` и `/uploads` на `http://localhost:5000`, где по умолчанию запускается backend.

Если API работает на другом адресе, создайте `.env.local`:

```dotenv
VITE_API_URL=http://localhost:8080
```

На стороне API разрешите адрес frontend в настройках CORS. После изменения переменных перезапустите сервер разработки.

## Сборка и проверка

```bash
npm run lint
npm run build
npm run preview
```

Сборка создаётся в `dist/`. Для публикации в подпапке можно задать `VITE_BASE_PATH`, который используется в `vite.config.ts`. При сборке для отдельного сервера также задайте `VITE_API_URL`.

## Структура

- `src/pages/` — заказы, профили, сообщения и авторизация.
- `src/pages/admin/` — административные страницы.
- `src/api/` — HTTP-клиент и работа с API.
- `src/config.ts` — адрес backend.
- `src/types/` — типы данных.
