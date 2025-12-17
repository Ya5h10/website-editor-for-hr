import { FeatureSplitBlock as FeatureSplitBlockType } from '@/types/schema';
import Image from 'next/image';

interface FeatureSplitBlockProps {
  data: FeatureSplitBlockType;
}

export default function FeatureSplitBlock({ data }: FeatureSplitBlockProps) {
  const isImageLeft = data.layout === 'image_left';

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col ${
            isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'
          } items-center gap-8 md:gap-12`}
        >
          {/* Image */}
          <div className="w-full md:w-1/2">
            {data.imageUrl ? (
              <div className="relative aspect-video rounded-lg overflow-hidden glass-panel">
                <Image
                  src={data.imageUrl}
                  alt={data.heading}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-lg glass-panel flex items-center justify-center text-gray-400">
                Image placeholder
              </div>
            )}
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.heading}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {data.content}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

