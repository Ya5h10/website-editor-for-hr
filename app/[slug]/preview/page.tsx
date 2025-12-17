import Link from 'next/link';
import PageRenderer from '@/components/builder/PageRenderer';
import { Block } from '@/types/schema';
import { ArrowLeft } from 'lucide-react';

// TODO: Replace with actual Supabase fetch
// This is dummy data for now
const getDraftConfig = async (slug: string): Promise<{
  blocks: Block[];
  brandColor: string;
}> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    blocks: [
      {
        id: '1',
        type: 'hero',
        heading: 'Join Our Team',
        subheading: 'Build the future with us',
      },
      {
        id: '2',
        type: 'feature_split',
        layout: 'image_right',
        heading: 'Why Work With Us',
        content:
          'We offer a collaborative environment where innovation thrives and your ideas matter.',
        imageUrl: undefined,
      },
      {
        id: '3',
        type: 'values_grid',
        heading: 'Our Values',
        items: [
          {
            title: 'Innovation',
            text: 'We push boundaries and think outside the box.',
          },
          {
            title: 'Collaboration',
            text: 'Together we achieve more than we ever could alone.',
          },
          {
            title: 'Growth',
            text: 'We invest in your personal and professional development.',
          },
        ],
      },
    ] as Block[],
    brandColor: '#3b82f6',
  };
};

interface PreviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const { blocks, brandColor } = await getDraftConfig(slug);

  return (
    <div className="min-h-screen">
      {/* Fixed Preview Banner */}
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

      {/* Content with top padding to account for fixed banner */}
      <div className="pt-14">
        <PageRenderer blocks={blocks} brandColor={brandColor} />
      </div>
    </div>
  );
}

