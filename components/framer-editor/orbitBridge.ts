import type { Block } from '@/types/schema';
import {
  CanvasElement,
  createElement,
  defaultStyle,
} from './types';
import { emptyTailwind } from './tailwindStyles';

const ORBIT_BLOCK_TYPES = new Set([
  'hero',
  'feature_split',
  'values_grid',
  'features',
]);

/** Map Orbit page_configs.config blocks into Framer canvas elements. */
export function blocksToCanvasElements(
  blocks: Block[],
  brandColor = '#3b82f6'
): CanvasElement[] {
  if (!blocks?.length) {
    return [];
  }

  return blocks.map((block, index) => {
    const y = 40 + index * 300;
    switch (block.type) {
      case 'hero':
        return createElement('hero', {
          id: block.id,
          x: 40,
          y,
          props: {
            heading: block.heading || '',
            subheading: block.subheading || '',
            brandColor,
            imageUrl: block.backgroundImageUrl || '',
          },
        });
      case 'feature_split':
        return createElement('feature_split', {
          id: block.id,
          x: 40,
          y,
          props: {
            layout: block.layout || 'image_left',
            heading: block.heading || '',
            content: block.content || '',
            imageUrl: block.imageUrl || '',
          },
        });
      case 'values_grid':
        return createElement('values_grid', {
          id: block.id,
          x: 40,
          y,
          props: {
            heading: block.heading || '',
            items: (block.items || []).map((item) => ({
              title: item.title || '',
              text: item.text || '',
              image_url: item.image_url || '',
            })),
          },
        });
      case 'features':
        return createElement('features', {
          id: block.id,
          x: 40,
          y,
          props: {
            heading: block.heading || '',
            features: (block.features || []).map((f) => ({
              title: f.title || '',
              description: f.description || '',
            })),
          },
        });
      default:
        return {
          id: `unknown-${index}`,
          type: 'text' as const,
          name: 'Unknown',
          x: 40,
          y,
          width: 400,
          height: 60,
          visible: true,
          style: defaultStyle(),
          tailwind: emptyTailwind(),
          tailwindExtra: '',
          props: { text: 'Unsupported block' },
        };
    }
  });
}

/** Persist only Orbit careers blocks back to page_configs.config. */
export function canvasElementsToBlocks(elements: CanvasElement[]): Block[] {
  return elements
    .filter((el) => ORBIT_BLOCK_TYPES.has(el.type))
    .map((el) => {
      switch (el.type) {
        case 'hero':
          return {
            id: el.id,
            type: 'hero' as const,
            heading: el.props.heading || '',
            subheading: el.props.subheading || '',
            backgroundImageUrl: el.props.imageUrl || undefined,
          };
        case 'feature_split':
          return {
            id: el.id,
            type: 'feature_split' as const,
            layout: el.props.layout || 'image_left',
            heading: el.props.heading || '',
            content: el.props.content || '',
            imageUrl: el.props.imageUrl || undefined,
          };
        case 'values_grid':
          return {
            id: el.id,
            type: 'values_grid' as const,
            heading: el.props.heading || '',
            items: (el.props.items || []).map((item) => ({
              title: item.title || '',
              text: item.text || '',
              image_url: item.image_url || '',
            })),
          };
        case 'features':
          return {
            id: el.id,
            type: 'features' as const,
            heading: el.props.heading || '',
            features: (el.props.features || []).map((f) => ({
              title: f.title || '',
              description: f.description || '',
            })),
          };
        default:
          throw new Error(`Unexpected orbit type: ${el.type}`);
      }
    });
}

export function extractBrandColor(
  elements: CanvasElement[],
  fallback = '#3b82f6'
): string {
  const hero = elements.find((el) => el.type === 'hero');
  return hero?.props.brandColor || fallback;
}
