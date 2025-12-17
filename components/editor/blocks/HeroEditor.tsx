'use client';

import { useCallback } from 'react';
import { HeroBlock } from '@/types/schema';
import TextInput from '../inputs/TextInput';
import ImageUpload from '../inputs/ImageUpload';

interface HeroEditorProps {
  data: HeroBlock;
  onChange: (updatedBlock: HeroBlock) => void;
  errors?: {
    heading?: { message?: string };
    subheading?: { message?: string };
    backgroundImageUrl?: { message?: string };
  };
}

export default function HeroEditor({ data, onChange, errors }: HeroEditorProps) {
  const handleHeadingChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      heading: e.target.value,
    });
  }, [data, onChange]);

  const handleSubheadingChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      subheading: e.target.value,
    });
  }, [data, onChange]);

  const handleBackgroundImageChange = useCallback((url: string) => {
    onChange({
      ...data,
      backgroundImageUrl: url,
    });
  }, [data, onChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
          Heading
        </label>
        <input
          type="text"
          value={data.heading || ''}
          onChange={handleHeadingChange}
          placeholder="Enter hero heading"
          className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
        />
        {errors?.heading && (
          <p className="mt-1 text-xs text-red-500">{errors.heading.message}</p>
        )}
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
          Subheading
        </label>
        <input
          type="text"
          value={data.subheading || ''}
          onChange={handleSubheadingChange}
          placeholder="Enter hero subheading"
          className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
        />
        {errors?.subheading && (
          <p className="mt-1 text-xs text-red-500">{errors.subheading.message}</p>
        )}
      </div>
      <ImageUpload
        label="Background Image"
        value={data.backgroundImageUrl || ''}
        onChange={handleBackgroundImageChange}
        error={errors?.backgroundImageUrl?.message}
      />
    </div>
  );
}

