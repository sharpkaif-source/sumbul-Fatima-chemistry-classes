import { ReactNode } from 'react';

export function Card(props: { title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; children?: ReactNode }) {
	return (
		<article className="rounded-xl border bg-white p-5 shadow-sm hover:shadow transition-shadow">
			{props.title || props.subtitle ? (
				<header>
					{props.title ? <h3 className="text-lg font-semibold">{props.title}</h3> : null}
					{props.subtitle ? <p className="text-sm text-slate-500">{props.subtitle}</p> : null}
				</header>
			) : null}
			{props.children ? <div className="mt-3 text-slate-700">{props.children}</div> : null}
			{props.actions ? <div className="mt-4 flex gap-3">{props.actions}</div> : null}
		</article>
	);
}


