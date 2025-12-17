import Link from 'next/link';
import { User, Briefcase } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 text-center mb-12">
          Welcome to Orbit
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A: Jobseeker */}
          <Link
            href="/companies"
            className="glass-panel rounded-2xl p-8 hover:bg-white/80 transition-all group cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">I am a Jobseeker</h2>
              <p className="text-gray-600">
                Browse companies and apply for jobs.
              </p>
              <div className="mt-4 text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                Get Started
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* Option B: Recruiter */}
          <Link
            href="/login"
            className="glass-panel rounded-2xl p-8 hover:bg-white/80 transition-all group cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">I am a Recruiter</h2>
              <p className="text-gray-600">
                Create your hiring page and manage roles.
              </p>
              <div className="mt-4 text-purple-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                Get Started
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
