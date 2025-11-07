'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/adminAuth';
import Link from 'next/link';

type StudyMaterial = {
	id: number;
	title: string;
	description: string;
	fileUrl: string;
	category: string;
};

export default function AdminStudyMaterials() {
	const router = useRouter();
	const [materials, setMaterials] = useState<StudyMaterial[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState<StudyMaterial | null>(null);
	const [formData, setFormData] = useState({ title: '', description: '', fileUrl: '', category: '' });
	const [errors, setErrors] = useState<{ title?: string; description?: string; fileUrl?: string; category?: string }>({});

	useEffect(() => {
		if (!isAuthenticated()) {
			router.push('/admin/login');
			return;
		}
		fetchMaterials();
	}, [router]);

	const fetchMaterials = async () => {
		try {
			const res = await fetch('/api/admin/study-materials');
			const data = await res.json();
			setMaterials(data);
		} catch (error) {
			console.error('Error fetching materials:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validate all fields
		const newErrors: { title?: string; description?: string; fileUrl?: string; category?: string } = {};
		if (!formData.title.trim()) newErrors.title = 'Title is required';
		if (!formData.description.trim()) newErrors.description = 'Description is required';
		if (!formData.fileUrl.trim()) newErrors.fileUrl = 'File URL is required';
		if (!formData.category.trim()) newErrors.category = 'Category is required';
		
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		
		setErrors({});
		try {
			let response;
			if (editing) {
				response = await fetch('/api/admin/study-materials', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ...formData, id: editing.id }),
				});
			} else {
				response = await fetch('/api/admin/study-materials', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				});
			}
			
			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error response:', errorData);
				alert(`Error saving material: ${errorData.error || 'Unknown error'}`);
				return;
			}
			
			const result = await response.json();
			console.log('Success:', result);
			setShowForm(false);
			setEditing(null);
			setFormData({ title: '', description: '', fileUrl: '', category: '' });
			fetchMaterials();
		} catch (error) {
			console.error('Error saving material:', error);
			alert(`Error saving material: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	const handleEdit = (material: StudyMaterial) => {
		setEditing(material);
		setFormData({
			title: material.title || '',
			description: material.description || '',
			fileUrl: material.fileUrl || '',
			category: material.category || '',
		});
		setShowForm(true);
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this material?')) return;
		try {
			await fetch(`/api/admin/study-materials?id=${id}`, { method: 'DELETE' });
			fetchMaterials();
		} catch (error) {
			console.error('Error deleting material:', error);
			alert('Error deleting material');
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
						<h1 className="text-2xl font-bold">Manage Study Materials</h1>
					</div>
					<button
						onClick={() => {
							setShowForm(true);
							setEditing(null);
							setFormData({ title: '', description: '', fileUrl: '', category: '' });
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
						<h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Study Material' : 'Add New Study Material'}</h2>
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
									Description <span className="text-red-500">*</span>
								</label>
								<textarea
									value={formData.description}
									onChange={(e) => {
										setFormData({ ...formData, description: e.target.value });
										if (errors.description) setErrors({ ...errors, description: undefined });
									}}
									className={`w-full rounded-md border px-3 py-2 ${errors.description ? 'border-red-500' : ''}`}
									rows={3}
									required
								/>
								{errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									File URL <span className="text-red-500">*</span>
								</label>
								<input
									type="url"
									value={formData.fileUrl}
									onChange={(e) => {
										setFormData({ ...formData, fileUrl: e.target.value });
										if (errors.fileUrl) setErrors({ ...errors, fileUrl: undefined });
									}}
									className={`w-full rounded-md border px-3 py-2 ${errors.fileUrl ? 'border-red-500' : ''}`}
									placeholder="https://..."
									required
								/>
								{errors.fileUrl && <p className="mt-1 text-sm text-red-500">{errors.fileUrl}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Category <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={formData.category}
									onChange={(e) => {
										setFormData({ ...formData, category: e.target.value });
										if (errors.category) setErrors({ ...errors, category: undefined });
									}}
									className={`w-full rounded-md border px-3 py-2 ${errors.category ? 'border-red-500' : ''}`}
									required
								/>
								{errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
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
										setFormData({ title: '', description: '', fileUrl: '', category: '' });
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
								<th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">File URL</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{materials.map((material) => (
								<tr key={material.id} className="border-t">
									<td className="px-4 py-3">{material.id}</td>
									<td className="px-4 py-3 font-medium">{material.title}</td>
									<td className="px-4 py-3">{material.category || '-'}</td>
									<td className="px-4 py-3 text-sm text-blue-600 truncate max-w-md">
										<a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
											{material.fileUrl}
										</a>
									</td>
									<td className="px-4 py-3">
										<div className="flex gap-2">
											<button
												onClick={() => handleEdit(material)}
												className="rounded-md bg-green-600 px-2 py-0.5 text-white text-xs hover:bg-green-700 cursor-pointer"
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(material.id)}
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

