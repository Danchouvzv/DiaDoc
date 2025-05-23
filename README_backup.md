# 🩺 DiaDoc: Революционная платформа для управления диабетом

<p align="center">
  <img src="public/diadoc-banner.png" alt="DiaDoc Banner" width="850">
</p>

<p align="center">
  <a href="#-миссия"><strong>Миссия</strong></a> •
  <a href="#-возможности"><strong>Возможности</strong></a> •
  <a href="#-архитектура"><strong>Архитектура</strong></a> •
  <a href="#-технологии"><strong>Технологии</strong></a> •
  <a href="#-инструкция"><strong>Инструкция</strong></a> •
  <a href="#-скриншоты"><strong>Скриншоты</strong></a> •
  <a href="#-стратегия-развития"><strong>Стратегия развития</strong></a>
</p>

<p align="center">
  <a href="https://github.com/Danchouvzv/DiaDoc/actions"><img src="https://github.com/Danchouvzv/DiaDoc/workflows/build/badge.svg" alt="Build Status"></a>
  <a href="https://github.com/Danchouvzv/DiaDoc/issues"><img src="https://img.shields.io/github/issues/Danchouvzv/DiaDoc" alt="Issues"></a>
  <a href="https://github.com/Danchouvzv/DiaDoc/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Danchouvzv/DiaDoc" alt="License"></a>
</p>

## 🎯 Миссия

**DiaDoc** - это передовая платформа для управления диабетом, объединяющая последние достижения в области искусственного интеллекта, анализа данных и медицинских исследований. Мы стремимся кардинально изменить подход к контролю диабета, предоставляя инструменты, которые не просто отслеживают показатели, но и активно прогнозируют, анализируют и рекомендуют персонализированные стратегии управления здоровьем.

> "Традиционные методы управления диабетом часто реактивны — пациенты реагируют на уже происходящие изменения. DiaDoc меняет парадигму, делая управление диабетом проактивным, персонализированным и основанным на данных." — Д-р Михаил Ковальчук, эндокринолог

## ✨ Возможности

DiaDoc построен на модульной архитектуре, где каждый компонент отвечает за ключевой аспект управления диабетом:

### 📊 Dashboard

**Интеллектуальный центр управления здоровьем**

- **Комплексный обзор показателей**: Визуализация всех ключевых метрик здоровья на одном экране с интерактивными графиками и динамическими панелями
- **Система раннего оповещения**: Алгоритмы обнаружения аномалий для выявления потенциальных проблем до их обострения
- **Персонализированные цели**: Автоматическая адаптация целевых показателей на основе прогресса и медицинских рекомендаций
- **Интеграция данных в реальном времени**: Синхронизация с устройствами мониторинга глюкозы и другими медицинскими гаджетами

**Техническая реализация**: React-компоненты с оптимизированным ререндерингом, интеграция с Firebase Realtime Database для мгновенных обновлений, кэширование данных для офлайн-доступа.

### 📈 Log Glucose

**Продвинутая система мониторинга глюкозы**

- **Многоформатный ввод данных**: Поддержка ручного ввода, импорта из глюкометров и непрерывных мониторов глюкозы (CGM)
- **Контекстуальная аналитика**: Автоматическая корреляция уровня глюкозы с приемами пищи, физической активностью и лекарствами
- **Прогнозирование тенденций**: ML-модели для предсказания колебаний уровня глюкозы на основе исторических паттернов
- **Адаптивные целевые диапазоны**: Настраиваемые целевые показатели с учетом времени суток, физической активности и других факторов

**Техническая реализация**: Интеграция с `generateHealthInsights()` для анализа данных, оптимизированное хранение временных рядов, алгоритмы сглаживания данных для улучшения визуализации.

### 🍽️ Log Food

**ИИ-аналитика питания с учетом влияния на гликемию**

- **Продвинутое распознавание пищи**: Анализ фотографий еды с идентификацией ингредиентов и оценкой порций
- **Прогнозирование гликемического отклика**: Предсказание влияния еды на уровень глюкозы на основе индивидуальных данных пользователя
- **Персонализированные рекомендации**: Адаптивные предложения по корректировке питания на основе исторических данных
- **Умный пищевой дневник**: Автоматическое отслеживание тенденций питания и выявление проблемных продуктов

**Техническая реализация**: Модуль `food-analyzer.ts` с реализацией функции `analyzeFoodWithAI()`, которая анализирует состав пищи, предсказывает гликемическую реакцию и генерирует рекомендации.

### 🏃‍♂️ Log Activity

