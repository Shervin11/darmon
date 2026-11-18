# Darmon — запись к врачам

Веб-платформа для поиска врачей и клиник Таджикистана и онлайн-записи на приём. Фронтенд на Next.js; API — отдельный репозиторий [backend-darmon](https://github.com/Shervin11/backend-darmon) (NestJS + PostgreSQL).

**Демо:** https://darmon-amber.vercel.app · API: https://darmon-api.onrender.com (бесплатный Render засыпает: первый запрос может идти ~50 с)

## Возможности

- **Роли:** пациент, врач, клиника, администратор. Защита страниц через middleware.
- **Каталог** врачей и клиник с фильтрами, карточки врачей, избранное.
- **Запись на приём:** выбор свободного слота, статусы заявок, отказ с причиной.
- **Кабинеты:** дашборд врача, панель клиники и ресепшн, админ-панель с модерацией.
- **Чат** пациента и врача, медицинская карта.
- **AI-ассистент** (Groq) и голосовые функции: распознавание речи и озвучка (ElevenLabs), голосовой протокол приёма.
- **Три языка:** таджикский, русский, английский. Светлая и тёмная тема.

## Стек

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Zustand · Axios · shadcn/ui (Radix) · react-hot-toast

## Запуск

```bash
npm install
cp .env.example .env
npm run dev
```

Сначала запустите [backend-darmon](https://github.com/Shervin11/backend-darmon) на http://localhost:3001.

| Переменная | Назначение |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | адрес API |
| `GROQ_API_KEY` | AI-ассистент и распознавание речи (необязательно) |
| `ELEVENLABS_API_KEY` | озвучка (необязательно) |
