# Orbit Careers Page Builder

Orbit is a mini‑SaaS for building branded careers pages. Recruiters can log in, design their public hiring page with reusable content blocks, and manage open roles. Jobseekers can browse a directory of companies and view each company’s live careers page.

Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **PostgreSQL** (`pg`), **react-hook-form**, and **zod**. The full stack runs with Docker Compose.

---

## Quick start (Docker)

```bash
docker compose up --build
```

Then open [http://localhost:3000](http://localhost:3000).

Compose runs `db` (Postgres 16) and `app` (Next.js standalone). The app uses `network_mode: service:db` so it reaches Postgres on `127.0.0.1` inside the shared network namespace (ports `3000` and `5432` are published on the `db` service).

**Seed login**

| Field | Value |
| --- | --- |
| Company slug | `orbit` |
| Access code | `demo123` |

Schema + seed data load automatically from `db/init.sql` the first time the Postgres volume is created.

---

## Environment variables

Copy `.env.example` for local (non-Docker) runs:

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string, e.g. `postgresql://orbit:orbit@localhost:5432/orbit` |
| `UPLOAD_DIR` | no | Filesystem directory for uploaded images (default `./public/uploads`; Docker uses `/app/uploads`) |
| `DATABASE_SSL` | no | Set to `true` if Postgres requires SSL |

There are **no Supabase** env vars.

Compose sets `DATABASE_URL` and `UPLOAD_DIR` for the `app` service automatically.

---

## Local development (without Docker app)

1. Start Postgres (for example via Compose DB only):

   ```bash
   docker compose up -d db
   ```

2. Install and run:

   ```bash
   cp .env.example .env.local
   npm install
   npm run dev
   ```

Open `http://localhost:3000`.

Production-style Node build (what Docker uses):

```bash
npm run build:app
npm start
```

> `npm run build` / `pages:build` still invoke the Cloudflare Pages adapter for the existing Pages deploy path. Docker uses `build:app` (`next build` + standalone output).

---

## Storage

Image uploads no longer use Supabase Storage. Files are written to a local directory:

- API: `POST /api/uploads` (multipart form field `file`)
- Public URL: `/uploads/<filename>` (served by `app/uploads/[...path]/route.ts`)
- Docker volume: `uploads_data` → `/app/uploads`

---

## Auth / session

Recruiter login still uses **company slug + access code** (`password_code` on `companies`).

- `POST /api/auth/login` validates against Postgres
- Client stores `orbit_session` in `localStorage` (`company_id`, `company_slug`)
- `/[slug]/edit` checks that the session slug matches the URL

---

## Core flows

### Landing Page (`/`)

- **I am a Jobseeker** → `/companies`
- **I am a Recruiter** → `/login`

### Company Directory (`/companies`)

- Server component reads companies + logos from Postgres

### Public Page (`/[slug]/careers`)

- Loads company, draft/published `page_configs`, and `jobs` from Postgres
- `?preview=true` shows draft `config`; otherwise `published_config`

### Editor

- Framer-style shell at `/editor` and `/[slug]/edit`
- Classic block editor helpers (`EditorForm`, `JobsManager`, `ImageUpload`) talk to `/api/*` against Postgres

---

## Project structure (high level)

- `app/` – App Router pages + `app/api/*` JSON routes
- `lib/db.ts` – `pg` pool
- `lib/data.ts` – SQL helpers (companies, page configs, jobs)
- `lib/uploads.ts` – local filesystem uploads
- `db/init.sql` – schema + seed
- `Dockerfile` / `docker-compose.yml` – app + Postgres
- `components/builder/` – public page renderer
- `components/editor/` – form/jobs/upload helpers
- `components/framer-editor/` – Framer UI copy shell

---

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build:app` | `next build` (standalone, Docker) |
| `npm start` | Run production Next server |
| `npm run lint` | ESLint |
| `npm run build` / `pages:build` | Cloudflare Pages adapter build |

---

## Database schema

See `db/init.sql` and `tech_spec.md`. Tables: `companies`, `page_configs`, `jobs`.
