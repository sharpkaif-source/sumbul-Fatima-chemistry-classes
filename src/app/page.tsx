export default function Home() {
  return (
    <section>
      <div className="bg-gradient-to-b from-teal-50 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl font-bold tracking-tight">Sumbul Fatima Chemistry Classes</h1>
          <p className="mt-4 text-lg text-slate-700 max-w-2xl">
            Expert Chemistry coaching for JEE, NEET, and Classes 11–12.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="/courses" className="rounded-md bg-black px-4 py-2 text-white cursor-pointer">Explore Courses</a>
            <a href="/contact" className="rounded-md border px-4 py-2 cursor-pointer">Book a Demo</a>
            <a href="/videos" className="rounded-md border px-4 py-2 cursor-pointer">Explore Videos</a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/videos" className="rounded-xl border bg-white p-6 hover:shadow cursor-pointer">
          <h3 className="font-semibold">Recorded Videos</h3>
          <p className="mt-2 text-slate-600 text-sm">Concept-wise chapters and exam-focused lectures.</p>
        </a>
        <a href="/notes" className="rounded-xl border bg-white p-6 hover:shadow cursor-pointer">
          <h3 className="font-semibold">Study Materials</h3>
          <p className="mt-2 text-slate-600 text-sm">Concise notes and practice resources.</p>
        </a>
        <a href="/live-classes" className="rounded-xl border bg-white p-6 hover:shadow cursor-pointer">
          <h3 className="font-semibold">Live Classes</h3>
          <p className="mt-2 text-slate-600 text-sm">Join upcoming sessions and revise key topics.</p>
        </a>
      </div>
    </section>
  );
}
