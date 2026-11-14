import { NextResponse } from 'next/server';
import { deleteJob } from '@/lib/data';

export const runtime = 'nodejs';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteJob(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE job error:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
