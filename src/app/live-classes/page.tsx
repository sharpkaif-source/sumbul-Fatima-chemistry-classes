import { getSupabaseServer } from '@/lib/supabaseServer';

export default async function LiveClassesPage() {
	const supabase = getSupabaseServer();
	const { data } = await supabase.from('live_classes').select('*').order('id');
	return (
		<section className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="text-3xl font-bold">Live Classes</h1>
			<div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{data?.map((c: any) => (
					<article key={c.id} className="rounded-lg border bg-white overflow-hidden hover:shadow-lg transition-shadow">
						<div className="p-4">
							<h3 className="font-semibold text-lg">{c.topic}</h3>
							<p className="text-sm text-slate-500 mt-1">{[c.date, c.time].filter(Boolean).join(' • ')}</p>
							{c.description ? <p className="mt-3 text-slate-700 whitespace-pre-line text-sm">{c.description}</p> : null}
							{c.meetingLink ? (
								<a
									href={c.meetingLink}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-4 inline-block rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 transition-colors cursor-pointer"
								>
									Join Class
								</a>
							) : null}
						</div>
					</article>
				))}
			</div>
		</section>
	);
}


