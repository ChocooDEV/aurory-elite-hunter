# Aurory Elites Hunt

Defeat the Elites to earn points and climb the leaderboard!

This is a full-stack Next.js app for the Aurory Elites Hunt event, featuring a real-time leaderboard, badge system, and admin tools. Players can challenge Elite players, earn points, and unlock badges by achieving milestones. The app uses Prisma with PostgreSQL for data management and Supabase for additional integrations.

## Features

- **Leaderboard**: Live leaderboards for both Elites and Hunters, with ranks, points, badges, and avatars.
- **Badges**: Earn unique badges by defeating Elites or reaching win milestones. Badges are displayed on the leaderboard and badge page.
- **Admin Panel**: Secure admin page to edit Elite player properties (points per loss, badges, etc.).
- **Automated Updates**: Cron job fetches match data from the Aurory API and updates points, badges, and player stats.
- **Event Rules & Rewards**: Dedicated page explaining event rules, badge requirements, and prize structure.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Prisma ORM](https://www.prisma.io/) with PostgreSQL
- [Supabase](https://supabase.com/) (optional integrations)
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up your environment:**
   - Copy `.env.example` to `.env` and fill in your database and Supabase credentials.
   - Example variables:
     - `DATABASE_URL=postgresql://...`
     - `SUPABASE_URL=...`
     - `SUPABASE_ANON_KEY=...`
     - `ADMIN_PASSWORD=your_admin_password`

3. **Run database migrations and seed data:**
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` — Next.js app directory (pages, API routes, admin, leaderboard, badges)
- `prisma/` — Prisma schema and seed scripts
- `lib/` — Database and Supabase client setup
- `public/` — Static assets (badge images, icons)

## API Endpoints

- `/api/leaderboard` — Get leaderboard data for Elites and Hunters
- `/api/admin/update-elite` — Admin: update Elite player properties (POST)
- `/api/admin/update-elite` — Admin: get all Elite players (GET)
- `/api/cron/update-leaderboard` — Cron job: update leaderboard from external API

## Event Rules & Badges

See the [Badges & Rules page](http://localhost:3000/badges) in the app for full details on how to earn points and badges, and the event's prize structure.

## License

MIT
