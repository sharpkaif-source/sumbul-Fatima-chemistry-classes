'use client';

export function isAuthenticated(): boolean {
	if (typeof window === 'undefined') return false;
	return sessionStorage.getItem('admin_authenticated') === 'true';
}

export function logout() {
	if (typeof window !== 'undefined') {
		sessionStorage.removeItem('admin_authenticated');
		window.location.href = '/admin/login';
	}
}

