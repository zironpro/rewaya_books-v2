"use client";

import { Fragment } from "react";

import Link from "next/link";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { cn } from "@/lib/utils";

interface Crumb {
	label: string;
	href?: string;
}

interface BreadcrumbsProps {
	items: Crumb[];
	className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
	return (
		<Breadcrumb className={className}>
			<BreadcrumbList className={cn("min-w-0 text-sm")}>
				<BreadcrumbItem>
					<BreadcrumbLink
						className="transition-colors"
						render={<Link href="/" />}
					>
						Home
					</BreadcrumbLink>
				</BreadcrumbItem>

				{items.map((item, index) => (
					<Fragment
						key={
							item.href !== undefined
								? `${item.href}-${String(index)}`
								: `current-${item.label}-${String(index)}`
						}
					>
						<BreadcrumbSeparator className="opacity-50 [&>svg]:size-3" />
						<BreadcrumbItem>
							{item.href ? (
								<BreadcrumbLink
									className="truncate transition-colors"
									href={item.href}
									render={<Link href={item.href} />}
								>
									{item.label}
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage className="truncate text-secondary">
									{item.label}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
