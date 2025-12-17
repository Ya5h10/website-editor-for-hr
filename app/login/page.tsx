'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function LoginPage() {
  const [slug, setSlug] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="glass-panel rounded-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuration Error</h1>
          <p className="text-gray-600">
            Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.
          </p>
        </div>
      </div>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Query Supabase for company with matching slug and password_code
      const { data, error: queryError } = await supabase
        .from('companies')
        .select('id, slug')
        .eq('slug', slug.trim().toLowerCase())
        .eq('password_code', accessCode)
        .single();

      if (queryError || !data) {
        setError('Invalid credentials');
        setIsLoading(false);
        return;
      }

      // Save session to localStorage
      const sessionData = {
        company_id: data.id,
        company_slug: data.slug,
      };
      localStorage.setItem('orbit_session', JSON.stringify(sessionData));

      // Redirect to editor
      router.push(`/${data.slug}/edit`);
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="glass-panel rounded-xl p-8 max-w-md w-full shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Company Login
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your company credentials to access the editor
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="slug"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block"
            >
              Company Slug
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g., orbit"
              required
              className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="accessCode"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block"
            >
              Access Code
            </label>
            <input
              id="accessCode"
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter your access code"
              required
              className="bg-white/50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-lg p-3 w-full transition-all backdrop-blur-sm placeholder:text-gray-400"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--brand-color, #3b82f6)' }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

