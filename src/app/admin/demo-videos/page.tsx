'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/adminAuth';
import Link from 'next/link';

type DemoVideo = {
	id: number;
	title: string;
	youtubeLink: string;
};

export default function AdminDemoVideos() {
	const router = useRouter();
	const [videos, setVideos] = useState<DemoVideo[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState<DemoVideo | null>(null);
	const [formData, setFormData] = useState({ title: '', youtubeLink: '' });
	const [errors, setErrors] = useState<{ title?: string; youtubeLink?: string }>({});

	useEffect(() => {
		if (!isAuthenticated()) {
			router.push('/admin/login');
			return;
		}
		fetchVideos();
	}, [router]);

	const fetchVideos = async () => {
		try {
			const res = await fetch('/api/admin/demo-videos');
			const data = await res.json();
			setVideos(data);
		} catch (error) {
			console.error('Error fetching videos:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validate all fields
		const newErrors: { title?: string; youtubeLink?: string } = {};
		if (!formData.title.trim()) newErrors.title = 'Title is required';
		if (!formData.youtubeLink.trim()) newErrors.youtubeLink = 'YouTube link is required';
		
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		
		setErrors({});
		try {
			let response;
			if (editing) {
				response = await fetch('/api/admin/demo-videos', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ...formData, id: editing.id }),
				});
			} else {
				response = await fetch('/api/admin/demo-videos', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				});
			}
			
			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error response:', errorData);
				alert(`Error saving video: ${errorData.error || 'Unknown error'}`);
				return;
			}
			
			const result = await response.json();
			console.log('Success:', result);
			setShowForm(false);
			setEditing(null);
			setFormData({ title: '', youtubeLink: '' });
			fetchVideos();
		} catch (error) {
			console.error('Error saving video:', error);
			alert(`Error saving video: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	const handleEdit = (video: DemoVideo) => {
		setEditing(video);
		setFormData({ title: video.title, youtubeLink: video.youtubeLink });
		setShowForm(true);
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this video?')) return;
		try {
			await fetch(`/api/admin/demo-videos?id=${id}`, { method: 'DELETE' });
			fetchVideos();
		} catch (error) {
			console.error('Error deleting video:', error);
			alert('Error deleting video');
		}
	};

	if (loading) return <div className="p-8">Loading...</div>;

	return (
		<div className="min-h-screen bg-slate-50">
			<header className="bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/admin/dashboard" className="text-black hover:opacity-70 cursor-pointer">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
							</svg>
						</Link>
						<h1 className="text-2xl font-bold">Manage Demo Videos</h1>
					</div>
					<button
						onClick={() => {
							setShowForm(true);
							setEditing(null);
							setFormData({ title: '', youtubeLink: '' });
							setErrors({});
						}}
						className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
					>
						Add New
					</button>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-8">
				{showForm && (
					<div className="bg-white rounded-lg border p-6 mb-6">
						<h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Demo Video' : 'Add New Demo Video'}</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">
									Title <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={formData.title}
									onChange={(e) => {
										setFormData({ ...formData, title: e.target.value });
										if (errors.title) setErrors({ ...errors, title: undefined });
									}}
									className={`w-full rounded-md border px-3 py-2 ${errors.title ? 'border-red-500' : ''}`}
									required
								/>
								{errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									YouTube Link <span className="text-red-500">*</span>
								</label>
								<input
									type="url"
									value={formData.youtubeLink}
									onChange={(e) => {
										setFormData({ ...formData, youtubeLink: e.target.value });
										if (errors.youtubeLink) setErrors({ ...errors, youtubeLink: undefined });
									}}
									className={`w-full rounded-md border px-3 py-2 ${errors.youtubeLink ? 'border-red-500' : ''}`}
									placeholder="https://www.youtube.com/watch?v=..."
									required
								/>
								{errors.youtubeLink && <p className="mt-1 text-sm text-red-500">{errors.youtubeLink}</p>}
							</div>
							<div className="flex gap-3">
								<button type="submit" className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 cursor-pointer">
									{editing ? 'Update' : 'Add'}
								</button>
								<button
									type="button"
									onClick={() => {
										setShowForm(false);
										setEditing(null);
										setFormData({ title: '', youtubeLink: '' });
										setErrors({});
									}}
									className="rounded-md border px-4 py-2 cursor-pointer"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				)}

				<div className="bg-white rounded-lg border overflow-hidden">
					<table className="w-full">
						<thead className="bg-slate-50">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">YouTube Link</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{videos.map((video) => (
								<tr key={video.id} className="border-t">
									<td className="px-4 py-3">{video.id}</td>
									<td className="px-4 py-3 font-medium">{video.title}</td>
									<td className="px-4 py-3 text-sm text-blue-600 truncate max-w-md">
										<a href={video.youtubeLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
											{video.youtubeLink}
										</a>
									</td>
									<td className="px-4 py-3">
										<div className="flex gap-2">
											<button
												onClick={() => handleEdit(video)}
												className="rounded-md bg-green-600 px-2 py-0.5 text-white text-xs hover:bg-green-700 cursor-pointer"
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(video.id)}
												className="rounded-md bg-red-600 px-2 py-0.5 text-white text-xs hover:bg-red-700 cursor-pointer"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
}

