# Islamic Habits — Next.js Islamic Lifestyle App

A comprehensive Islamic habits tracking app built with Next.js, TypeScript, Tailwind CSS, and modern web technologies.

## Features

### 🕌 Core Features
- **Prayer Times**: Accurate prayer times calculation using adhan-js
- **Habit Tracking**: Track all Islamic practices (5 daily prayers, Quran reading, adhkar, etc.)
- **Digital Tasbih**: Interactive dhikr counter with rewards system
- **Kids Mode**: Child-friendly interface with parental controls
- **Multi-language**: English and Bengali support (Arabic ready)
- **PWA Support**: Works offline, installable on mobile devices

### 📱 Key Capabilities
- Real-time prayer countdown and notifications
- Comprehensive habit tracking with streaks
- Gamified reward system (Neki coins)
- Educational mini-games for children
- Prayer time calculations (location-based)
- Offline functionality with data sync

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Prisma ORM (SQLite dev, PostgreSQL prod)
- **Authentication**: NextAuth.js with credentials
- **Prayer Times**: adhan-js library
- **Internationalization**: next-intl
- **State Management**: React Query + localStorage
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yousufsk120/IslamicHabits1.git
   cd IslamicHabits1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Demo Account
- **Email**: demo@islamichabits.com
- **Password**: demo123

## Development Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run format` — Run Prettier
- `npm run db:migrate` — Run database migrations
- `npm run db:seed` — Seed database with default data
- `npm run db:studio` — Open Prisma Studio
- `npm run test` — Run unit tests
- `npm run test:e2e` — Run Playwright tests

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    api/                  # API routes
    auth/                 # Authentication pages
    (dashboard)/          # Main app pages
  components/             # React components
    ui/                   # Reusable UI components
    prayer/               # Prayer-related components
    habits/               # Habit tracking components
    tasbih/               # Tasbih/dhikr components
  lib/                    # Utility functions and configurations
  types/                  # TypeScript type definitions
prisma/                   # Database schema and migrations
public/                   # Static assets
messages/                 # Internationalization files
```

## Demo Account
- **Email**: demo@islamichabits.com
- **Password**: demo123

---

**Built with ❤️ for the Muslim community**