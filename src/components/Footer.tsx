export function Footer() {
	return (
		<footer className="mt-16 border-t bg-white">
			<div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-3">
				<p>© {new Date().getFullYear()} Sumbul Fatima Chemistry Classes</p>
				<p>
					<strong>Expert Chemistry</strong> for JEE | NEET | Classes 11–12
				</p>
			</div>
		</footer>
	);
}


