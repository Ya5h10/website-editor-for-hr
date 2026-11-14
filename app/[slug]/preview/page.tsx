import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageRenderer from '@/components/builder/PageRenderer';
import { Block } from '@/types/schema';
import { ArrowLeft } from 'lucide-react';
import { getCompanyPublicData } from '@/lib/data';

interface PreviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const companyData = await getCompanyPublicData(slug);

  if (!companyData) {
    notFound();
  }

  const pageConfig = companyData.page_configs;
  const blocks = (pageConfig?.config || []) as Block[];
  const brandColor = pageConfig?.brand_color || '#3b82f6';

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                Preview Mode
              </span>
            </div>
            <Link
              href={`/${slug}/edit`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 glass-panel rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-14">
        <PageRenderer blocks={blocks} brandColor={brandColor} />
      </div>
    </div>
  );
}
