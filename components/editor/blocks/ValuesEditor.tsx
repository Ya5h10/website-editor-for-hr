'use client';

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { EditorFormData } from '../schema'; // Check this path
import ImageUpload from '../inputs/ImageUpload'; // Check this path

interface ValuesEditorProps {
  blockIndex: number;
}

export default function ValuesEditor({ blockIndex }: ValuesEditorProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<EditorFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `content_blocks.${blockIndex}.items` as any,
  });

  // Type-safe error handling for deeply nested fields
  const getError = (index: number, field: string) => {
    // @ts-ignore
    return errors?.content_blocks?.[blockIndex]?.items?.[index]?.[field]?.message;
  };

  const handleAddItem = () => {
    append({ title: '', text: '', image_url: '' });
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADING */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Section Heading</label>
        <input
          {...register(`content_blocks.${blockIndex}.heading`)}
          placeholder="e.g. Why Choose Us?"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* ITEMS LIST */}
      <div className="space-y-4">
        {fields.map((field, itemIndex) => (
          <div
            key={field.id}
            className="group relative border border-gray-200 rounded-xl p-4 bg-white/50 hover:bg-white transition-colors"
          >
            {/* Delete Button (Absolute Top Right) */}
            <button
              type="button"
              onClick={() => remove(itemIndex)}
              className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6">
              {/* COL 1: IMAGE */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</label>
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                  <Controller
                    name={`content_blocks.${blockIndex}.items.${itemIndex}.image_url` as any}
                    control={control}
                    render={({ field: imageField }) => (
                      <ImageUpload
                        value={imageField.value || ''}
                        onChange={(url) => imageField.onChange(url)}
                      />
                    )}
                  />
                </div>
              </div>

              {/* COL 2: TEXT INPUTS */}
              <div className="space-y-4">
                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
                  <input
                    {...register(`content_blocks.${blockIndex}.items.${itemIndex}.title` as any)}
                    placeholder="e.g. Innovation"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  />
                  <p className="text-xs text-red-500 min-h-[16px]">
                    {getError(itemIndex, 'title')}
                  </p>
                </div>

                {/* Description Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea
                    {...register(`content_blocks.${blockIndex}.items.${itemIndex}.text` as any)}
                    rows={3}
                    placeholder="Briefly describe this value..."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                  />
                  <p className="text-xs text-red-500 min-h-[16px]">
                    {getError(itemIndex, 'text')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD BUTTON */}
      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all font-medium text-sm"
      >
        <Plus className="w-4 h-4" />
        Add Card
      </button>
    </div>
  );
}