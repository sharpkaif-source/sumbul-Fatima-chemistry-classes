'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/adminAuth';
import Link from 'next/link';

const adminPages = [
	{ href: '/admin/courses', label: 'Courses' },
	{ href: '/admin/testimonials', label: 'Testimonials' },
	{ href: '/admin/demo-videos', label: 'Demo Videos' },
	{ href: '/admin/recorded-videos', label: 'Recorded Videos' },
	{ href: '/admin/live-classes', label: 'Live Classes' },
	{ href: '/admin/study-materials', label: 'Study Materials' },
	{ href: '/admin/inquiries', label: 'Student Inquiries' },
];

export default function AdminDashboard() {
	const router = useRouter();
	const [mounted, setMounted] = useState(false);
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		setMounted(true);
		const auth = isAuthenticated();
		setAuthenticated(auth);
		if (!auth) {
			router.push('/admin/login');
		}
	}, [router]);

	if (!mounted) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center">
				<div>Loading...</div>
			</div>
		);
	}

	if (!authenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<header className="bg-white border-b shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
					<h1 className="text-2xl font-bold">Admin Dashboard</h1>
					<div className="ml-4">
						<button
							onClick={logout}
							type="button"
							className="rounded-md bg-red-600 px-4 py-1.5 text-white text-sm hover:bg-red-700 transition-colors cursor-pointer border-0 m-0"
						>
							Logout
						</button>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{adminPages.map((page) => (
						<Link
							key={page.href}
							href={page.href}
							className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow cursor-pointer"
						>
							<h2 className="text-xl font-semibold">{page.label}</h2>
							<p className="text-sm text-slate-600 mt-2">Manage {page.label.toLowerCase()}</p>
						</Link>
					))}
				</div>
			</main>
		</div>
	);
}

