import ProtectedEditPage from './ProtectedEditPage';
import { Block } from '@/types/schema';

export const runtime = 'edge';

interface EditPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { slug } = await params;
  
  // ProtectedEditPage will fetch the data from Supabase using the session
  // Pass empty initial data - it will be populated by ProtectedEditPage
  const initialData = {
    brand_color: '#3b82f6',
    logo_url: '',
    hero_background_url: '',
    config: [] as Block[],
  };

  return <ProtectedEditPage slug={slug} initialData={initialData} />;
}

