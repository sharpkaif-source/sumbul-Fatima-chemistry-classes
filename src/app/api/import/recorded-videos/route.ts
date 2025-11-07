import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({ status: 'ok', expects: 'POST multipart/form-data with field "file"' });
}

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type') || '';
        if (!contentType.includes('text/csv') && !contentType.includes('multipart/form-data')) {
            return NextResponse.json({ error: 'Upload CSV (text/csv)' }, { status: 400 });
        }

        let csvBuffer: Buffer;
        if (contentType.includes('multipart/form-data')) {
            const form = await req.formData();
            const file = form.get('file');
            if (!(file instanceof File)) return NextResponse.json({ error: 'file required' }, { status: 400 });
            csvBuffer = Buffer.from(await file.arrayBuffer());
        } else {
            csvBuffer = Buffer.from(await req.arrayBuffer());
        }

        const records = parse(csvBuffer.toString('utf8'), {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true,
            relax_quotes: true,
        });

        const supabase = getSupabaseAdmin();
        const rows = (records as any[]).map((r) => ({
            id: r.id ? Number(r.id) : undefined,
            chapterName: r.chapterName || r.chapter || r.name,
            youtubeLink: r.youtubeLink || r.youtube_link || r.url,
            category: r.category || null,
        }));

        const { error } = await supabase.from('recorded_videos').upsert(rows, { onConflict: 'id' });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ inserted: rows.length });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
    }
}


