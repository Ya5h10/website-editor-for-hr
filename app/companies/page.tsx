import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Building2 } from 'lucide-react';
import { listCompaniesWithLogos } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

async function getCompanies(): Promise<Company[]> {
  try {
    return await listCompaniesWithLogos();
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Company Directory
          </h1>
          <p className="text-lg text-gray-600">
            Explore career opportunities with our partner companies
          </p>
        </div>

        {companies.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No companies found
            </h2>
            <p className="text-gray-600">
              Check back soon for new opportunities!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/${company.slug}/careers`}
                className="glass-panel rounded-xl p-6 hover:bg-white/80 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {company.logo_url ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white border border-gray-200">
                      <Image
                        src={company.logo_url}
                        alt={company.name}
                        fill
                        unoptimized={company.logo_url.startsWith('/')}
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                      <span className="text-2xl font-bold text-gray-400">
                        {company.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {company.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    <span>View Page</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
