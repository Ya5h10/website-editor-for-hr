import { NextResponse } from 'next/server';
import { getPageConfig, parseBlocks, updatePageConfigDraft } from '@/lib/data';
import type { Block } from '@/types/schema';

export const runtime = 'nodejs';

interface RouteParams {
  params: Promise<{ companyId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { companyId } = await params;
    const pageConfig = await getPageConfig(companyId);

    if (!pageConfig) {
      return NextResponse.json({
        company_id: companyId,
        brand_color: '#3b82f6',
        logo_url: '',
        hero_background_url: '',
        config: [],
      });
    }

    return NextResponse.json({
      company_id: pageConfig.company_id,
      brand_color: pageConfig.brand_color || '#3b82f6',
      logo_url: pageConfig.logo_url || '',
      hero_background_url: pageConfig.hero_background_url || '',
      config: parseBlocks(pageConfig.config),
      published_config: parseBlocks(pageConfig.published_config),
    });
  } catch (error) {
    console.error('GET page-config error:', error);
    return NextResponse.json({ error: 'Failed to load page config' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { companyId } = await params;
    const body = await request.json();

    const config = Array.isArray(body.config) ? (body.config as Block[]) : [];
    const brand_color = typeof body.brand_color === 'string' ? body.brand_color : '#3b82f6';
    const logo_url = body.logo_url ? String(body.logo_url) : null;
    const hero_background_url = body.hero_background_url
      ? String(body.hero_background_url)
      : null;

    await updatePageConfigDraft(companyId, {
      config,
      brand_color,
      logo_url,
      hero_background_url,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('PUT page-config error:', error);
    return NextResponse.json({ error: 'Failed to save page config' }, { status: 500 });
  }
}
