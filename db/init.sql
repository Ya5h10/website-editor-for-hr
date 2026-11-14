-- Orbit Careers schema (Postgres, no Supabase)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  password_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_configs (
  company_id UUID PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
  brand_color TEXT DEFAULT '#3b82f6',
  logo_url TEXT,
  hero_background_url TEXT,
  config JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_config JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  work_policy TEXT NOT NULL DEFAULT 'Remote',
  department TEXT NOT NULL DEFAULT '',
  employment_type TEXT NOT NULL DEFAULT 'Full-time',
  experience_level TEXT NOT NULL DEFAULT '',
  job_type TEXT NOT NULL DEFAULT 'Permanent',
  salary_range TEXT,
  job_slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);

-- Seed demo company (slug: orbit, access code: demo123)
INSERT INTO companies (id, name, slug, password_code)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Orbit',
  'orbit',
  'demo123'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO page_configs (company_id, brand_color, config, published_config)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '#3b82f6',
  '[
    {
      "id": "seed-hero",
      "type": "hero",
      "heading": "Join Orbit",
      "subheading": "Build the future of hiring pages with us."
    },
    {
      "id": "seed-values",
      "type": "values_grid",
      "heading": "Our Values",
      "items": [
        { "title": "Clarity", "text": "Simple tools for complex hiring.", "image_url": "" },
        { "title": "Speed", "text": "Ship careers pages in minutes.", "image_url": "" },
        { "title": "Craft", "text": "Brand-first design without the friction.", "image_url": "" }
      ]
    }
  ]'::jsonb,
  '[
    {
      "id": "seed-hero",
      "type": "hero",
      "heading": "Join Orbit",
      "subheading": "Build the future of hiring pages with us."
    },
    {
      "id": "seed-values",
      "type": "values_grid",
      "heading": "Our Values",
      "items": [
        { "title": "Clarity", "text": "Simple tools for complex hiring.", "image_url": "" },
        { "title": "Speed", "text": "Ship careers pages in minutes.", "image_url": "" },
        { "title": "Craft", "text": "Brand-first design without the friction.", "image_url": "" }
      ]
    }
  ]'::jsonb
)
ON CONFLICT (company_id) DO NOTHING;

INSERT INTO jobs (
  company_id, title, location, work_policy, department, employment_type,
  experience_level, job_type, salary_range, job_slug, description
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Senior Frontend Engineer',
  'Remote',
  'Remote',
  'Engineering',
  'Full-time',
  'Senior',
  'Permanent',
  '$140k - $180k',
  'senior-frontend-engineer',
  'Help build the Orbit careers page builder.'
)
ON CONFLICT DO NOTHING;
