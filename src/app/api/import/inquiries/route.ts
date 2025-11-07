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
            lead_type: r.lead_type,
            name: r.name,
            email: r.email,
            phone: r.phone && r.phone !== 'NULL' ? r.phone : null,
            course: r.course && r.course !== 'NULL' ? r.course : null,
            message: r.message && r.message !== 'NULL' ? r.message : null,
            created_at: r.created_at,
        }));

        const { error } = await supabase.from('student_inquiries').upsert(rows, { onConflict: 'id' });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ inserted: rows.length });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
    }
}


