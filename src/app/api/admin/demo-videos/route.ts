import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
	const supabase = getSupabaseAdmin();
	const { data, error } = await supabase.from('demo_videos').select('*').order('id');
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const supabase = getSupabaseAdmin();
		
		// Get the max ID to generate next ID if needed
		const { data: existing } = await supabase.from('demo_videos').select('id').order('id', { ascending: false }).limit(1);
		const nextId = existing && existing.length > 0 ? (existing[0].id as number) + 1 : 1;
		
		// Remove id from body if present, and use generated ID
		const { id, ...videoData } = body;
		const insertData = { ...videoData, id: nextId };
		
		const { data, error } = await supabase.from('demo_videos').insert([insertData]).select();
		if (error) return NextResponse.json({ error: error.message }, { status: 500 });
		return NextResponse.json(data[0]);
	} catch (error) {
		return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	const body = await req.json();
	const { id, ...updates } = body;
	const supabase = getSupabaseAdmin();
	const { data, error } = await supabase.from('demo_videos').update(updates).eq('id', id).select();
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data[0]);
}

export async function DELETE(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	const supabase = getSupabaseAdmin();
	const { error } = await supabase.from('demo_videos').delete().eq('id', id);
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ success: true });
}

