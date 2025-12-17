'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface EditHeaderProps {
  slug: string;
}

export default function EditHeader({ slug }: EditHeaderProps) {
  const [saveHandler, setSaveHandler] = useState<(() => Promise<void>) | null>(null);
  const [publishHandler, setPublishHandler] = useState<(() => Promise<void>) | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');

  useEffect(() => {
    // Get save handler from EditorForm via window
    const checkForHandlers = () => {
      const saveHandlerFn = (window as any).__editorFormSaveHandler;
      const publishHandlerFn = (window as any).__editorFormPublishHandler;
      if (saveHandlerFn) {
        setSaveHandler(() => saveHandlerFn);
      }
      if (publishHandlerFn) {
        setPublishHandler(() => publishHandlerFn);
      }
    };
    
    checkForHandlers();
    const interval = setInterval(checkForHandlers, 100);
    
    return () => clearInterval(interval);
  }, []);

  const handleSaveClick = async () => {
    if (saveHandler) {
      await saveHandler();
    }
  };

  const handlePreviewClick = () => {
    window.open(`/${slug}?preview=true`, '_blank');
  };

  const handlePublishClick = async () => {
    if (publishHandler) {
      await publishHandler();
    }
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved!';
      default:
        return 'Save Draft';
    }
  };

  const getPublishButtonText = () => {
    switch (publishStatus) {
      case 'publishing':
        return 'Publishing...';
      case 'published':
        return 'Published!';
      default:
        return 'Publish';
    }
  };

  // Listen for save status changes from EditorForm
  useEffect(() => {
    const handleSaveStatusChange = (event: CustomEvent<'idle' | 'saving' | 'saved'>) => {
      setSaveStatus(event.detail);
    };
    const handlePublishStatusChange = (event: CustomEvent<'idle' | 'publishing' | 'published'>) => {
      setPublishStatus(event.detail);
    };
    
    window.addEventListener('editorForm:saveStatus', handleSaveStatusChange as EventListener);
    window.addEventListener('editorForm:publishStatus', handlePublishStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('editorForm:saveStatus', handleSaveStatusChange as EventListener);
      window.removeEventListener('editorForm:publishStatus', handlePublishStatusChange as EventListener);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-semibold text-gray-900">
            Edit Career Page
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePreviewClick}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 glass-panel rounded-lg transition-colors"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={saveStatus === 'saving' || !saveHandler}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 glass-panel rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getSaveButtonText()}
            </button>
            <button
              type="button"
              onClick={handlePublishClick}
              disabled={publishStatus === 'publishing' || !publishHandler}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--brand-color, #3b82f6)' }}
            >
              {getPublishButtonText()}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

