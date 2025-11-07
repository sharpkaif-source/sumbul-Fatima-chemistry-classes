import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
	const supabase = getSupabaseAdmin();
	const { data, error } = await supabase.from('student_inquiries').select('*').order('created_at', { ascending: false });
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	const supabase = getSupabaseAdmin();
	const { error } = await supabase.from('student_inquiries').delete().eq('id', id);
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ success: true });
}

