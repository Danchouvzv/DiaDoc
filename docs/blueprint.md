# **App Name**: DiaDoc

## Core Features:

- Food Logging: Users can record their food intake with text and photos.
- Automated Nutritional Analysis: Automatically calculate calories and macronutrient breakdown (BJU) from food entries using a tool to extract insights from food descriptions.
- Activity Tracking: Users log physical activities, including type, duration, and steps taken.
- Wellbeing Logging: Capture user's subjective feelings and energy levels, tracking general wellbeing.
- Reports and Dashboards: Showcase trends with weekly and monthly glucose and activity levels. Provide summaries of calorie and macronutrient intake. Present a health history using heatmaps.
- Registration/Login: User registration and login (email + OAuth).
- User Profile: User profile with goals (calories, steps, target glucose range).
- Password Reset/Email Verification: Password reset and email verification.
- Device Sync - Steps: Import steps from Google Fit / Apple Health.
- Device Sync - Glucose: Import glucose data from CGM devices (CSV / API).
- Diary Reminder Notifications: Push / e-mail / Telegram-bot reminder to 'Fill the diary'.
- Glucose Level Alerts: Trigger alerts for critical glucose levels.
- AI - Food Recognition: Use Vision API to recognize food in photos and generate a list of ingredients.
- AI - Nutritional Analysis and Recommendations: Use Gemini API to convert text descriptions + ingredients into calories, macronutrients (BJU), and recommendations using a tool.
- Backend API - REST: REST API: /auth, /entries, /stats, /ai/analyze
- Backend API - Real-time Updates: WebSocket / SSE channel for live dashboard updates.
- Database Structure: Database structure: Users, Entries (food, activity, mood), Photos (Storage URL), Recommendations (AI output).
- Access Rights & Security - Authentication: JWT + HttpOnly cookie for authentication.
- Access Rights & Security - Roles: User and admin roles.
- Access Rights & Security - Protections: Rate limit / XSS / CSRF protection.
- UI/UX - Theme: Light/dark theme (CSS custom properties).
- UI/UX - Loading Skeletons: Skeletons during loading (React Query).
- UI/UX - Quick Entry: Quick entry form (⌘+K Command Palette).
- Accessibility - Contrast: Contrast ≥ WCAG AA.
- Accessibility - Aria Labels: aria-label on interactive elements.
- Accessibility - Keyboard Navigation: Keyboard navigation.
- Testing - Unit Tests: Jest + RTL for component testing.
- Testing - E2E Tests: Cypress smoke-flow (login → add entry → see stats).
- CI/CD - GitHub Actions: GitHub Actions: lint → test → build.
- Performance - Lazy Loading: Lazy-load images.
- Performance - Code Splitting: Code-splitting of routes.
- Performance - Bundle Size: Bundle size ≤ 150 KB gzipped.
- DevOps - Dockerfile: Dockerfile (web + server).
- DevOps - Docker Compose: docker-compose for local dev stack.
- DevOps - Autodeploy: Vercel / Render autodeploy.
- Localization: i18next with JSON files (en / ru / kk).
- Reports - PDF Export: Export weekly report to PDF (react-pdf).
- Reports - Shareable Link: Sharing report by link with token.
- Error Logging: Sentry SDK in front-end and back-end.

## Style Guidelines:

- Primary color: #00A3FF (Blue)
- Accent color: #00DDFF (Cyan) for interactive elements
- Background color: #0E1A20 (Dark Gray)
- Use clear, modern fonts for readability.
- Use consistent and clear icons for easy navigation. Lucide-react or Hero Icons
- Use a clean, intuitive layout.