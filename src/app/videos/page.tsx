import { getSupabaseServer } from '@/lib/supabaseServer';
import { getYouTubeVideoId, getYouTubeThumbnail } from '@/lib/youtube';
import Image from 'next/image';

export default async function VideosPage() {
	const supabase = getSupabaseServer();
	const { data } = await supabase.from('recorded_videos').select('*').order('id');
	return (
		<section className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="text-3xl font-bold">Recorded Videos</h1>
			<div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{data?.map((v: any) => {
					const videoUrl = v.youtubeLink || v.youtube_link;
					const videoId = getYouTubeVideoId(videoUrl);
					const thumbnail = getYouTubeThumbnail(videoId);
					return (
						<article key={v.id} className="rounded-lg border bg-white overflow-hidden hover:shadow-lg transition-shadow">
							<div className="relative aspect-video bg-slate-200">
								{videoId ? (
									<Image
										src={thumbnail}
										alt={v.title || v.chapterName || 'Video thumbnail'}
										fill
										className="object-cover"
										unoptimized
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-slate-400">No thumbnail</div>
								)}
							</div>
							<div className="p-4">
								<h3 className="font-semibold text-lg">{v.title || v.chapterName}</h3>
								{v.category ? <p className="text-sm text-slate-500 mt-1">{v.category}</p> : null}
								{videoUrl ? (
									<a
										href={videoUrl}
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


