'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import FramerEditorShell from '@/components/framer-editor/FramerEditorShell';
import {
  blocksToCanvasElements,
  canvasElementsToBlocks,
  extractBrandColor,
} from '@/components/framer-editor/orbitBridge';
import type { CanvasElement } from '@/components/framer-editor/types';
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    const sessionData = localStorage.getItem('orbit_session');

    if (!sessionData) {
      // Demo shell without company session
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
    if (!companyId || isChecking) return;

    let isMounted = true;

    const fetchPageConfig = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/page-configs/${companyId}`);
        const pageConfig = response.ok ? await response.json() : null;

        if (!isMounted) return;

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
  }, [companyId, isChecking]);

  const canvasElements = useMemo(() => {
    if (!formData) return undefined;
    if (!companyId) return undefined; // unauthenticated demo keeps HAUS defaults
    return blocksToCanvasElements(formData.config, formData.brand_color);
  }, [formData, companyId]);

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

  const persistDraft = async (elements: CanvasElement[]) => {
    if (!companyId) return;

    const blocks = canvasElementsToBlocks(elements);
    const brand_color = extractBrandColor(elements, formData.brand_color);

    const response = await fetch(`/api/page-configs/${companyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config: blocks,
        brand_color,
        logo_url: formData.logo_url || null,
        hero_background_url: formData.hero_background_url || null,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'Failed to save draft');
    }

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            brand_color,
            config: blocks,
          }
        : prev
    );
  };

  const handlePreview = () => {
    window.open(`/${slug}/careers?preview=true`, '_blank');
  };

  const handleSaveDraft = async (elements: CanvasElement[]) => {
    if (!companyId) return;
    setSaveStatus('saving');
    try {
      await persistDraft(elements);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (error) {
      console.error('Save draft error:', error);
      alert(error instanceof Error ? error.message : 'Failed to save draft');
      setSaveStatus('idle');
    }
  };

  const handlePublish = async (elements: CanvasElement[]) => {
    if (!companyId) return;
    setPublishStatus('publishing');
    try {
      await persistDraft(elements);
      const response = await fetch(`/api/page-configs/${companyId}/publish`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Publish failed');
      }
      setPublishStatus('published');
      setTimeout(() => setPublishStatus('idle'), 1500);
    } catch (error) {
      console.error('Publish error:', error);
      alert(error instanceof Error ? error.message : 'Failed to publish');
      setPublishStatus('idle');
    }
  };

  const publishLabel =
    publishStatus === 'publishing'
      ? 'Publishing…'
      : publishStatus === 'published'
      ? 'Published'
      : 'Publish';

  const saveLabel =
    saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved' : 'Save';

  return (
    <FramerEditorShell
      key={companyId ? `${companyId}-${formData.config.length}` : 'demo'}
      projectName={slug || 'Site'}
      branchName="main"
      initialElements={canvasElements}
      onPreview={handlePreview}
      onSaveDraft={companyId ? handleSaveDraft : undefined}
      onPublish={companyId ? handlePublish : undefined}
      publishLabel={publishLabel}
      publishDisabled={publishStatus === 'publishing' || saveStatus === 'saving'}
      saveLabel={saveLabel}
      saveDisabled={saveStatus === 'saving' || publishStatus === 'publishing'}
    />
  );
}
