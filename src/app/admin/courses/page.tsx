'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/adminAuth';
import Link from 'next/link';

type Course = {
	id: number;
	name: string;
	description: string;
	category: string;
};

export default function AdminCourses() {
	const router = useRouter();
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState<Course | null>(null);
	const [formData, setFormData] = useState({ name: '', description: '', category: '' });
	const [errors, setErrors] = useState<{ name?: string; description?: string; category?: string }>({});

	useEffect(() => {
		if (!isAuthenticated()) {
			router.push('/admin/login');
			return;
		}
		fetchCourses();
	}, [router]);

	const fetchCourses = async () => {
		try {
			const res = await fetch('/api/admin/courses');
			const data = await res.json();
			setCourses(data);
		} catch (error) {
			console.error('Error fetching courses:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validate all fields
		const newErrors: { name?: string; description?: string; category?: string } = {};
		if (!formData.name.trim()) newErrors.name = 'Name is required';
		if (!formData.description.trim()) newErrors.description = 'Description is required';
		if (!formData.category.trim()) newErrors.category = 'Category is required';
		
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		
		setErrors({});
		try {
			let response;
			if (editing) {
				response = await fetch('/api/admin/courses', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ...formData, id: editing.id }),
				});
			} else {
				response = await fetch('/api/admin/courses', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				});
			}
			
			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error response:', errorData);
				alert(`Error saving course: ${errorData.error || 'Unknown error'}`);
				return;
			}
			
			const result = await response.json();
			console.log('Success:', result);
			setShowForm(false);
			setEditing(null);
			setFormData({ name: '', description: '', category: '' });
			fetchCourses();
		} catch (error) {
			console.error('Error saving course:', error);
			alert(`Error saving course: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	const handleEdit = (course: Course) => {
		setEditing(course);
		setFormData({ name: course.name, description: course.description, category: course.category });
		setShowForm(true);
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this course?')) return;
		try {
			await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' });
			fetchCourses();
		} catch (error) {
			console.error('Error deleting course:', error);
			alert('Error deleting course');
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
						<h1 className="text-2xl font-bold">Manage Courses</h1>
					</div>
					<button
						onClick={() => {
							setShowForm(true);
							setEditing(null);
							setFormData({ name: '', description: '', category: '' });
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
						<h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Course' : 'Add New Course'}</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">
									Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) => {
										setFormData({ ...formData, name: e.target.value });
										if (errors.name) setErrors({ ...errors, name: undefined });
									}}
									className={`w-full rounded-md border px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
									required
								/>
								{errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
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
									rows={4}
									required
								/>
								{errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
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
										setFormData({ name: '', description: '', category: '' });
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
								<th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{courses.map((course) => (
								<tr key={course.id} className="border-t">
									<td className="px-4 py-3">{course.id}</td>
									<td className="px-4 py-3 font-medium">{course.name}</td>
									<td className="px-4 py-3">{course.category}</td>
									<td className="px-4 py-3 text-sm text-slate-600 max-w-md truncate">{course.description}</td>
									<td className="px-4 py-3">
										<div className="flex gap-2">
											<button
												onClick={() => handleEdit(course)}
												className="rounded-md bg-green-600 px-2 py-0.5 text-white text-xs hover:bg-green-700 cursor-pointer"
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(course.id)}
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

