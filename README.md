# Islamic Habits — Vite + React + Tailwind

A beautiful Islamic habits tracker application built with modern web technologies.

## 🚀 Live Demo
**Vercel Deployment Link:** [https://islamic-habits1.vercel.app](https://islamic-habits1.vercel.app)

## ✨ Features
- Islamic-themed habit tracker
- Daily habit monitoring (Fajr Prayer, Quran Reading, Dhikr, Charity)
- Beautiful gradient design with dark mode support
- Responsive design for all devices
- Built with React + TypeScript + Tailwind CSS

## 🛠 Scripts
- `npm install` — install dependencies
- `npm run dev` — start dev server (http://localhost:5173)
- `npm run build` — build for production
- `npm run preview` — serve production build locally
- `npm run typecheck` — run TypeScript type checking
- `npm run lint` — run ESLint
- `npm run format` — run Prettier

## 📦 Deploy to Vercel

### Automatic Deployment
1. Push this repository to GitHub
2. Connect your GitHub account to [Vercel](https://vercel.com)
3. Import this repository on Vercel
4. Vercel will automatically detect the Vite configuration and deploy

### Manual Deployment
```bash
npm install -g vercel
npm run build
vercel --prod
```

The `vercel.json` configuration file is already included for optimal deployment.

## 🏗 Project Structure
```
public/
  favicon.svg          # Islamic-themed favicon
  robots.txt           # SEO robots file
  sitemap.xml          # SEO sitemap
src/
  lib/utils.ts         # Utility functions
  App.tsx              # Main application component
  App.css              # Application styles
  main.tsx             # React entry point
  index.css            # Global styles with Tailwind
index.html             # HTML template
tailwind.config.ts     # Tailwind configuration
vite.config.ts         # Vite build configuration
vercel.json            # Vercel deployment config
```

## 🎯 Usage
The application includes a habit tracker for common Islamic practices:
- **Fajr Prayer** - Start your day with Allah
- **Quran Reading** - Daily recitation
- **Dhikr** - Remember Allah often  
- **Charity** - Give to those in need

Use the habit counter to track your daily accomplishments and build consistent Islamic habits.