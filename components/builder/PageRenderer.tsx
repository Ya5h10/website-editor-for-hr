'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Block, Job } from '@/types/schema';
import HeroBlock from './blocks/HeroBlock';
import FeatureSplitBlock from './blocks/FeatureSplitBlock';
import ValuesBlock from './blocks/ValuesBlock';
import FeaturesBlock from './blocks/FeaturesBlock';

interface PageRendererProps {
  blocks: Block[];
  brandColor?: string;
  jobs?: Job[];
}

export default function PageRenderer({ blocks, brandColor, jobs = [] }: PageRendererProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');

  // Get unique locations and salary ranges for filters
  const uniqueLocations = useMemo(() => {
    const locations = jobs
      .map(job => job.location)
      .filter((loc, index, self) => loc && self.indexOf(loc) === index)
      .sort();
    return locations;
  }, [jobs]);

  // Extract salary ranges and create filter options
  const salaryRanges = useMemo(() => {
    const ranges = jobs
      .map(job => job.salary_range)
      .filter((range): range is string => !!range)
      .filter((range, index, self) => self.indexOf(range) === index)
      .sort();
    return ranges;
  }, [jobs]);

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter (title, description, department)
      const matchesSearch = !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase());

      // Location filter
      const matchesLocation = !locationFilter || job.location === locationFilter;

      // Salary filter
      const matchesSalary = !salaryFilter || job.salary_range === salaryFilter;

      return matchesSearch && matchesLocation && matchesSalary;
    });
  }, [jobs, searchQuery, locationFilter, salaryFilter]);

  // Calculate days ago helper
  const getDaysAgo = (createdAt: string): string => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };
  return (
    <div
      className="min-h-screen"
      style={
        brandColor
          ? {
              '--brand-color': brandColor,
            } as React.CSSProperties
          : undefined
      }
    >
      {blocks.map((block) => {
        const blockId = 'id' in block ? block.id : `block-${Math.random()}`;
        switch (block.type) {
          case 'hero':
            return <HeroBlock key={blockId} data={block} />;
          case 'feature_split':
            return <FeatureSplitBlock key={blockId} data={block} />;
          case 'values_grid':
            return <ValuesBlock key={blockId} data={block} />;
          case 'features':
            return <FeaturesBlock key={blockId} data={block} />;
          default:
            return (
              <div key={blockId} className="p-4 text-center text-gray-400">
                Unknown block type: {(block as any).type}
              </div>
            );
        }
      })}
      
      {/* Careers Section */}
      {jobs.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
              Open Roles
            </h2>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs by title, description, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 transition-all placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location Filter */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 transition-all"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Salary Filter */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Salary Range
                  </label>
                  <select
                    value={salaryFilter}
                    onChange={(e) => setSalaryFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-0 transition-all"
                  >
                    <option value="">All Salary Ranges</option>
                    {salaryRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchQuery || locationFilter || salaryFilter) && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {locationFilter && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                      Location: {locationFilter}
                      <button
                        onClick={() => setLocationFilter('')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {salaryFilter && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                      Salary: {salaryFilter}
                      <button
                        onClick={() => setSalaryFilter('')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setLocationFilter('');
                      setSalaryFilter('');
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </div>
            </div>

            {/* Jobs Grid */}
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border border-gray-100 shadow-sm rounded-lg p-6 hover:-translate-y-1 hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        {job.created_at && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {getDaysAgo(job.created_at)}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.work_policy}</span>
                          {job.department && (
                            <>
                              <span>•</span>
                              <span className="font-medium">{job.department}</span>
                            </>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                          {job.employment_type && <span>{job.employment_type}</span>}
                          {job.experience_level && (
                            <>
                              {job.employment_type && <span>•</span>}
                              <span>{job.experience_level}</span>
                            </>
                          )}
                          {job.job_type && (
                            <>
                              {(job.employment_type || job.experience_level) && <span>•</span>}
                              <span>{job.job_type}</span>
                            </>
                          )}
                        </div>
                        {job.salary_range && (
                          <div className="text-sm font-semibold text-gray-900">
                            {job.salary_range}
                          </div>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-gray-600 line-clamp-3 mb-4">{job.description}</p>
                      )}
                    </div>
                    <button
                      className="mt-auto px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90 w-full"
                      style={{ backgroundColor: brandColor || '#3b82f6' }}
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No jobs found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setLocationFilter('');
                    setSalaryFilter('');
                  }}
                  className="mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

