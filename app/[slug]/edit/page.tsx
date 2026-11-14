import ProtectedEditPage from './ProtectedEditPage';
import { Block } from '@/types/schema';

interface EditPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { slug } = await params;

  // ProtectedEditPage fetches draft config from Postgres via API using orbit_session
  const initialData = {
    brand_color: '#3b82f6',
    logo_url: '',
    hero_background_url: '',
    config: [] as Block[],
  };

  return <ProtectedEditPage slug={slug} initialData={initialData} />;
}
