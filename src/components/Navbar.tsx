'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const nav = [
	{ href: '/', label: 'Home' },
	{ href: '/about', label: 'About' },
	{ href: '/courses', label: 'Courses' },
	{ href: '/videos', label: 'Videos' },
	{ href: '/notes', label: 'Notes' },
	{ href: '/live-classes', label: 'Live Classes' },
	{ href: '/demo', label: 'Demo' },
	{ href: '/testimonials', label: 'Testimonials' },
	{ href: '/contact', label: 'Contact' },
];

export function Navbar() {
	const pathname = usePathname();

	return (
		<header className="sticky top-0 z-50 border-b bg-white">
			<div className="mx-auto max-w-7xl px-4 py-3">
				<div className="flex items-center justify-between">
					{/* Logo - Left */}
					<Link href="/" className="flex items-center cursor-pointer">
						<Image src="/logo.svg" alt="SFC" width={180} height={36} />
					</Link>

					{/* Navigation - Center */}
					<nav className="hidden lg:flex items-center gap-2">
						{nav.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
										isActive
											? 'text-blue-600 bg-blue-50 font-semibold'
											: 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
									}`}
								>
									{item.label}
								</Link>
							);
						})}
					</nav>

					{/* Login Button - Right */}
					<div className="ml-4">
						<Link
							href="/admin/login"
							target="_blank"
							className="rounded-md bg-blue-600 px-4 py-1.5 text-white text-sm hover:bg-blue-700 transition-colors cursor-pointer"
						>
							Login
						</Link>
					</div>
				</div>

				{/* Mobile Navigation */}
				<nav className="lg:hidden mt-3 flex flex-wrap gap-2 justify-center">
					{nav.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
									isActive
										? 'text-blue-600 bg-blue-50 font-semibold'
										: 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
								}`}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>
			</div>
		</header>
	);
}


