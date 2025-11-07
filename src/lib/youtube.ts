export function getYouTubeVideoId(url: string | null | undefined): string | null {
	if (!url) return null;
	
	// Match various YouTube URL formats
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/youtube\.com\/watch\?.*v=([^&\n?#]+)/,
	];
	
	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}
	
	return null;
}

export function getYouTubeThumbnail(videoId: string | null): string {
	if (!videoId) return '/placeholder-video.jpg';
	return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

