import { NextResponse } from 'next/server';
import { publishPageConfig } from '@/lib/data';

export const runtime = 'nodejs';

interface RouteParams {
  params: Promise<{ companyId: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { companyId } = await params;
    await publishPageConfig(companyId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 });
  }
}
