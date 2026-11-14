'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
}

export default function CompanyLogo({ name, logoUrl }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(logoUrl) && !failed;

  if (showImage && logoUrl) {
    return (
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white border border-gray-200">
        <Image
          src={logoUrl}
          alt={name}
          fill
          unoptimized={logoUrl.startsWith('/')}
          className="object-contain p-2"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
      <span className="text-2xl font-bold text-gray-400">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
