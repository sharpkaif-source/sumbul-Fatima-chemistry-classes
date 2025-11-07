export default function ImportPage() {
	return (
		<section className="mx-auto max-w-3xl px-4 py-10">
			<h1 className="text-3xl font-bold">CSV Import</h1>
			<p className="mt-2 text-slate-600">Upload CSVs to populate content.</p>

			<div className="mt-8 space-y-8">
				<ImportForm title="Courses" action="/api/import/courses" />
				<ImportForm title="Testimonials" action="/api/import/testimonials" />
				<ImportForm title="Demo Videos" action="/api/import/demo-videos" />
				<ImportForm title="Student Inquiries" action="/api/import/inquiries" />
				<ImportForm title="Recorded Videos" action="/api/import/recorded-videos" />
				<ImportForm title="Live Classes" action="/api/import/live-classes" />
				<ImportForm title="Study Materials" action="/api/import/study-materials" />
			</div>
		</section>
	);
}

function ImportForm(props: { title: string; action: string }) {
	return (
		<form className="rounded-lg border p-4 bg-white" action={props.action} method="POST" encType="multipart/form-data">
			<h2 className="text-lg font-semibold">{props.title}</h2>
			<div className="mt-3 flex items-center gap-3">
				<input required className="block w-full text-sm" type="file" name="file" accept=".csv,text/csv" />
				<button className="rounded-md bg-black px-4 py-2 text-white cursor-pointer" type="submit">Upload</button>
			</div>
			<p className="mt-2 text-xs text-slate-500">Send as multipart/form-data with field name "file".</p>
		</form>
	);
}


