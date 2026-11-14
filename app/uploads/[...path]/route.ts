import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { getUploadDir } from '@/lib/uploads';

export const runtime = 'nodejs';

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const segments = (await params).path;
    if (!segments?.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Prevent path traversal
    if (segments.some((s) => s.includes('..') || s.includes('/') || s.includes('\\'))) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const filename = segments.join('/');
    const filePath = path.join(getUploadDir(), filename);
    await stat(filePath);
    const data = await readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
