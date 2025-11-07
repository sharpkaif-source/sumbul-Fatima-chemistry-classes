import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
	const supabase = getSupabaseAdmin();
	const { data, error } = await supabase.from('courses').select('*').order('id');
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		console.log('POST /api/admin/courses - Request body:', body);
		
		const supabase = getSupabaseAdmin();
		if (!supabase) {
			console.error('Supabase admin client not initialized');
			return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
		}
		
		// Get the max ID to generate next ID if needed
		const { data: existingCourses } = await supabase.from('courses').select('id').order('id', { ascending: false }).limit(1);
		const nextId = existingCourses && existingCourses.length > 0 ? (existingCourses[0].id as number) + 1 : 1;
		
		// Remove id from body if present, and use generated ID
		const { id, ...courseData } = body;
		const insertData = { ...courseData, id: nextId };
		
		console.log('Inserting course with ID:', nextId);
		const { data, error } = await supabase.from('courses').insert([insertData]).select();
		
		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: error.message, details: error }, { status: 500 });
		}
		
		console.log('Successfully inserted course:', data);
		return NextResponse.json(data[0]);
	} catch (error) {
		console.error('POST /api/admin/courses - Error:', error);
		return NextResponse.json({ 
			error: error instanceof Error ? error.message : 'Unknown error',
			details: error 
		}, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	const body = await req.json();
	const { id, ...updates } = body;
	const supabase = getSupabaseAdmin();
	const { data, error } = await supabase.from('courses').update(updates).eq('id', id).select();
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data[0]);
}

export async function DELETE(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	const supabase = getSupabaseAdmin();
	const { error } = await supabase.from('courses').delete().eq('id', id);
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ success: true });
}

