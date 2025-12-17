'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface EditHeaderProps {
  slug: string;
}

export default function EditHeader({ slug }: EditHeaderProps) {
  const [saveHandler, setSaveHandler] = useState<(() => Promise<void>) | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    // Get save handler from EditorForm via window
    const checkForHandler = () => {
      const handler = (window as any).__editorFormSaveHandler;
      if (handler) {
        setSaveHandler(() => handler);
      }
    };
    
    checkForHandler();
    const interval = setInterval(checkForHandler, 100);
    
    return () => clearInterval(interval);
  }, []);

  const handleSaveClick = async () => {
    if (saveHandler) {
      await saveHandler();
    }
  };

  const getButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved!';
      default:
        return 'Save Draft';
    }
  };

  // Listen for save status changes from EditorForm
  useEffect(() => {
    const handleStatusChange = (event: CustomEvent<'idle' | 'saving' | 'saved'>) => {
      setSaveStatus(event.detail);
    };
    window.addEventListener('editorForm:saveStatus', handleStatusChange as EventListener);
    return () => {
      window.removeEventListener('editorForm:saveStatus', handleStatusChange as EventListener);
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
            <Link
              href={`/${slug}/preview`}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 glass-panel rounded-lg transition-colors"
            >
              Preview
            </Link>
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={saveStatus === 'saving' || !saveHandler}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--brand-color, #3b82f6)' }}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