**Умный трекер активности с фокусом на метаболическое здоровье**

- **Многоуровневое отслеживание**: Поддержка различных типов активности с учетом интенсивности, продолжительности и влияния на метаболизм
- **Реальное отслеживание времени**: Встроенный таймер с интеллектуальным распознаванием типа активности
- **Анализ влияния на глюкозу**: Оценка краткосрочного и долгосрочного воздействия физической активности на контроль уровня глюкозы
- **Адаптивные рекомендации**: Персонализированные предложения по оптимальному времени и типу активности для улучшения показателей здоровья

**Техническая реализация**: Использование алгоритмов MET (Metabolic Equivalent of Task) для точного расчета энергозатрат, интеграция с датчиками движения для автоматического распознавания активности.

### 🧠 Insights

**Интеллектуальная аналитическая система на базе ИИ**

- **Комплексный анализ данных**: Интеграция всех источников информации для выявления неочевидных корреляций и паттернов
- **Персонализированные рекомендации**: Генерация конкретных, действенных советов, адаптированных под индивидуальный профиль пользователя
- **Прогностическая аналитика**: Предсказание долгосрочных тенденций здоровья и потенциальных рисков
- **Поведенческие инсайты**: Выявление и рекомендации по коррекции поведенческих паттернов, влияющих на контроль диабета

**Техническая реализация**: Модуль `health-insights.ts` с функцией `generateHealthInsights()`, которая обрабатывает комплексные наборы данных и генерирует структурированные отчеты и рекомендации с использованием алгоритмов машинного обучения.

### 💆‍♂️ Wellbeing

**Холистический подход к управлению здоровьем**

- **Мониторинг качества сна**: Анализ продолжительности и качества сна с корреляцией с уровнем глюкозы
- **Управление стрессом**: Инструменты для отслеживания и снижения уровня стресса с учетом его влияния на метаболизм
- **Отслеживание настроения**: Визуализация эмоционального состояния и его взаимосвязи с другими аспектами здоровья
- **Программы медитации**: Адаптивные сессии осознанности для улучшения психологического благополучия

**Техническая реализация**: Компоненты SleepQualityChart для визуализации качества сна, StressDisplay для мониторинга стресса, CircularProgress для отображения прогресса медитации, WellbeingScale для оценки общего состояния.

### ⚙️ Settings

**Расширенная система персонализации и управления**

- **Всесторонняя настройка профиля**: Детальная настройка всех аспектов приложения под индивидуальные потребности
- **Интеграция устройств**: Управление подключениями к медицинским устройствам и другим источникам данных
- **Настройка уведомлений**: Гибкая система оповещений с учетом приоритетов пользователя
- **Управление данными и конфиденциальностью**: Полный контроль над сбором, хранением и использованием медицинских данных

**Техническая реализация**: Интеграция с Firebase Authentication для управления аккаунтом, контекст `useAuth()` для доступа к функциям аутентификации, использование `useTheme()` для управления темой интерфейса.

## 🏗 Архитектура

DiaDoc реализован на основе современной многоуровневой архитектуры, обеспечивающей производительность, масштабируемость и безопасность:

<p align="center">
  <img src="public/architecture-diagram.png" alt="DiaDoc Architecture" width="750">
</p>

### 1. Клиентский уровень (Frontend)

- **Next.js App Router**: Оптимизированная маршрутизация и серверный рендеринг для максимальной производительности
- **Компонентная структура React**: Модульные, переиспользуемые компоненты с оптимизированным жизненным циклом
- **Tailwind CSS + Framer Motion**: Адаптивный дизайн с плавными анимациями для улучшения пользовательского опыта

### 2. Уровень логики и AI (Middleware)

- **Генеративный AI**: Модуль анализа данных с функциями `generateHealthInsights()` и `analyzeFoodWithAI()`
- **Context API**: Эффективное управление состоянием приложения через контексты (AuthContext, ThemeContext)
- **Serverless Functions**: API-маршруты Next.js для безопасного взаимодействия с внешними сервисами

### 3. Уровень данных (Backend)

- **Firebase Realtime Database**: Хранение и синхронизация пользовательских данных в реальном времени
- **Firebase Authentication**: Безопасное управление пользовательскими аккаунтами
- **Firebase Cloud Functions**: Бэкенд-логика для обработки сложных операций и интеграции с внешними API

### Поток данных

1. **Сбор данных**:
   - Пользователь вводит или импортирует данные через соответствующие модули
   - Данные валидируются с использованием схем из `lib/schemas.ts`

