"use client";
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

type FormState = {
	ok?: boolean;
	message?: string;
	errors?: { name?: string; email?: string };
};

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button disabled={pending} type="submit" className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed">
			{pending ? 'Submitting...' : 'Submit'}
		</button>
	);
}

export function ContactForm({ action, initialState }: { action: (state: FormState, formData: FormData) => Promise<FormState>; initialState?: FormState }) {
	const [state, formAction] = useActionState<FormState, FormData>(action, (initialState || {}) as FormState);
    if (state?.ok) {
        return (
            <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">
                <h2 className="text-xl font-semibold">Thank you!</h2>
                <p className="mt-2">Your inquiry has been submitted. We will get back to you shortly.</p>
                <div className="mt-4 flex gap-3">
                    <a href="/courses" className="rounded-md border px-4 py-2 cursor-pointer">Explore Courses</a>
                    <a href="/" className="rounded-md bg-black px-4 py-2 text-white cursor-pointer">Go to Home</a>
                </div>
            </div>
        );
    }

    return (
        <form action={formAction} className="mt-8 space-y-4">
            {state?.message && !state.ok ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-800">{state.message}</div>
            ) : null}
            <div>
                <label className="block text-sm font-medium">Name</label>
                <input name="name" className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Your name" />
                {state?.errors?.name ? <p className="mt-1 text-sm text-red-600">{state.errors.name}</p> : null}
            </div>
            <div>
                <label className="block text-sm font-medium">Email</label>
                <input name="email" type="email" className="mt-1 w-full rounded-md border px-3 py-2" placeholder="you@example.com" />
                {state?.errors?.email ? <p className="mt-1 text-sm text-red-600">{state.errors.email}</p> : null}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Phone</label>
                    <input name="phone" className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Optional" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Course</label>
                    <select name="course" className="mt-1 w-full rounded-md border px-3 py-2">
                        <option value="">Select a course</option>
                        <option value="NEET">NEET</option>
                        <option value="JEE">JEE</option>
                        <option value="11 Class">11 Class</option>
                        <option value="12 Class">12 Class</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea name="message" rows={4} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="How can we help?" />
            </div>
            <SubmitButton />
        </form>
    );
}


