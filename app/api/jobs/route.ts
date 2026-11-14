import { NextResponse } from 'next/server';
import { createJob, listJobs } from '@/lib/data';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
    }

    const jobs = await listJobs(companyId);
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('GET jobs error:', error);
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const companyId = typeof body.company_id === 'string' ? body.company_id : '';
    if (!companyId || !body.title) {
      return NextResponse.json({ error: 'company_id and title are required' }, { status: 400 });
    }

    const job = await createJob(companyId, {
      title: String(body.title),
      location: String(body.location || ''),
      work_policy: String(body.work_policy || 'Remote'),
      department: String(body.department || ''),
      employment_type: String(body.employment_type || 'Full-time'),
      experience_level: String(body.experience_level || ''),
      job_type: String(body.job_type || 'Permanent'),
      salary_range: body.salary_range ? String(body.salary_range) : undefined,
      job_slug: String(body.job_slug || ''),
      description: body.description ? String(body.description) : undefined,
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('POST jobs error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
