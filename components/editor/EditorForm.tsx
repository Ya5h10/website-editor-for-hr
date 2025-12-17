'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { editorFormSchema, EditorFormData, BlockFormData } from './schema';
import { Block } from '@/types/schema';
import TextInput from './inputs/TextInput';
import ImageUpload from './inputs/ImageUpload';
import ValuesEditor from './blocks/ValuesEditor';
import HeroEditor from './blocks/HeroEditor';
import FeatureEditor from './blocks/FeatureEditor';
import FeaturesEditor from './blocks/FeaturesEditor';
import JobsManager from './JobsManager';

interface EditorFormProps {
  initialData: { 
    brand_color?: string;
    logo_url?: string;
    hero_background_url?: string;
    config: Block[]; // Changed from content_blocks to config
  };
  companyId: string;
  onSave?: (data: EditorFormData) => void;
  onSaveHandlerReady?: (handler: () => Promise<void>) => void;
  saveStatus?: 'idle' | 'saving' | 'saved';
  onSaveStatusChange?: (status: 'idle' | 'saving' | 'saved') => void;
}

// Helper to generate UUID
const generateId = () => {
  return crypto.randomUUID();
};

// Default block templates
const createDefaultBlock = (type: Block['type']): BlockFormData => {
  const base = { id: generateId(), type };
  
  switch (type) {
    case 'hero':
      return {
        ...base,
        type: 'hero',
        heading: '',
        subheading: '',
        backgroundImageUrl: '',
      };
    case 'feature_split':
      return {
        ...base,
        type: 'feature_split',
        layout: 'image_left',
        heading: '',
        content: '',
        imageUrl: '',
      };
    case 'values_grid':
      return {
        ...base,
        type: 'values_grid',
        heading: '',
        items: [
          { title: '', text: '', image_url: '' },
          { title: '', text: '', image_url: '' },
          { title: '', text: '', image_url: '' },
        ],
      };
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};

export default function EditorForm({ 
  initialData,
  companyId,
  onSave,
  onSaveHandlerReady,
  saveStatus: externalSaveStatus,
  onSaveStatusChange,
}: EditorFormProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'jobs'>('content');
  const [isSaving, setIsSaving] = useState(false);
  const [internalSaveStatus, setInternalSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const lastInitialDataRef = useRef<string>('');
  
  // Use external status if provided, otherwise use internal
  const saveStatus = externalSaveStatus ?? internalSaveStatus;
  const setSaveStatus = onSaveStatusChange ?? setInternalSaveStatus;
  
  // Validate environment variables before creating Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
  }
  
  const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

  const form = useForm<EditorFormData>({
    resolver: zodResolver(editorFormSchema),
    defaultValues: {
      brand_color: initialData.brand_color || '#3b82f6',
      logo_url: initialData.logo_url || '',
      hero_background_url: initialData.hero_background_url || '',
      // Keep hero blocks in editor (they're optional content blocks, separate from global header)
      content_blocks: initialData.config || [],
    },
    mode: 'onChange',
  });

  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isDirty },
    handleSubmit,
  } = form;

  // Reset form when initialData changes (for data persistence on reload)
  useEffect(() => {
    if (!initialData) return;

    // Parse config if it's a string, otherwise use directly
    const contentBlocks = Array.isArray(initialData.config)
      ? initialData.config
      : typeof initialData.config === 'string'
      ? JSON.parse(initialData.config)
      : [];
    
    const newFormData = {
      brand_color: initialData.brand_color || '#3b82f6',
      logo_url: initialData.logo_url || '',
      hero_background_url: initialData.hero_background_url || '',
      content_blocks: contentBlocks, // Keep hero blocks (they're optional content)
    };

    // Create a stable key to compare initialData changes
    const dataKey = JSON.stringify(newFormData);
    
    // Only reset if this is actually new data (prevents infinite loops)
    if (lastInitialDataRef.current !== dataKey) {
      lastInitialDataRef.current = dataKey;
      reset(newFormData);
    }
  }, [initialData, reset]);

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'content_blocks',
  });

  // Auto-save with debounce
  useEffect(() => {
    if (!isDirty) return;

    const timeoutId = setTimeout(() => {
      const formData = watch();
      console.log('Saving draft...', formData);
      if (onSave) {
        onSave(formData);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [watch(), isDirty, onSave]);

  const handleAddBlock = useCallback((type: Block['type']) => {
    append(createDefaultBlock(type));
  }, [append]);

  const handleMove = useCallback((index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      move(index, index - 1);
    } else if (direction === 'down' && index < fields.length - 1) {
      move(index, index + 1);
    }
  }, [move, fields.length]);

  const getBlockTypeLabel = (type: Block['type']) => {
    switch (type) {
      case 'hero':
        return 'Hero Section';
      case 'feature_split':
        return 'Feature Split';
      case 'values_grid':
        return 'Values Grid';
      case 'features':
        return 'Features';
      default:
        return type;
    }
  };

  const handleSave = useCallback(async () => {
    if (!supabase) {
      alert('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');
    
    // Dispatch event for header to listen to
    window.dispatchEvent(new CustomEvent('editorForm:saveStatus', { detail: 'saving' }));

    try {
      const formData = getValues();

      // Normalize blocks before saving to ensure Values Grid items always include title/text
      const normalizedBlocks = formData.content_blocks.map((block) => {
        if (block.type === 'values_grid') {
          return {
            ...block,
            items: (block.items || []).map((item) => ({
              title: (item as any).title ?? '',
              text: (item as any).text ?? '',
              image_url: (item as any).image_url ?? '',
            })),
          } as any;
        }
        return block as any;
      });
      
      // Update config, brand_color, logo_url, and hero_background_url
      const { error } = await supabase
        .from('page_configs')
        .update({
          config: normalizedBlocks, // Save normalized content_blocks to config column
          brand_color: formData.brand_color,
          logo_url: formData.logo_url || null,
          hero_background_url: formData.hero_background_url || null,
        })
        .eq('company_id', companyId);

      if (error) {
        throw error;
      }

      // Success feedback
      setSaveStatus('saved');
      window.dispatchEvent(new CustomEvent('editorForm:saveStatus', { detail: 'saved' }));
      
      setTimeout(() => {
        setSaveStatus('idle');
        window.dispatchEvent(new CustomEvent('editorForm:saveStatus', { detail: 'idle' }));
      }, 2000);

      // Call optional onSave callback
      if (onSave) {
        onSave(formData);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save draft: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSaveStatus('idle');
      window.dispatchEvent(new CustomEvent('editorForm:saveStatus', { detail: 'idle' }));
    } finally {
      setIsSaving(false);
    }
  }, [getValues, supabase, companyId, onSave]);

  // Expose handleSave to parent via window event or callback
  useEffect(() => {
    // Store handler globally for header to access
    (window as any).__editorFormSaveHandler = handleSave;
    
    if (onSaveHandlerReady) {
      onSaveHandlerReady(handleSave);
    }
    
    return () => {
      delete (window as any).__editorFormSaveHandler;
    };
  }, [handleSave, onSaveHandlerReady]);

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="glass-panel rounded-xl p-1 border border-white/60">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`
              flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'content'
                ? 'bg-white/60 text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/30'
              }
            `.trim().replace(/\s+/g, ' ')}
          >
            Page Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`
              flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'jobs'
                ? 'bg-white/60 text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/30'
              }
            `.trim().replace(/\s+/g, ' ')}
          >
            Jobs
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'content' ? (
        <form onSubmit={handleSubmit((data) => console.log('Form submitted:', data))}>
          <FormProvider {...form}>
            <div className="space-y-4">
              {/* Page Design & Header Section */}
              <div className="bg-white/40 border border-white/60 shadow-sm backdrop-blur-md rounded-xl p-6 mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Design & Header</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                      Brand Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        {...register('brand_color')}
                        className="w-16 h-10 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        {...register('brand_color')}
                        placeholder="#3b82f6"
                        className="flex-1 bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 transition-all backdrop-blur-sm placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="hidden"
                      {...register('logo_url')}
                    />
                    <ImageUpload
                      label="Company Logo"
                      value={watch('logo_url') || ''}
                      onChange={(url) => {
                        setValue('logo_url', url, { shouldDirty: true });
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="hidden"
                      {...register('hero_background_url')}
                    />
                    <ImageUpload
                      label="Header Background Image (Optional - will override brand color gradient)"
                      value={watch('hero_background_url') || ''}
                      onChange={(url) => {
                        setValue('hero_background_url', url, { shouldDirty: true });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Content Blocks */}
        {fields.map((field, index) => {
          const block = watch(`content_blocks.${index}`);
          const blockErrors = errors.content_blocks?.[index];

          return (
            <div
              key={field.id}
              className="bg-white/40 border border-white/60 shadow-sm backdrop-blur-md rounded-xl p-6 mb-4"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/30">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {getBlockTypeLabel(block.type)}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === fields.length - 1}
                    className="p-1.5 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                  </button>
                </div>
              </div>

              {/* Card Body - Dynamic Inputs */}
              <div className="space-y-4">
                {block.type === 'hero' && (
                  <HeroEditor
                    data={block as any}
                    onChange={(updatedBlock) => {
                      setValue(`content_blocks.${index}` as any, updatedBlock, { shouldDirty: true });
                    }}
                    errors={blockErrors && 'type' in blockErrors && (blockErrors as any).type === 'hero' ? {
                      heading: (blockErrors as any).heading,
                      subheading: (blockErrors as any).subheading,
                      backgroundImageUrl: (blockErrors as any).backgroundImageUrl,
                    } : undefined}
                  />
                )}

                {block.type === 'feature_split' && (
                  <FeatureEditor
                    data={block as any}
                    onChange={(updatedBlock) => {
                      setValue(`content_blocks.${index}` as any, updatedBlock, { shouldDirty: true });
                    }}
                    errors={blockErrors && 'type' in blockErrors && (blockErrors as any).type === 'feature_split' ? {
                      heading: (blockErrors as any).heading,
                      content: (blockErrors as any).content,
                      imageUrl: (blockErrors as any).imageUrl,
                      layout: (blockErrors as any).layout,
                    } : undefined}
                  />
                )}

                {block.type === 'values_grid' && (
                  <ValuesEditor blockIndex={index} />
                )}

                {block.type === 'features' && (
                  <FeaturesEditor blockIndex={index} />
                )}
              </div>
            </div>
          );
        })}

        {/* Add Block Menu */}
        <div className="sticky bottom-4 glass-panel rounded-xl p-4 border border-white/60 shadow-lg">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleAddBlock('hero')}
              className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/70 rounded-lg transition-colors text-sm font-medium text-gray-700"
            >
              <Plus className="w-4 h-4" />
              Add Hero
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('feature_split')}
              className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/70 rounded-lg transition-colors text-sm font-medium text-gray-700"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('values_grid')}
              className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/70 rounded-lg transition-colors text-sm font-medium text-gray-700"
            >
              <Plus className="w-4 h-4" />
              Add Values
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('features')}
              className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/70 rounded-lg transition-colors text-sm font-medium text-gray-700"
            >
              <Plus className="w-4 h-4" />
              Add Features
            </button>
          </div>
        </div>
          </div>
          </FormProvider>
        </form>
      ) : (
        <JobsManager companyId={companyId} />
      )}
    </div>
  );
}

