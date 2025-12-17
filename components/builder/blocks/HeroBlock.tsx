import { HeroBlock as HeroBlockType } from '@/types/schema';

interface HeroBlockProps {
  data: HeroBlockType;
}

export default function HeroBlock({ data }: HeroBlockProps) {
  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center px-4 py-20"
      style={{
        backgroundImage: data.backgroundImageUrl
          ? `url(${data.backgroundImageUrl})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {data.backgroundImageUrl && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
      )}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          {data.heading}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600">
          {data.subheading}
        </p>
      </div>
    </section>
  );
}

