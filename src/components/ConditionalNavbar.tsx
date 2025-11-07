'use client';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function ConditionalNavbar({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isAdminPage = pathname?.startsWith('/admin');

	if (isAdminPage) {
		return <>{children}</>;
	}

	return (
		<div className="min-h-dvh flex flex-col">
			<Navbar />
			<main className="flex-1 bg-slate-50">{children}</main>
			<Footer />
		</div>
	);
}

