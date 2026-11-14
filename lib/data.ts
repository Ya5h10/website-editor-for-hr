import { query } from './db';
import type { Block, Job } from '@/types/schema';

export interface CompanyRow {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  password_code?: string;
  created_at?: string;
}

export interface PageConfigRow {
  company_id: string;
  brand_color: string | null;
  logo_url: string | null;
  hero_background_url: string | null;
  config: Block[] | string | null;
  published_config: Block[] | string | null;
  updated_at?: string;
}

function parseBlocks(value: unknown): Block[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as Block[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function findCompanyBySlug(slug: string): Promise<CompanyRow | null> {
  const result = await query<CompanyRow>(
    `SELECT id, name, slug, logo_url, created_at
     FROM companies
     WHERE slug = $1
     LIMIT 1`,
    [slug]
  );
  return result.rows[0] ?? null;
}

export async function authenticateCompany(
  slug: string,
  accessCode: string
): Promise<Pick<CompanyRow, 'id' | 'slug'> | null> {
  const result = await query<Pick<CompanyRow, 'id' | 'slug'>>(
    `SELECT id, slug
     FROM companies
     WHERE slug = $1 AND password_code = $2
     LIMIT 1`,
    [slug.trim().toLowerCase(), accessCode]
  );
  return result.rows[0] ?? null;
}

export async function listCompaniesWithLogos(): Promise<
  Array<{ id: string; name: string; slug: string; logo_url?: string }>
> {
  const result = await query<{
    id: string;
    name: string;
    slug: string;
    company_logo: string | null;
    config_logo: string | null;
  }>(
    `SELECT c.id, c.name, c.slug, c.logo_url AS company_logo, pc.logo_url AS config_logo
     FROM companies c
     LEFT JOIN page_configs pc ON pc.company_id = c.id
     ORDER BY c.name ASC`
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    logo_url: row.config_logo || row.company_logo || undefined,
  }));
}

export async function getPageConfig(companyId: string): Promise<PageConfigRow | null> {
  const result = await query<PageConfigRow>(
    `SELECT company_id, brand_color, logo_url, hero_background_url, config, published_config, updated_at
     FROM page_configs
     WHERE company_id = $1
     LIMIT 1`,
    [companyId]
  );
  return result.rows[0] ?? null;
}

export async function updatePageConfigDraft(
  companyId: string,
  data: {
    config: Block[];
    brand_color: string;
    logo_url: string | null;
    hero_background_url: string | null;
  }
) {
  const result = await query(
    `UPDATE page_configs
     SET config = $2::jsonb,
         brand_color = $3,
         logo_url = $4,
         hero_background_url = $5,
         updated_at = NOW()
     WHERE company_id = $1`,
    [
      companyId,
      JSON.stringify(data.config),
      data.brand_color,
      data.logo_url,
      data.hero_background_url,
    ]
  );

  // If the company has no page_configs row yet, create one (avoids silent no-op saves).
  if (result.rowCount === 0) {
    await query(
      `INSERT INTO page_configs (company_id, brand_color, logo_url, hero_background_url, config, published_config)
       VALUES ($1, $2, $3, $4, $5::jsonb, '[]'::jsonb)
       ON CONFLICT (company_id) DO UPDATE SET
         config = EXCLUDED.config,
         brand_color = EXCLUDED.brand_color,
         logo_url = EXCLUDED.logo_url,
         hero_background_url = EXCLUDED.hero_background_url,
         updated_at = NOW()`,
      [
        companyId,
        data.brand_color,
        data.logo_url,
        data.hero_background_url,
        JSON.stringify(data.config),
      ]
    );
  }
}

export async function publishPageConfig(companyId: string) {
  await query(
    `UPDATE page_configs
     SET published_config = config,
         updated_at = NOW()
     WHERE company_id = $1`,
    [companyId]
  );
}

export async function listJobs(companyId: string): Promise<Job[]> {
  const result = await query<Job>(
    `SELECT id, company_id, title, location, work_policy, department, employment_type,
            experience_level, job_type, salary_range, job_slug, description,
            created_at::text AS created_at
     FROM jobs
     WHERE company_id = $1
     ORDER BY created_at DESC`,
    [companyId]
  );
  return result.rows;
}

export async function createJob(
  companyId: string,
  job: Omit<Job, 'id' | 'company_id' | 'created_at'>
): Promise<Job> {
  const result = await query<Job>(
    `INSERT INTO jobs (
       company_id, title, location, work_policy, department, employment_type,
       experience_level, job_type, salary_range, job_slug, description
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING id, company_id, title, location, work_policy, department, employment_type,
               experience_level, job_type, salary_range, job_slug, description,
               created_at::text AS created_at`,
    [
      companyId,
      job.title,
      job.location,
      job.work_policy,
      job.department,
      job.employment_type,
      job.experience_level,
      job.job_type,
      job.salary_range || null,
      job.job_slug,
      job.description || null,
    ]
  );
  return result.rows[0];
}

export async function deleteJob(jobId: string) {
  await query(`DELETE FROM jobs WHERE id = $1`, [jobId]);
}

export async function getCompanyPublicData(slug: string) {
  const company = await findCompanyBySlug(slug);
  if (!company) return null;

  const [pageConfig, jobs] = await Promise.all([
    getPageConfig(company.id),
    listJobs(company.id),
  ]);

  return {
    ...company,
    page_configs: pageConfig
      ? {
          ...pageConfig,
          config: parseBlocks(pageConfig.config),
          published_config: parseBlocks(pageConfig.published_config),
        }
      : null,
    jobs,
  };
}

export { parseBlocks };
