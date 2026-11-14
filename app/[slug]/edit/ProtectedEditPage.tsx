'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import FramerEditorShell from '@/components/framer-editor/FramerEditorShell';
import { Block } from '@/types/schema';

interface ProtectedEditPageProps {
  slug: string;
  initialData: { 
    brand_color?: string;
    logo_url?: string;
    config: Block[];
  };
}

export default function ProtectedEditPage({ slug, initialData }: ProtectedEditPageProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    brand_color: string;
    logo_url: string;
    hero_background_url: string;
    config: Block[];
  } | null>(null);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return supabaseUrl && supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey)
      : null;
  }, []);

  useEffect(() => {
    const sessionData = localStorage.getItem('orbit_session');
    
    if (!sessionData) {
      // Fall through to Framer editor demo shell without company data
      setIsChecking(false);
      setIsLoading(false);
      setFormData({
        brand_color: initialData.brand_color || '#3b82f6',
        logo_url: '',
        hero_background_url: '',
        config: initialData.config || [],
      });
      return;
    }

    try {
      const session = JSON.parse(sessionData);
      
      if (session.company_slug !== slug) {
        router.push('/login');
        return;
      }

      setCompanyId(session.company_id);
      setIsChecking(false);
    } catch (err) {
      console.error('Error parsing session:', err);
      setIsChecking(false);
      setIsLoading(false);
      setFormData({
        brand_color: '#3b82f6',
        logo_url: '',
        hero_background_url: '',
        config: [],
      });
    }
  }, [slug, router, initialData]);

  useEffect(() => {
    if (!companyId || !supabase || isChecking) return;

    let isMounted = true;

    const fetchPageConfig = async () => {
      try {
        setIsLoading(true);
        const { data: pageConfig, error } = await supabase
          .from('page_configs')
          .select('config, brand_color, logo_url, hero_background_url')
          .eq('company_id', companyId)
          .single();

        if (!isMounted) return;

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching page config:', error);
        }

        let contentBlocks: Block[] = [];
        if (pageConfig?.config) {
          if (typeof pageConfig.config === 'string') {
            try {
              contentBlocks = JSON.parse(pageConfig.config);
            } catch (e) {
              console.error('Error parsing config:', e);
              contentBlocks = [];
            }
          } else if (Array.isArray(pageConfig.config)) {
            contentBlocks = pageConfig.config;
          }
        }

        if (isMounted) {
          setFormData({
            brand_color: pageConfig?.brand_color || '#3b82f6',
            logo_url: pageConfig?.logo_url || '',
            hero_background_url: pageConfig?.hero_background_url || '',
            config: contentBlocks,
          });
        }
      } catch (err) {
        console.error('Error fetching page config:', err);
        if (isMounted) {
          setFormData({
            brand_color: '#3b82f6',
            logo_url: '',
            hero_background_url: '',
            config: [],
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPageConfig();

    return () => {
      isMounted = false;
    };
  }, [companyId, supabase, isChecking]);

  if (isChecking || isLoading) {
    return (
      <div className="framer-editor fixed inset-0 flex items-center justify-center bg-black">
        <p className="text-[#888] text-sm">Loading…</p>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  const handlePreview = () => {
    window.open(`/${slug}/careers?preview=true`, '_blank');
  };

  const handlePublish = async () => {
    setPublishStatus('publishing');
    // Trigger existing editor publish handler if present
    const publishHandler = (window as unknown as { __editorFormPublishHandler?: () => Promise<void> }).__editorFormPublishHandler;
    try {
      if (publishHandler) {
        await publishHandler();
      }
      setPublishStatus('published');
      setTimeout(() => setPublishStatus('idle'), 1500);
    } catch {
      setPublishStatus('idle');
    }
  };

  const publishLabel =
    publishStatus === 'publishing'
      ? 'Publishing…'
      : publishStatus === 'published'
      ? 'Published'
      : 'Publish';

  return (
    <FramerEditorShell
      projectName={slug || 'Site'}
      branchName="main"
      onPreview={handlePreview}
      onPublish={handlePublish}
      publishLabel={publishLabel}
      publishDisabled={publishStatus === 'publishing'}
    />
  );
}
