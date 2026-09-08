import Link from "next/link";

export function AdminLayoutView({
	children,
	email,
}: {
	children: React.ReactNode;
	email: string | null | undefined;
}) {
	return (
		<div className="flex min-h-screen flex-col bg-stone-50">
			<header className="sticky top-0 z-40 border-stone-200 border-b bg-white">
				<div className="container flex h-16 items-center px-4">
					<Link className="font-bold text-xl" href="/admin">
						Rewaya Admin
					</Link>
					<nav className="mx-6 flex hidden items-center space-x-4 md:block lg:space-x-6">
						<Link
							className="font-medium text-base transition-colors hover:text-primary"
							href="/admin"
						>
							Dashboard
						</Link>
						<Link
							className="font-medium text-base text-stone-500 transition-colors hover:text-primary"
							href="/admin/products"
						>
							Products
						</Link>
						<Link
							className="font-medium text-base text-stone-500 transition-colors hover:text-primary"
							href="/admin/bundles"
						>
							Bundles
						</Link>
						<Link
							className="font-medium text-base text-stone-500 transition-colors hover:text-primary"
							href="/admin/orders"
						>
							Orders
						</Link>
						<Link
							className="font-medium text-base text-stone-500 transition-colors hover:text-primary"
							href="/admin/users"
						>
							Users
						</Link>
					</nav>
					<div className="ml-auto flex items-center space-x-4">
						<div className="font-medium text-base">{email}</div>
						<Link
							className="text-base text-stone-500 hover:text-primary"
							href="/"
						>
							Go to Store
						</Link>
					</div>
				</div>
			</header>
			<div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
		</div>
	);
}
