import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ContactForm } from './ContactForm';

type FormState = {
    ok?: boolean;
    message?: string;
    errors?: { name?: string; email?: string };
};

async function submitAction(_: FormState, formData: FormData): Promise<FormState> {
    'use server';
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim() || null;
    const course = (formData.get('course') as string)?.trim() || null;
    const message = (formData.get('message') as string)?.trim() || null;

    const errors: FormState['errors'] = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (errors.name || errors.email) {
        return { ok: false, errors, message: 'Please fix the errors and submit again.' };
    }

    try {
        const supabase = getSupabaseAdmin();
        const { error } = await supabase.from('student_inquiries').insert([
            { lead_type: 'Website Inquiry', name, email, phone, course, message },
        ]);
        if (error) return { ok: false, message: error.message };
        return { ok: true, message: 'Thank you! Your inquiry has been submitted.' };
    } catch (e: any) {
        return { ok: false, message: e?.message || 'Unexpected error' };
    }
}

export default function ContactPage() {
    // Render server messages using a hidden no-op, handled by client form state
    const initial: FormState = {};
    return (
        <section className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-bold">Contact Us</h1>
            <p className="mt-2 text-slate-700">Get in touch for admissions and queries.</p>

            {/* Client form renders validation and banners; server action handles DB */}
            {/* @ts-expect-error pass server action to client */}
            <ContactForm action={submitAction} initialState={initial} />
        </section>
    );
}


