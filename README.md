# Islamic Habits — Vite + React + Tailwind

Minimal, production-ready front-end scaffold.

## Scripts
- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run preview` — serve production build locally
- `npm run lint` — run ESLint
- `npm run format` — run Prettier

## Deploy
- **Vercel:** push to GitHub, import repo on Vercel. `vercel.json` included.
- **Static hosts:** run `npm run build` and upload `dist/`.

### Custom Domain with Cloudflare
For connecting your Vercel deployment with Cloudflare DNS, see [CNAME_SETUP.md](./CNAME_SETUP.md) for detailed instructions on configuring CNAME records.

## Structure
```
public/
  favicon.svg
  robots.txt
  sitemap.xml
src/
  lib/utils.ts
  main.tsx
  index.css
index.html
tailwind.config.ts
vite.config.ts
```