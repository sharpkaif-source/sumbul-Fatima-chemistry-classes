import { getSupabaseServer } from '@/lib/supabaseServer';

export default async function NotesPage() {
	const supabase = getSupabaseServer();
	const { data } = await supabase.from('study_materials').select('*').order('id');
	return (
		<section className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="text-3xl font-bold">Study Materials</h1>
			<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
				{data?.map((m: any) => (
					<article key={m.id} className="rounded-lg border p-4 bg-white">
						<h3 className="font-semibold">{m.title}</h3>
						{m.category ? <p className="text-sm text-slate-500">{m.category}</p> : null}
						{m.description ? <p className="mt-2 text-slate-700 whitespace-pre-line">{m.description}</p> : null}
						{m.fileUrl || m.file_url ? (
							<a className="mt-3 inline-block rounded-md border px-3 py-1 cursor-pointer" href={m.fileUrl || m.file_url} target="_blank">Download</a>
						) : null}
					</article>
				))}
			</div>
		</section>
	);
}


