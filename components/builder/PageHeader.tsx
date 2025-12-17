'use client';

import Image from 'next/image';

interface PageHeaderProps {
  logo?: string;
  brandColor: string;
  backgroundUrl?: string;
}

export default function PageHeader({ logo, brandColor, backgroundUrl }: PageHeaderProps) {
  // Create gradient from brand color
  const gradientStyle = backgroundUrl
    ? {
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 50%, ${brandColor}aa 100%)`,
      };

  return (
    <header
      className="min-h-[400px] flex items-center justify-center relative"
      style={gradientStyle}
    >
      {/* Overlay for better logo visibility when using background image */}
      {backgroundUrl && (
        <div className="absolute inset-0 bg-black/20" />
      )}
      
      {/* Logo */}
      {logo && (
        <div className="relative z-10 max-w-md w-full px-4">
          <div className="relative w-full aspect-video max-w-xs mx-auto">
            <Image
              src={logo}
              alt="Company Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </header>
  );
}

