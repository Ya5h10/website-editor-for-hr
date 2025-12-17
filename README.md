# Orbit Careers Page Builder

Orbit is a mini‑SaaS for building branded careers pages. Recruiters can log in, design their public hiring page with reusable content blocks, and manage open roles. Jobseekers can browse a directory of companies and view each company’s live careers page.

Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Supabase** (Postgres + Storage), **react-hook-form**, and **zod**.

---

## Getting Started

### 1. Install dependencies

npm install### 2. Configure environment variables

Create `.env.local`:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key### 3. Run the dev server

npm run devOpen `http://localhost:3000`.

---

## Core Flows

### Landing Page (`/`)

- **I am a Jobseeker** → `/companies`
- **I am a Recruiter** → `/login`

### Company Directory (`/companies`)

- Server component
- Lists all companies with logo and name
- Each card links to `/${slug}`

### Recruiter Login (`/login`)

- Login via company slug + access code (`password_code` on `companies`)
- Stores `orbit_session` in `localStorage`
- Redirects to `/${slug}/edit`

### Editor (`/[slug]/edit`)

- Protected client page:
  - Validates `orbit_session` against URL slug
  - Fetches `page_configs` for the company:
    - `config` (array of blocks)
    - `brand_color`
    - `logo_url`
    - `hero_background_url`
- Renders:
  - `EditHeader` (Preview + Save Draft)
  - `EditorForm` (page builder + jobs manager)

#### Blocks in `EditorForm`

Stored in `page_configs.config` as an array of polymorphic blocks:

- `hero`
- `feature_split`
- `values_grid` (uses `items[].title`, `items[].text`, `items[].image_url`)
- `features` (uses `features[].title`, `features[].description`)

`EditorForm` uses `react-hook-form` + `zod` (`components/editor/schema.ts`) and normalizes `values_grid` items before saving so all three fields are always present.

#### Jobs

- `JobsManager` manages rows in the `jobs` table (title, location, work_policy, salary_range, etc.).
- Shown under the “Jobs” tab in the editor.

### Public Page (`/[slug]`)

- Server component:
  - Loads company by slug
  - Fetches `page_configs` + `jobs`
- Renders:
  - `PageHeader` – global hero using `brand_color`, `logo_url`, `hero_background_url`
  - `PageRenderer` – maps `config` blocks to UI
  - Jobs section with filters (search, location, salary)

---

## Project Structure (high level)

- `app/`
  - `page.tsx` – landing page
  - `companies/page.tsx` – company directory
  - `login/page.tsx` – recruiter login
  - `[slug]/(public)/page.tsx` – public careers page
  - `[slug]/edit/`
    - `page.tsx` – edit shell
    - `ProtectedEditPage.tsx` – auth + data fetch
    - `EditHeader.tsx` – top bar with Save/Preview
- `components/builder/`
  - `PageHeader.tsx`
  - `PageRenderer.tsx`
  - `blocks/` – `HeroBlock`, `FeatureSplitBlock`, `ValuesBlock`, `FeaturesBlock`
- `components/editor/`
  - `EditorForm.tsx`
  - `schema.ts`
  - `blocks/` – `HeroEditor`, `FeatureEditor`, `ValuesEditor`, `FeaturesEditor`
  - `inputs/` – `TextInput`, `ImageUpload`
  - `JobsManager.tsx`
- `types/schema.ts` – shared TS types for blocks, `PageConfig`, `Company`, `Job`

---

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – run production server
- `npm run lint` – lint the project