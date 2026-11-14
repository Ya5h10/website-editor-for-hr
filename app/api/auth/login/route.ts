import { NextResponse } from 'next/server';
import { authenticateCompany } from '@/lib/data';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = typeof body.slug === 'string' ? body.slug : '';
    const accessCode = typeof body.accessCode === 'string' ? body.accessCode : '';

    if (!slug || !accessCode) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const company = await authenticateCompany(slug, accessCode);
    if (!company) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      company_id: company.id,
      company_slug: company.slug,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
  }
}
