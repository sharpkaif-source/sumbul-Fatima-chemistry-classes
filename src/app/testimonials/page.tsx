import { getSupabaseServer } from '@/lib/supabaseServer';

export default async function TestimonialsPage() {
	const supabase = getSupabaseServer();
	const { data } = await supabase.from('testimonials').select('*').order('id');
	return (
		<section className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="text-3xl font-bold">Testimonials</h1>
			<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
				{data?.map((t) => (
					<div key={t.id} className="rounded-xl border bg-white p-5 shadow-sm">
						<h3 className="font-semibold">{t.studentName}</h3>
						{t.course ? <p className="text-sm text-slate-500">{t.course}</p> : null}
						<p className="mt-3 text-slate-700 whitespace-pre-line">{t.feedback}</p>
					</div>
				))}
			</div>
		</section>
	);
}


