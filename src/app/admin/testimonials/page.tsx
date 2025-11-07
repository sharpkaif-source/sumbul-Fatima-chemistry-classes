'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/adminAuth';
import Link from 'next/link';

type Testimonial = {
	id: number;
	studentName: string;
	course: string;
	feedback: string;
};

export default function AdminTestimonials() {
	const router = useRouter();
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState<Testimonial | null>(null);
	const [formData, setFormData] = useState({ studentName: '', course: '', feedback: '' });
	const [errors, setErrors] = useState<{ studentName?: string; course?: string; feedback?: string }>({});

	useEffect(() => {
		if (!isAuthenticated()) {
			router.push('/admin/login');
			return;
		}
		fetchTestimonials();
	}, [router]);

	const fetchTestimonials = async () => {
		try {
			const res = await fetch('/api/admin/testimonials');
			const data = await res.json();
			setTestimonials(data);
		} catch (error) {
			console.error('Error fetching testimonials:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validate all fields
		const newErrors: { studentName?: string; course?: string; feedback?: string } = {};
		if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
		if (!formData.course.trim()) newErrors.course = 'Course is required';
		if (!formData.feedback.trim()) newErrors.feedback = 'Feedback is required';
		
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		
		setErrors({});
		try {
			let response;
			if (editing) {
				response = await fetch('/api/admin/testimonials', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ...formData, id: editing.id }),
				});
			} else {
				response = await fetch('/api/admin/testimonials', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				});
			}
			
			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error response:', errorData);
				alert(`Error saving testimonial: ${errorData.error || 'Unknown error'}`);
				return;
			}
			
			const result = await response.json();
			console.log('Success:', result);
			setShowForm(false);
			setEditing(null);
			setFormData({ studentName: '', course: '', feedback: '' });
			fetchTestimonials();
		} catch (error) {
			console.error('Error saving testimonial:', error);
			alert(`Error saving testimonial: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	const handleEdit = (testimonial: Testimonial) => {
		setEditing(testimonial);
		setFormData({
			studentName: testimonial.studentName,
			course: testimonial.course || '',
			feedback: testimonial.feedback,
		});
		setShowForm(true);
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this testimonial?')) return;
		try {
			await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
			fetchTestimonials();
		} catch (error) {
			console.error('Error deleting testimonial:', error);
			alert('Error deleting testimonial');
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
						<h1 className="text-2xl font-bold">Manage Testimonials</h1>
					</div>
					<button
						onClick={() => {
							setShowForm(true);
							setEditing(null);
							setFormData({ studentName: '', course: '', feedback: '' });
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
						<h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">
									Student Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={formData.studentName}
									onChange={(e) => {
										setFormData({ ...formData, studentName: e.target.value });
										if (errors.studentName) setErrors({ ...errors, studentName: undefined });
									}}
									className={`w-full rounded-md border px-3 py-2 ${errors.studentName ? 'border-red-500' : ''}`}
									required
								/>
								{errors.studentName && <p className="mt-1 text-sm text-red-500">{errors.studentName}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Course <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={formData.course}
									onChange={(e) => {
										setFormData({ ...formData, course: e.target.value });
										if (errors.course) setErrors({ ...errors, course: undefined });
									}}
									className={`w-full rounded-md border px-3 py-2 ${errors.course ? 'border-red-500' : ''}`}
									required
								/>
								{errors.course && <p className="mt-1 text-sm text-red-500">{errors.course}</p>}
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Feedback <span className="text-red-500">*</span>
								</label>
								<textarea
									value={formData.feedback}
									onChange={(e) => {
										setFormData({ ...formData, feedback: e.target.value });
										if (errors.feedback) setErrors({ ...errors, feedback: undefined });
									}}
									className={`w-full rounded-md border px-3 py-2 ${errors.feedback ? 'border-red-500' : ''}`}
									rows={4}
									required
								/>
								{errors.feedback && <p className="mt-1 text-sm text-red-500">{errors.feedback}</p>}
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
										setFormData({ studentName: '', course: '', feedback: '' });
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
								<th className="px-4 py-3 text-left text-sm font-semibold">Student Name</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Course</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Feedback</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{testimonials.map((testimonial) => (
								<tr key={testimonial.id} className="border-t">
									<td className="px-4 py-3">{testimonial.id}</td>
									<td className="px-4 py-3 font-medium">{testimonial.studentName}</td>
									<td className="px-4 py-3">{testimonial.course || '-'}</td>
									<td className="px-4 py-3 text-sm text-slate-600 max-w-md truncate">{testimonial.feedback}</td>
									<td className="px-4 py-3">
										<div className="flex gap-2">
											<button
												onClick={() => handleEdit(testimonial)}
												className="rounded-md bg-green-600 px-2 py-0.5 text-white text-xs hover:bg-green-700 cursor-pointer"
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(testimonial.id)}
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

