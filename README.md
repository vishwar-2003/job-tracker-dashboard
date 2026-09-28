# JobTrail - Job Application Tracker Dashboard

A responsive React dashboard for tracking job applications end to end: log every application, filter and search your pipeline, see progress in charts, move roles through a Kanban board, and discover new openings from a live public jobs API.

**Live demo:** _add your Vercel URL here_

## Features

- **Application tracker** - add, edit and delete applications with company, role, status, date, location, work mode, source, salary, tags, link and notes. Form validation and keyboard support (Esc to close, Enter to open a row).
- **Filters and search** - full-text search across company, role, tags and notes; multi-select status chips; source, work mode and date-range filters; four sort orders. Everything (KPIs and charts included) updates live with the filters.
- **Analytics** - KPI cards (tracked, in progress, interview rate, offer rate) and three Recharts visualisations: weekly application trend, pipeline by stage and top sources.
- **Kanban board** - drag and drop cards between stages on desktop; a stage dropdown on each card for touch and keyboard users.
- **Discover tab** - live listings from the free [Arbeitnow Job Board API](https://www.arbeitnow.com/blog/job-board-api) served through a Vercel serverless function (`/api/jobs`), with remote-only filter, pagination and one-click "Track" to your Wishlist.
- **Persistence** - data is saved in `localStorage`, with JSON export / import for backups.
- **Responsive and accessible** - mobile-first layout (table turns into stacked cards, board scrolls with snap), automatic dark mode, visible focus states, ARIA labels and reduced-motion support.

## Tech stack

React 18 - Vite 5 - Recharts - Vercel Serverless Functions - Vitest - plain CSS (custom properties, CSS grid, media queries)

## Project structure

```
api/jobs.js               Vercel serverless function (proxies + normalises the jobs API, CDN cached)
src/App.jsx               App state, CRUD, import/export
src/components/           Header, KpiCards, Filters, ChartsPanel, JobTable, Board, JobForm, Discover
src/lib/stats.js          Pure filtering + aggregation logic (unit tested)
src/lib/stats.test.js     Vitest tests
src/lib/storage.js        localStorage persistence with safe fallbacks
src/data/seed.js          Sample data (dates relative to today)
src/styles.css            Design tokens, light/dark themes, responsive layout
```

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173 - /api/jobs is proxied to Arbeitnow by Vite
npm test         # run unit tests
npm run build    # production build into dist/
```

## Deploy to Vercel

**Option A - GitHub (recommended)**

1. Create a new GitHub repo and push this folder:
   ```bash
   git init && git add . && git commit -m "JobTrail job tracker dashboard"
   git branch -M main
   git remote add origin https://github.com/<you>/job-tracker-dashboard.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), import the repo and click **Deploy**. Vercel detects Vite automatically and deploys `api/jobs.js` as a serverless function. No environment variables are needed.

**Option B - Vercel CLI**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```

Every push to `main` redeploys automatically.

## Design decisions

- **Serverless proxy instead of calling the API from the browser** - avoids CORS issues, lets the function reshape the payload into a small, stable format and adds `s-maxage` caching so repeat visits don't hit the upstream API.
- **Filtering and stats as pure functions** - `src/lib/stats.js` has no React dependencies, which keeps components simple and makes the logic easy to unit test.
- **Graceful degradation** - if storage is blocked the app keeps working in memory; if the jobs API is down the Discover tab shows a retry state and the tracker is unaffected.

## Ideas for next steps

- Swap `localStorage` for a small database (Supabase, Vercel KV) with auth to sync across devices
- Reminders for follow-ups and interview dates
- TypeScript migration and component tests with React Testing Library
- CSV export for spreadsheets