2. **Обработка и анализ**:
   - AI-модули обрабатывают собранные данные, выявляя паттерны и генерируя инсайты
   - `health-insights.ts` агрегирует данные из разных источников для комплексного анализа

3. **Представление и обратная связь**:
   - Результаты обработки визуализируются в интерактивных дашбордах и отчетах
   - Система генерирует персонализированные рекомендации на основе обработанных данных

## 🚀 Технологии

DiaDoc построен на основе передовых технологий и методологий разработки:

### Frontend
- **Next.js 14**: App Router, Server Components, и оптимизированный рендеринг
- **React 18**: Использование новейших концепций React (Hooks, Suspense, Concurrent Mode)
- **TypeScript**: Строгая типизация для предотвращения ошибок и улучшения разработки
- **Tailwind CSS**: Утилитарный CSS-фреймворк для быстрой разработки адаптивного UI
- **Framer Motion**: Продвинутая библиотека анимаций для создания плавных интерфейсов
- **Shadcn UI**: Доступные и настраиваемые компоненты для современного дизайна
- **React Query**: Эффективное управление серверным состоянием и кэширование

### Backend & Data
- **Firebase**: Комплексное решение для хранения данных, аутентификации и серверных функций
- **Prisma**: Современный ORM для типобезопасного доступа к базе данных
- **NextAuth.js**: Гибкий фреймворк аутентификации для Next.js
- **Axios**: Продвинутый HTTP-клиент для взаимодействия с API
- **Zod**: Библиотека валидации схем для обеспечения целостности данных

### AI & Analytics
- **TensorFlow.js**: Фреймворк машинного обучения для клиентской стороны
- **Recharts**: Библиотека для создания интерактивных визуализаций данных
- **ml5.js**: Упрощенный интерфейс для машинного обучения в браузере

### DevOps & Testing
- **Jest & React Testing Library**: Комплексное тестирование компонентов и логики
- **Cypress**: E2E-тестирование пользовательских сценариев
- **GitHub Actions**: CI/CD для автоматического тестирования и деплоя
- **Vercel**: Платформа для хостинга и развертывания приложений Next.js

## 📋 Инструкция по запуску

### Предварительные требования

- Node.js (v18.0.0 или выше)
- npm или yarn
- Firebase аккаунт для бэкенд-функциональности

### Установка и запуск

1. **Клонирование репозитория**
   ```bash
   git clone https://github.com/Danchouvzv/DiaDoc.git
   cd DiaDoc
   ```

2. **Установка зависимостей**
   ```bash
   npm install
   # или
   yarn
   ```

3. **Настройка окружения**
   
   Создайте файл `.env.local` в корневой директории:
   ```
   # Firebase конфигурация
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   
   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   
   # API Keys для внешних сервисов
   FOOD_RECOGNITION_API_KEY=your-food-api-key
   ```

4. **Запуск сервера разработки**
   ```bash
   npm run dev
   # или
   yarn dev
   ```

5. **Сборка для продакшена**
   ```bash
   npm run build
   npm run start
   # или
   yarn build
   yarn start
   ```

6. **Запуск тестов**
   ```bash
   npm run test
   # или
   yarn test
   ```

## 📁 Структура проекта

```
DiaDoc/
├── src/
│   ├── ai/                      # Модули искусственного интеллекта
│   │   ├── food-analyzer.ts     # Анализ питания с помощью ИИ
│   │   ├── genkit.ts            # Генеративные ИИ-инструменты
│   │   └── health-insights.ts   # Генерация инсайтов о здоровье
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API-маршруты для серверной функциональности
│   │   ├── dashboard/           # Дашборд и его компоненты
│   │   │   ├── app-dashboard.tsx       # Главный дашборд
│   │   │   ├── insights/        # Страница инсайтов и аналитики
│   │   │   ├── log-activity/    # Логирование физической активности
│   │   │   ├── log-food/        # Логирование питания
│   │   │   ├── log-glucose/     # Логирование уровня глюкозы
│   │   │   ├── settings/        # Настройки пользователя
│   │   │   └── wellbeing/       # Мониторинг общего благополучия
│   │   ├── login/               # Страница входа
│   │   ├── register/            # Страница регистрации
│   │   ├── not-found.tsx        # Кастомная 404 страница
│   │   ├── layout.tsx           # Корневой layout
│   │   └── page.tsx             # Лендинг страница
│   ├── components/              # Многоразовые React-компоненты
│   │   ├── ui/                  # UI компоненты
│   │   ├── charts/              # Компоненты визуализации данных
│   │   ├── forms/               # Компоненты форм и ввода
│   │   └── layout/              # Компоненты layout'а
│   ├── lib/                     # Вспомогательные функции и библиотеки
│   │   ├── schemas.ts           # Схемы данных и валидация
│   │   ├── firebase.ts          # Конфигурация Firebase
│   │   └── utils.ts             # Вспомогательные функции
│   ├── providers/               # Контексты React и провайдеры
│   │   ├── auth-provider.tsx    # Провайдер аутентификации
│   │   └── theme-provider.tsx   # Провайдер темы
│   └── styles/                  # Глобальные стили и CSS-модули
│       └── globals.css          # Глобальные стили
├── public/                      # Статические ресурсы
│   ├── images/                  # Изображения
│   └── fonts/                   # Шрифты
├── tests/                       # Тесты
│   ├── unit/                    # Модульные тесты
│   ├── integration/             # Интеграционные тесты
│   └── e2e/                     # End-to-End тесты
├── .env.example                 # Пример конфигурации окружения
├── next.config.js               # Конфигурация Next.js
├── package.json                 # Зависимости и скрипты
├── tsconfig.json                # Конфигурация TypeScript
├── tailwind.config.js           # Конфигурация Tailwind CSS
└── README.md                    # Документация проекта
```

