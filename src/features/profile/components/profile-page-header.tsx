"use client";

import type { ReactNode } from "react";

interface ProfilePageHeaderProps {
	title: string;
	description?: string;
	action?: ReactNode;
}

export const ProfilePageHeader = ({
	title,
	description,
	action,
}: ProfilePageHeaderProps) => {
	return (
		<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 className="font-serif text-3xl text-secondary">{title}</h1>
				{description ? (
					<p className="mt-1 text-stone-400">{description}</p>
				) : null}
			</div>
			{action ? <div className="shrink-0">{action}</div> : null}
		</div>
	);
};
