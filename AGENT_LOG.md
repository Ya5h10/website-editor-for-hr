How I used AI tools (Gemini & Cursor) to build this project. I treated AI as a senior pair programmer to bounce ideas off it, debugging specific errors, and refactoring code.

## Key Decisions & Architecture

### Frontend Stack
* **Decision:** I chose **Next.js (App Router)** + **Tailwind CSS**.
* **Why:** I needed Server Components for the public pages (SEO, speed) but Client Components for the rich text editor.
* **AI Role:** I asked AI to generate the initial "PageRenderer" component that dynamically switches between blocks (`Hero`, `Features`, `Grid`) based on the data type.

### Database Schema (The "JSONB" Pivot)
* **Initial Thought:** Create separate tables for `hero_sections`, `feature_lists`, `values_grids`, etc.
* **AI Discussion:** I asked, "How do I design a schema for a page builder where users can reorder blocks?"
* **Answer:** AI suggested using a single **JSONB column (`config`)**.
    * *Pro:* Super flexible. I can add new block types without running a database migration.
    * *Con:* Losing strict SQL validation, but worth it for a CMS.

## Troubleshooting & Refinements

### 1. Values Grid Bug
* **Issue:** I created a Values Grid component to display company values. I could upload images, but whenever I typed a Title or Description, the text disappeared or didn't save.
* **Debugging:** I pasted the code into the chat. AI spotted two things:
    1.  **State Mutation:** I was modifying the array directly instead of creating a copy.
    2.  **Key Mismatch:** My backend expected the key `values`, but my frontend was sending `items`.
* **The Fix:** We rewrote the update handler to use `.map()` for clean state updates and wrote on the `items` key for the editor.

### 2. Routing to `/careers`
* **The Problem:** I initially built the public page at `/[slug]` (e.g., `orbit.com/google`). I realized this was not mentioned in the assignment rather had to use `/careers`
* **The Fix:** I asked AI to move the file structure to `/[slug]/careers/page.tsx`.
* **AI Help:** It quickly refactored the code to make it work.

### 3. Cloudflare Deployment
* **The Error:** "Routes were not configured to run with the Edge Runtime."
* **The Struggle:** I added `export const runtime = 'edge'` to the pages, but the build still failed. It felt like an infinite loop of errors.
* **The Breakthrough:** AI identified that Next.js on Cloudflare needs a bridge for Node.js features.
* **The Solution:**
    1.  Added `nodejs_compat` to the compatibility flags in Cloudflare.
    2.  Created a `wrangler.toml` file to force these settings on every deploy.
    3.  This finally got the build to pass.

## Learnings
* **Context:** AI couldn't fix the Values Grid until I showed it the *backend* JSON structure alongside the *frontend* React code.
* **Deployment of Next.js code:** First time using *Next.js*, there were problems but it was fun and learned new things on the build.