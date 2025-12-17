import { FeaturesBlock as FeaturesBlockType } from '@/types/schema';

interface FeaturesBlockProps {
  data: FeaturesBlockType;
}

export default function FeaturesBlock({ data }: FeaturesBlockProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          {data.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.features.map((feature, index) => (
            <div
              key={index}
              className="glass-panel rounded-xl p-6 hover:shadow-md transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

