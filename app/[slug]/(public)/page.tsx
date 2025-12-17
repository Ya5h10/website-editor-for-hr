import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import PageRenderer from '@/components/builder/PageRenderer';
import PageHeader from '@/components/builder/PageHeader';
import { Block, Job } from '@/types/schema';

interface PublicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getCompanyData(slug: string) {
  // Initialize Supabase client (Server Side)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // First, get the company by slug
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('id, slug')
    .eq('slug', slug)
    .single();

  if (companyError || !company) {
    return null;
  }

  // Then fetch page_configs and jobs for this company
  const [pageConfigResult, jobsResult] = await Promise.all([
    supabase
      .from('page_configs')
      .select('config, brand_color, logo_url, hero_background_url')
      .eq('company_id', company.id)
      .single(),
    supabase
      .from('jobs')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false }),
  ]);

  return {
    ...company,
    page_configs: pageConfigResult.data,
    jobs: jobsResult.data || [],
  };
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { slug } = await params;
  const companyData = await getCompanyData(slug);

  if (!companyData) {
    notFound();
  }

  // Extract data
  const pageConfig = companyData.page_configs;
  const jobs = (companyData.jobs || []) as Job[];
  
  // Parse config if it's a string, otherwise use directly
  // Keep hero blocks (they're optional content sections, separate from global header)
  let blocks: Block[] = [];
  if (pageConfig?.config) {
    if (typeof pageConfig.config === 'string') {
      try {
        blocks = JSON.parse(pageConfig.config);
      } catch (e) {
        console.error('Error parsing config:', e);
        blocks = [];
      }
    } else if (Array.isArray(pageConfig.config)) {
      blocks = pageConfig.config;
    }
  }
  
  const brandColor = pageConfig?.brand_color || '#3b82f6';
  const logoUrl = pageConfig?.logo_url;
  const heroBackgroundUrl = pageConfig?.hero_background_url;

  return (
    <>
      <PageHeader 
        logo={logoUrl} 
        brandColor={brandColor} 
        backgroundUrl={heroBackgroundUrl}
      />
      <PageRenderer blocks={blocks} brandColor={brandColor} jobs={jobs} />
    </>
  );
}
