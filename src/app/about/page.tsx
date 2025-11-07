export default function AboutPage() {
	return (
		<section className="mx-auto max-w-4xl px-4 py-10">
			<h1 className="text-4xl font-bold">About Sumbul Fatima Chemistry Expert</h1>
			
			<div className="mt-8 space-y-8">
				<div>
					<p className="text-lg text-slate-700 leading-relaxed">
						Sumbul is a passionate and experienced chemistry tutor with a mission to make chemistry accessible and enjoyable for all students. She has a deep understanding of the subject and a proven track record of helping students achieve their academic goals.
					</p>
				</div>

				<div className="rounded-xl border-l-4 border-teal-500 bg-teal-50 p-6">
					<blockquote className="text-lg italic text-slate-800">
						"Teaching chemistry is not about memorizing reactions — it's about understanding the logic behind them."
					</blockquote>
				</div>

				<div>
					<h2 className="text-2xl font-semibold mb-4">Qualifications</h2>
					<ul className="space-y-2 text-slate-700">
						<li className="flex items-center gap-2">
							<span className="text-teal-600">•</span>
							<span>B.Sc. Jamia University, New Delhi</span>
						</li>
						<li className="flex items-center gap-2">
							<span className="text-teal-600">•</span>
							<span>M.Sc. Rohilkhand University, Bareilly (UP)</span>
						</li>
						<li className="flex items-center gap-2">
							<span className="text-teal-600">•</span>
							<span>B.Ed. Rohilkhand University, Bareilly (UP)</span>
						</li>
					</ul>
				</div>

				<div>
					<h2 className="text-2xl font-semibold mb-4">Teaching Style</h2>
					<p className="text-slate-700 leading-relaxed">
						Sumbul employs a student-centric teaching methodology, focusing on interactive sessions, practical examples, and regular assessments to ensure a thorough understanding of the concepts.
					</p>
				</div>
			</div>
		</section>
	);
}


