import { notFound } from 'next/navigation';
import PageRenderer from '@/components/builder/PageRenderer';
import PageHeader from '@/components/builder/PageHeader';
import { Block, Job } from '@/types/schema';
import { getCompanyPublicData } from '@/lib/data';

interface PublicPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    preview?: string;
  }>;
}

export default async function PublicPage({ params, searchParams }: PublicPageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  const companyData = await getCompanyPublicData(slug);

  if (!companyData) {
    notFound();
  }

  const pageConfig = companyData.page_configs;
  const jobs = (companyData.jobs || []) as Job[];

  const contentBlocks = isPreview
    ? pageConfig?.config
    : pageConfig?.published_config || [];

  console.log(`Rendering mode: ${isPreview ? 'PREVIEW (Draft)' : 'LIVE (Published)'}`);

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
  const logoUrl = pageConfig?.logo_url || undefined;
  const heroBackgroundUrl = pageConfig?.hero_background_url || undefined;

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
