'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import EditorForm from '@/components/editor/EditorForm';
import EditHeader from './EditHeader';
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

  // Memoize Supabase client to prevent recreation on every render
  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return supabaseUrl && supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey)
      : null;
  }, []);

  useEffect(() => {
    // Check authentication
    const sessionData = localStorage.getItem('orbit_session');
    
    if (!sessionData) {
      router.push('/login');
      return;
    }

    try {
      const session = JSON.parse(sessionData);
      
      // Verify the slug matches the session
      if (session.company_slug !== slug) {
        router.push('/login');
        return;
      }

      setCompanyId(session.company_id);
      setIsChecking(false);
    } catch (err) {
      console.error('Error parsing session:', err);
      router.push('/login');
    }
  }, [slug, router]);

  // Fetch page config data after authentication
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
          // PGRST116 is "not found" - that's okay, we'll use defaults
          console.error('Error fetching page config:', error);
        }

        // Parse config if it's a string, otherwise use directly
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
            config: contentBlocks, // Use config instead of content_blocks
          });
        }
      } catch (err) {
        console.error('Error fetching page config:', err);
        // Use defaults on error
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!companyId || !formData) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen">
      <EditHeader slug={slug} />
      {/* Main Editor Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EditorForm initialData={formData} companyId={companyId} />
      </main>
    </div>
  );
}

