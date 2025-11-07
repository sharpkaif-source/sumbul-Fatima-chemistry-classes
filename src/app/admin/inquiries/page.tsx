'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/adminAuth';
import Link from 'next/link';

type Inquiry = {
	id: number;
	lead_type: string;
	name: string;
	email: string;
	phone: string;
	course: string;
	message: string;
	created_at: string;
	read?: boolean;
};

export default function AdminInquiries() {
	const router = useRouter();
	const [inquiries, setInquiries] = useState<Inquiry[]>([]);
	const [loading, setLoading] = useState(true);
	const [readIds, setReadIds] = useState<Set<number>>(new Set());

	useEffect(() => {
		if (!isAuthenticated()) {
			router.push('/admin/login');
			return;
		}
		fetchInquiries();
	}, [router]);

	const fetchInquiries = async () => {
		try {
			const res = await fetch('/api/admin/inquiries');
			const data = await res.json();
			setInquiries(data);
			// Load read status from localStorage
			const savedReadIds = localStorage.getItem('read_inquiries');
			if (savedReadIds) {
				setReadIds(new Set(JSON.parse(savedReadIds)));
			}
		} catch (error) {
			console.error('Error fetching inquiries:', error);
		} finally {
			setLoading(false);
		}
	};

	const markAsRead = (id: number) => {
		const newReadIds = new Set(readIds);
		newReadIds.add(id);
		setReadIds(newReadIds);
		localStorage.setItem('read_inquiries', JSON.stringify(Array.from(newReadIds)));
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this inquiry?')) return;
		try {
			await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' });
			fetchInquiries();
		} catch (error) {
			console.error('Error deleting inquiry:', error);
			alert('Error deleting inquiry');
		}
	};

	if (loading) return <div className="p-8">Loading...</div>;

	return (
		<div className="min-h-screen bg-slate-50">
			<header className="bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
					<Link href="/admin/dashboard" className="text-black hover:opacity-70 cursor-pointer">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
						</svg>
					</Link>
					<h1 className="text-2xl font-bold">Student Inquiries</h1>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-8">
				<div className="bg-white rounded-lg border overflow-hidden">
					<table className="w-full">
						<thead className="bg-slate-50">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Course</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Message</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
								<th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{inquiries.map((inquiry) => {
								const isUnread = !readIds.has(inquiry.id);
								return (
								<tr 
									key={inquiry.id} 
									className={`border-t ${isUnread ? 'bg-yellow-50 font-medium' : ''} cursor-pointer`}
									onClick={() => markAsRead(inquiry.id)}
								>
									<td className="px-4 py-3">{inquiry.id}</td>
									<td className="px-4 py-3 font-medium">{inquiry.name}</td>
									<td className="px-4 py-3">{inquiry.email}</td>
									<td className="px-4 py-3">{inquiry.phone || '-'}</td>
									<td className="px-4 py-3">{inquiry.course || '-'}</td>
									<td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{inquiry.message || '-'}</td>
									<td className="px-4 py-3 text-sm">
										{inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString() : '-'}
									</td>
									<td className="px-4 py-3">
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(inquiry.id);
											}}
											className="rounded-md bg-red-600 px-2 py-0.5 text-white text-xs hover:bg-red-700 cursor-pointer"
										>
											Delete
										</button>
									</td>
								</tr>
							);
							})}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
}

