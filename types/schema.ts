// Type definitions for the Careers Page Builder

export type BlockType = 'hero' | 'feature_split' | 'values_grid' | 'features';

export interface BaseBlock {
  id: string; // UUID for React keys and reordering
  type: BlockType;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  heading: string;
  subheading: string;
  backgroundImageUrl?: string;
}

export interface FeatureSplitBlock extends BaseBlock {
  type: 'feature_split';
  layout: 'image_left' | 'image_right';
  heading: string;
  content: string;
  imageUrl?: string;
}

export interface ValuesGridBlock extends BaseBlock {
  type: 'values_grid';
  heading: string;
  items: Array<{
    title: string;
    text: string;
    image_url?: string;
  }>;
}

export interface FeaturesBlock extends BaseBlock {
  type: 'features';
  heading: string;
  features: Array<{
    title: string;
    description: string;
  }>;
}

// Union type for all blocks
export type Block = HeroBlock | FeatureSplitBlock | ValuesGridBlock | FeaturesBlock;

// Company schema
export interface Company {
  id: string;
  slug: string;
  name: string;
}

// PageConfig schema
export interface PageConfig {
  company_id: string;
  brand_color: string;
  logo_url?: string;
  hero_background_url?: string;
  config: Block[];
}

// Job schema
export interface Job {
  id: string;
  company_id: string;
  title: string;
  location: string;
  work_policy: string; // Remote, Hybrid, On-site
  department: string; // Engineering, Marketing, etc.
  employment_type: string; // Full-time, Contract, etc.
  experience_level: string; // Senior, Entry-level, etc.
  job_type: string; // Permanent, Internship, etc.
  salary_range?: string; // "$100k - $150k"
  job_slug: string; // Unique slug for URL
  description?: string;
  created_at: string; // ISO date string
}

