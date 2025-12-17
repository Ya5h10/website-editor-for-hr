import { z } from 'zod';

// Base block schema
const baseBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['hero', 'feature_split', 'values_grid', 'features']),
});

// Hero block schema
const heroBlockSchema = baseBlockSchema.extend({
  type: z.literal('hero'),
  heading: z.string().min(1, 'Heading is required'),
  subheading: z.string().min(1, 'Subheading is required'),
  backgroundImageUrl: z.string().url().optional().or(z.literal('')),
});

// Feature split block schema
const featureSplitBlockSchema = baseBlockSchema.extend({
  type: z.literal('feature_split'),
  layout: z.enum(['image_left', 'image_right']),
  heading: z.string().min(1, 'Heading is required'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

// Values grid block schema
const valuesGridBlockSchema = baseBlockSchema.extend({
  type: z.literal('values_grid'),
  heading: z.string().min(1, 'Heading is required'),
  items: z.array(
    z.object({
      title: z.string().min(1, 'Title is required'),
      text: z.string().min(1, 'Text is required'),
      image_url: z.string().url().optional().or(z.literal('')),
    })
  ),
});

// Features block schema
const featuresBlockSchema = baseBlockSchema.extend({
  type: z.literal('features'),
  heading: z.string().min(1, 'Heading is required'),
  features: z.array(
    z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
    })
  ),
});

// Union of all block schemas
export const blockSchema = z.discriminatedUnion('type', [
  heroBlockSchema,
  featureSplitBlockSchema,
  valuesGridBlockSchema,
  featuresBlockSchema,
]);

// Form schema (array of blocks)
export const editorFormSchema = z.object({
  brand_color: z.string().min(1, 'Brand color is required'),
  logo_url: z.string().url().optional().or(z.literal('')),
  hero_background_url: z.string().url().optional().or(z.literal('')),
  content_blocks: z.array(blockSchema), // Allow empty array (hero blocks are filtered out)
});

export type EditorFormData = z.infer<typeof editorFormSchema>;
export type BlockFormData = z.infer<typeof blockSchema>;

