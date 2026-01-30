# Заработок — готовый сайт с Groq AI (Next.js)

## 1) Установка
Node.js 18+.

## 2) Переменные окружения
Создай файл `.env.local` в корне проекта:

GROQ_API_KEY=твой_ключ
GROQ_MODEL=llama3-70b-8192

## 3) Запуск
npm install
npm run dev

Открой http://localhost:3000

## 4) Деплой 24/7 (Vercel)
- Залей проект на GitHub
- Import в Vercel
- Добавь Env Vars: GROQ_API_KEY, GROQ_MODEL
- Deploy