## 📸 Скриншоты

<p align="center">
  <img src="public/screenshots/dashboard.png" alt="Dashboard" width="48%">
  <img src="public/screenshots/insights.png" alt="Insights" width="48%">
</p>
<p align="center">
  <img src="public/screenshots/log-glucose.png" alt="Log Glucose" width="48%">
  <img src="public/screenshots/log-food.png" alt="Log Food" width="48%">
</p>
<p align="center">
  <img src="public/screenshots/wellbeing.png" alt="Wellbeing" width="48%">
  <img src="public/screenshots/settings.png" alt="Settings" width="48%">
</p>

## 🔮 Стратегия развития

Наша дорожная карта на ближайший год включает следующие ключевые направления:

### Q1 2024
- **Расширенная интеграция с медицинскими устройствами**: Поддержка всех популярных CGM-систем и инсулиновых помп
- **Улучшенные алгоритмы прогнозирования**: Увеличение точности предсказания уровня глюкозы до 95%
- **Модуль для медицинских работников**: Инструменты для врачей для мониторинга пациентов и управления лечением

### Q2 2024
- **Расширенные интеграции с питанием**: Автоматический импорт из популярных сервисов заказа еды и ресторанов
- **Персонализированные планы питания**: Автоматическая генерация меню на основе предпочтений и метаболических данных
- **Социальная платформа**: Расширенные возможности для поддержки сообщества и обмена опытом

### Q3-Q4 2024
- **Интеграция геномных данных**: Учет генетических факторов в алгоритмах прогнозирования и рекомендаций
- **Расширенный AI-ассистент**: Голосовой помощник с поддержкой естественного языка для управления здоровьем
- **Адаптивное машинное обучение**: Непрерывное улучшение моделей прогнозирования на основе индивидуальных данных

## 🤝 Вклад в проект

Мы приветствуем вклад от разработчиков, исследователей и пациентов! Вот как вы можете помочь:

1. **Форкните репозиторий**
2. **Создайте ветку для вашей функции**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Внесите ваши изменения и закоммитьте их**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Отправьте изменения в ваш форк**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Создайте Pull Request в основной репозиторий**

Пожалуйста, ознакомьтесь с нашим [руководством по содействию](CONTRIBUTING.md) для получения дополнительной информации.

## 📝 Лицензия

Этот проект лицензирован под [MIT License](LICENSE).

## 🌟 Благодарности

Мы благодарим всех, кто внес свой вклад в развитие DiaDoc:

- Наше сообщество пользователей за ценную обратную связь
- Медицинских специалистов, консультировавших по клиническим аспектам
- Open Source сообщество, чьи инструменты и библиотеки сделали этот проект возможным

## 📬 Контакты

Для вопросов, предложений и сотрудничества:

- **Автор**: Talgatov Daniyal
- **Email**: talgatovdaniyal@gmail.com
- **GitHub**: [https://github.com/Danchouvzv](https://github.com/Danchouvzv)

---

<p align="center">
  <em>DiaDoc — Интеллектуальная забота о вашем здоровье</em><br>
  <a href="https://twitter.com/diadocapp">Twitter</a> •
  <a href="https://instagram.com/diadocapp">Instagram</a> •
  <a href="https://diadoc.health">Website</a>
</p>
