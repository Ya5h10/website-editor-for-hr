import { ValuesGridBlock as ValuesGridBlockType } from '@/types/schema';
import Image from 'next/image';

interface ValuesBlockProps {
  data: ValuesGridBlockType;
}

export default function ValuesBlock({ data }: ValuesBlockProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          {data.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.items?.map((item, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-100 shadow-sm rounded-2xl hover:-translate-y-1 hover:shadow-md transition-all flex flex-col h-full"
            >
              {/* Image Container */}
              {item.image_url ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title || `Value ${index + 1}`}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="relative aspect-[4/3] w-full bg-gray-100" />
              )}

              {/* Content */}
              <div className="p-6 flex flex-col items-start">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

