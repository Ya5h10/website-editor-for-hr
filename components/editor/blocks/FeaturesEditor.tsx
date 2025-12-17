'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Trash2, Plus } from 'lucide-react';
import { EditorFormData } from '../schema';
import TextInput from '../inputs/TextInput';

interface FeaturesEditorProps {
  blockIndex: number;
}

export default function FeaturesEditor({ blockIndex }: FeaturesEditorProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<EditorFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `content_blocks.${blockIndex}.features` as any,
  });

  const blockErrors = errors.content_blocks?.[blockIndex];
  const featuresErrors = blockErrors && 'type' in blockErrors && (blockErrors as any).type === 'features' 
    ? (blockErrors as any).features 
    : undefined;

  const handleAddFeature = () => {
    append({ title: '', description: '' });
  };

  return (
    <div className="space-y-6">
      {/* Heading Input */}
      <TextInput
        label="Heading"
        register={register(`content_blocks.${blockIndex}.heading`)}
        error={
          blockErrors && 'type' in blockErrors && (blockErrors as any).type === 'features'
            ? (blockErrors as any).heading?.message
            : undefined
        }
        placeholder="Enter section heading"
      />

      {/* Features List */}
      <div className="space-y-4">
        {fields.map((field, featureIndex) => (
          <div
            key={field.id}
            className="bg-white/40 border border-white/60 backdrop-blur-md rounded-xl p-4"
          >
            <div className="flex items-start gap-4">
              {/* Inputs */}
              <div className="flex-1 space-y-3">
                <TextInput
                  label="Title"
                  register={register(
                    `content_blocks.${blockIndex}.features.${featureIndex}.title` as any
                  )}
                  error={featuresErrors?.[featureIndex]?.title?.message}
                  placeholder="Enter feature title"
                />
                <TextInput
                  label="Description"
                  register={register(
                    `content_blocks.${blockIndex}.features.${featureIndex}.description` as any
                  )}
                  error={featuresErrors?.[featureIndex]?.description?.message}
                  placeholder="Enter feature description"
                  type="textarea"
                  rows={2}
                />
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => remove(featureIndex)}
                className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0 mt-8"
                title="Remove feature"
              >
                <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Feature Button */}
      <button
        type="button"
        onClick={handleAddFeature}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white/30 hover:bg-white/40 hover:border-gray-400 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add Feature</span>
      </button>
    </div>
  );
}

