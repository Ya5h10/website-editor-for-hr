## Assumptions
* **Users:** We assume users are from non tech background who want to personalize a simple hiring page quickly.
* **Database:** We rely on Supabase for everything (Extremely fast and easy to setup for the assignment or would have gone with postgresql, prisma, s3 buckets)
* **Content:** We assume companies will upload reasonable image sizes (under 5MB).

## Architecture
* **Frontend:** Next.js (App Router). This handles all the pages, routing, and API calls.
* **Hosting:** Cloudflare Pages. It's fast and runs on the "Edge" (servers everywhere, also free).
* **Backend/DB:** Supabase (PostgreSQL).
    * **Auth:** Supabase Auth handles user login/signup.
    * **Storage:** Supabase Storage buckets hold the company logos and images.
    * **Database:** Stores the company info, page config (JSON), and job details.
* **Styling:** Tailwind CSS.

### Data Flow
1.  **User Visits:** A visitor goes to `hr.yashmakwana.com/orbit/careers`.
2.  **Edge Request:** Cloudflare intercepts the request.
3.  **DB Fetch:** The app asks Supabase for the given company's json
4.  **Render:** Next.js builds the page using the JSON config blocks (Hero, Features, Values).
5.  **Display:** The user sees the fully styled page.

## Database Schema

### `companies` table
* `id` (UUID): Unique ID for the company.
* `name` (Text): Company Name (e.g., "Orbit").
* `slug` (Text): URL handle (e.g., "orbit"). Unique.
* `logo_url` (Text): Link to the logo image.
* `created_at` (Timestamp): When they signed up.

### `page_configs` table
* `company_id` (UUID): Links to the `companies` table.
* `brand_color` (Text): Hex code (e.g., "#000000").
* `hero_background_url` (Text): Optional background image for the top section.
* `config` (JSONB): The Draft version. Stores the array of blocks (Hero, Features, Grid).
* `published_config` (JSONB): The Live version. This is what visitors see.
* `updated_at` (Timestamp): Last time they saved.

### `jobs` table
* `id` (UUID): Unique Job ID.
* `company_id` (UUID): Who is hiring.
* `title` (Text): Job Title (e.g., "Frontend Dev").
* `location` (Text): Remote / NYC.
* `type` (Text): Full-time / Contract.
* `description` (Text): Full HTML/Markdown description.
* `application_link` (Text): Where to apply.

## Test Plan

### Manual Testing Checklist
1.  **Onboarding:**
    * Create a new account.
    * Check if the default data (Hero block) is created automatically.
2.  **Editor:**
    * Change the "Hero" text and click Save. Refresh page. Does it persist?
    * Upload a logo. Does the image appear?
    * Add a "Values Grid" block. Add 3 cards. Save.
    * Delete a block. Save.
3.  **Publishing:**
    * Make a change in Draft (e.g., change title to "Draft Title").
    * Check the "Live" link. It should **not** show the change yet.
    * Click "Publish".
    * Check the "Live" link. Now it should show "Draft Title".
4.  **Public Page:**
    * Go to `/[slug]/careers`.
    * Resize browser to mobile width. Do the grids stack correctly?
    * Check loading speed.