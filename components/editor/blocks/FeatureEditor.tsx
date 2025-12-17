'use client';

import { useCallback } from 'react';
import { FeatureSplitBlock } from '@/types/schema';
import TextInput from '../inputs/TextInput';
import ImageUpload from '../inputs/ImageUpload';

interface FeatureEditorProps {
  data: FeatureSplitBlock;
  onChange: (updatedBlock: FeatureSplitBlock) => void;
  errors?: {
    heading?: { message?: string };
    content?: { message?: string };
    imageUrl?: { message?: string };
    layout?: { message?: string };
  };
}

export default function FeatureEditor({ data, onChange, errors }: FeatureEditorProps) {
  const handleHeadingChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      heading: e.target.value,
    });
  }, [data, onChange]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...data,
      content: e.target.value,
    });
  }, [data, onChange]);

  const handleLayoutChange = useCallback((layout: 'image_left' | 'image_right') => {
    onChange({
      ...data,
      layout,
    });
  }, [data, onChange]);

  const handleImageChange = useCallback((url: string) => {
    onChange({
      ...data,
      imageUrl: url,
    });
  }, [data, onChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
          Layout
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleLayoutChange('image_left')}
            className={`
              flex-1 px-4 py-2 rounded-lg border transition-all
              ${data.layout === 'image_left' 
                ? 'bg-white/60 border-gray-400 text-gray-900' 
                : 'bg-white/30 border-gray-200 text-gray-600 hover:bg-white/40'
              }
            `.trim().replace(/\s+/g, ' ')}
          >
            Image Left
          </button>
          <button
            type="button"
            onClick={() => handleLayoutChange('image_right')}
            className={`
              flex-1 px-4 py-2 rounded-lg border transition-all
              ${data.layout === 'image_right' 
                ? 'bg-white/60 border-gray-400 text-gray-900' 
                : 'bg-white/30 border-gray-200 text-gray-600 hover:bg-white/40'
              }
            `.trim().replace(/\s+/g, ' ')}
          >
            Image Right
          </button>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
          Heading
        </label>
        <input
          type="text"
          value={data.heading || ''}
          onChange={handleHeadingChange}
          placeholder="Enter feature heading"
          className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
        />
        {errors?.heading && (
          <p className="mt-1 text-xs text-red-500">{errors.heading.message}</p>
        )}
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
          Content
        </label>
        <textarea
          value={data.content || ''}
          onChange={handleContentChange}
          placeholder="Enter feature content"
          rows={4}
          className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
        />
        {errors?.content && (
          <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
        )}
      </div>
      <ImageUpload
        label="Feature Image"
        value={data.imageUrl || ''}
        onChange={handleImageChange}
        error={errors?.imageUrl?.message}
      />
    </div>
  );
}

