## Assumptions
* **Users:** We assume users are from non tech background who want to personalize a simple hiring page quickly.
* **Database:** PostgreSQL via the Node `pg` client (Docker Compose for local/prod-like runs).
* **Content:** We assume companies will upload reasonable image sizes (under 5MB).

## Architecture
* **Frontend:** Next.js (App Router). This handles all the pages, routing, and API calls.
* **Hosting:** Docker Compose (Next.js Node server + Postgres). Cloudflare Pages adapter remains available for the existing Pages deploy path.
* **Backend/DB:** PostgreSQL.
    * **Auth:** Company slug + access code (`password_code`); client stores `orbit_session` in `localStorage`.
    * **Storage:** Local filesystem directory (`UPLOAD_DIR`, Docker volume `uploads_data`).
    * **Database:** Stores the company info, page config (JSON), and job details.
* **Styling:** Tailwind CSS.

### Data Flow
1.  **User Visits:** A visitor goes to `/[slug]/careers`.
2.  **Server Request:** Next.js Node server handles the request.
3.  **DB Fetch:** The app queries Postgres for the company's page config + jobs.
4.  **Render:** Next.js builds the page using the JSON config blocks (Hero, Features, Values).
5.  **Display:** The user sees the fully styled page.

## Database Schema

### `companies` table
* `id` (UUID): Unique ID for the company.
* `name` (Text): Company Name (e.g., "Orbit").
* `slug` (Text): URL handle (e.g., "orbit"). Unique.
* `logo_url` (Text): Optional company logo.
* `password_code` (Text): Access code for recruiter login.
* `created_at` (Timestamp): When they signed up.

### `page_configs` table
* `company_id` (UUID): Links to the `companies` table.
* `brand_color` (Text): Hex code (e.g., "#000000").
* `logo_url` (Text): Optional logo for the page header.
* `hero_background_url` (Text): Optional background image for the top section.
* `config` (JSONB): The Draft version. Stores the array of blocks (Hero, Features, Grid).
* `published_config` (JSONB): The Live version. This is what visitors see.
* `updated_at` (Timestamp): Last time they saved.

### `jobs` table
* `id` (UUID): Unique Job ID.
* `company_id` (UUID): Who is hiring.
* `title` (Text): Job Title (e.g., "Frontend Dev").
* `location` (Text): Remote / NYC.
* `work_policy` / `department` / `employment_type` / `experience_level` / `job_type` / `salary_range` / `job_slug` / `description`.
* `created_at` (Timestamp).

## Test Plan

### Manual Testing Checklist
1.  **Onboarding / login:**
    * Log in with slug `orbit` and access code `demo123`.
    * Confirm redirect to `/orbit/edit` and `orbit_session` in localStorage.
2.  **Editor:**
    * Change draft content via classic editor APIs / publish from shell.
    * Upload a logo via `/api/uploads`. Confirm `/uploads/...` serves the file.
3.  **Publishing:**
    * Save draft, confirm public page without `?preview=true` still shows published config.
    * Publish, confirm live page updates.
4.  **Public Page:**
    * Go to `/orbit/careers`.
    * Resize browser to mobile width.
5.  **Docker:**
    * `docker compose up --build`
    * `GET /api/health` returns `{ ok: true, db: "up" }`
