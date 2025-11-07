import { getSupabaseServer } from '@/lib/supabaseServer';
import { getYouTubeVideoId, getYouTubeThumbnail } from '@/lib/youtube';
import Image from 'next/image';

export default async function DemoPage() {
	const supabase = getSupabaseServer();
	const { data } = await supabase.from('demo_videos').select('*').order('id');
	return (
		<section className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="text-3xl font-bold">Demo Class</h1>
			<div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{data?.map((v) => {
					const videoId = getYouTubeVideoId(v.youtubeLink);
					const thumbnail = getYouTubeThumbnail(videoId);
					return (
						<article key={v.id} className="rounded-lg border bg-white overflow-hidden hover:shadow-lg transition-shadow">
							<div className="relative aspect-video bg-slate-200">
								{videoId ? (
									<Image
										src={thumbnail}
										alt={v.title || 'Demo video thumbnail'}
										fill
										className="object-cover"
										unoptimized
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-slate-400">No thumbnail</div>
								)}
							</div>
							<div className="p-4">
								<h3 className="font-semibold text-lg">{v.title}</h3>
								{v.youtubeLink ? (
									<a
										href={v.youtubeLink}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-4 inline-block rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 transition-colors cursor-pointer"
									>
										Watch on YouTube
									</a>
								) : null}
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
}


