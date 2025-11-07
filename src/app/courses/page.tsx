import { getSupabaseServer } from '@/lib/supabaseServer';

export default async function CoursesPage() {
	const supabase = getSupabaseServer();
	const { data } = await supabase.from('courses').select('*').order('id');
	return (
		<section className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="text-3xl font-bold">Courses</h1>
			<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
				{data?.map((c) => (
					<article key={c.id} className="rounded-lg border p-4 bg-white">
						<h3 className="text-xl font-semibold">{c.name}</h3>
						<p className="mt-2 text-sm text-slate-500">{c.category}</p>
						<p className="mt-3 text-slate-700 whitespace-pre-line">{c.description}</p>
					</article>
				))}
			</div>
		</section>
	);
}


