import { ReactNode } from 'react';

interface CompanyLayoutProps {
  children: ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export default async function CompanyLayout({
  children,
  params,
}: CompanyLayoutProps) {
  await params; // Await params even if not used, to follow Next.js 15 pattern
  return <>{children}</>;
}

