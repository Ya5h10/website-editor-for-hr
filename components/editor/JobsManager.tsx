'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Job } from '@/types/schema';

interface JobsManagerProps {
  companyId: string;
}

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export default function JobsManager({ companyId }: JobsManagerProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    work_policy: 'Remote',
    department: '',
    employment_type: 'Full-time',
    experience_level: '',
    job_type: 'Permanent',
    salary_range: '',
    job_slug: '',
    description: '',
  });

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="glass-panel rounded-lg p-6">
        <p className="text-gray-600">Supabase configuration missing.</p>
      </div>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        return;
      }

      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchJobs();
    }
  }, [companyId]);

  // Auto-generate slug when title changes
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      job_slug: generateSlug(title),
    });
  }, [formData]);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const { error } = await supabase
        .from('jobs')
        .insert([
          {
            company_id: companyId,
            title: formData.title,
            location: formData.location,
            work_policy: formData.work_policy,
            department: formData.department,
            employment_type: formData.employment_type,
            experience_level: formData.experience_level,
            job_type: formData.job_type,
            salary_range: formData.salary_range || null,
            job_slug: formData.job_slug || generateSlug(formData.title),
            description: formData.description || null,
          },
        ]);

      if (error) {
        console.error('Error adding job:', error);
        alert('Failed to add job. Please try again.');
        return;
      }

      // Reset form and refresh list
      setFormData({
        title: '',
        location: '',
        work_policy: 'Remote',
        department: '',
        employment_type: 'Full-time',
        experience_level: '',
        job_type: 'Permanent',
        salary_range: '',
        job_slug: '',
        description: '',
      });
      setShowAddForm(false);
      fetchJobs();
    } catch (err) {
      console.error('Error adding job:', err);
      alert('Failed to add job. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Please try again.');
        return;
      }

      fetchJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job. Please try again.');
    }
  };

  // Calculate days ago
  const getDaysAgo = (createdAt: string): string => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="glass-panel rounded-lg p-8 text-center">
        <p className="text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Job Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Open Roles</h2>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/70 rounded-lg transition-colors text-sm font-medium text-gray-700"
        >
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </div>

      {/* Add Job Form */}
      {showAddForm && (
        <div className="glass-panel rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Job</h3>
          <form onSubmit={handleAddJob} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g., Senior Frontend Engineer"
                required
                className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Job Slug (Auto-generated)
              </label>
              <input
                type="text"
                value={formData.job_slug}
                onChange={(e) => setFormData({ ...formData, job_slug: e.target.value })}
                placeholder="senior-frontend-engineer"
                className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., San Francisco, CA"
                  required
                  className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Work Policy *
                </label>
                <select
                  value={formData.work_policy}
                  onChange={(e) => setFormData({ ...formData, work_policy: e.target.value })}
                  className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm"
                  required
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Engineering"
                  required
                  className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Employment Type *
                </label>
                <select
                  value={formData.employment_type}
                  onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                  className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Experience Level *
                </label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm"
                  required
                >
                  <option value="">Select level</option>
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Job Type *
                </label>
                <select
                  value={formData.job_type}
                  onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                  className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm"
                  required
                >
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Salary Range
              </label>
              <input
                type="text"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                placeholder="e.g., $100k - $150k"
                className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Job description..."
                rows={4}
                className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isAdding}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--brand-color, #3b82f6)' }}
              >
                {isAdding ? 'Adding...' : 'Add Job'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({
                    title: '',
                    location: '',
                    work_policy: 'Remote',
                    department: '',
                    employment_type: 'Full-time',
                    experience_level: '',
                    job_type: 'Permanent',
                    salary_range: '',
                    job_slug: '',
                    description: '',
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 glass-panel rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="glass-panel rounded-lg p-8 text-center">
          <p className="text-gray-600">No open roles yet. Add your first job posting above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-panel rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{job.department}</span>
                        {job.created_at && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">{getDaysAgo(job.created_at)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.work_policy}</span>
                    {job.employment_type && (
                      <>
                        <span>•</span>
                        <span>{job.employment_type}</span>
                      </>
                    )}
                    {job.experience_level && (
                      <>
                        <span>•</span>
                        <span>{job.experience_level}</span>
                      </>
                    )}
                    {job.salary_range && (
                      <>
                        <span>•</span>
                        <span className="font-medium">{job.salary_range}</span>
                      </>
                    )}
                  </div>
                  {job.description && (
                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteJob(job.id)}
                  className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors ml-4 flex-shrink-0"
                  title="Delete job"
                >
                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
