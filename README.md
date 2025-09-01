# Islamic Habits — Vite + React + Tailwind

A beautiful and intuitive Islamic habits tracker to help Muslims build and maintain beneficial habits that bring them closer to Allah.

## Features
- 🕌 Prayer tracking
- 📖 Quran reading goals
- 💰 Charity giving tracker
- 🤲 Dhikr counter
- 🌙 Fasting tracker
- 👥 Community features

## Scripts
- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run preview` — serve production build locally
- `npm run lint` — run ESLint
- `npm run format` — run Prettier

## Deploy

### Cloudflare Pages (Recommended for islamic-habits.com)
See [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) for complete setup instructions.

### Other Options
- **Vercel:** push to GitHub, import repo on Vercel. `vercel.json` included.
- **Static hosts:** run `npm run build` and upload `dist/`.

## Structure
```
public/
  favicon.svg
  robots.txt
  sitemap.xml
  _redirects
src/
  App.tsx
  main.tsx
  index.css
index.html
tailwind.config.ts
vite.config.ts
```