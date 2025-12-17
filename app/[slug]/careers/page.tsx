import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import PageRenderer from '@/components/builder/PageRenderer';
import PageHeader from '@/components/builder/PageHeader';
import { Block, Job } from '@/types/schema';

export const runtime = 'edge';

interface PublicPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    preview?: string;
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
      .select('config, published_config, brand_color, logo_url, hero_background_url')
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

export default async function PublicPage({ params, searchParams }: PublicPageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';
  
  const companyData = await getCompanyData(slug);

  if (!companyData) {
    notFound();
  }

  // Extract data
  const pageConfig = companyData.page_configs;
  const jobs = (companyData.jobs || []) as Job[];
  
  // Check if we are in Preview Mode
  // LOGIC:
  // 1. If Preview Mode -> Use Draft ('config')
  // 2. If Normal Mode -> Use Live ('published_config')
  // 3. Fallback -> Empty array (don't show draft to public if not published)
  const contentBlocks = isPreview 
    ? pageConfig?.config 
    : (pageConfig?.published_config || []);

  // Debug log (Server-side only)
  console.log(`Rendering mode: ${isPreview ? 'PREVIEW (Draft)' : 'LIVE (Published)'}`);
  
  // Parse config if it's a string, otherwise use directly
  let blocks: Block[] = [];
  if (contentBlocks) {
    if (typeof contentBlocks === 'string') {
      try {
        blocks = JSON.parse(contentBlocks);
      } catch (e) {
        console.error('Error parsing config:', e);
        blocks = [];
      }
    } else if (Array.isArray(contentBlocks)) {
      blocks = contentBlocks;
    }
  }
  
  const brandColor = pageConfig?.brand_color || '#3b82f6';
  const logoUrl = pageConfig?.logo_url;
  const heroBackgroundUrl = pageConfig?.hero_background_url;

  return (
    <>
      {isPreview && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-semibold shadow-lg">
          Preview Mode
        </div>
      )}
      <PageHeader 
        logo={logoUrl} 
        brandColor={brandColor} 
        backgroundUrl={heroBackgroundUrl}
      />
      <PageRenderer blocks={blocks} brandColor={brandColor} jobs={jobs} />
    </>
  );
}

