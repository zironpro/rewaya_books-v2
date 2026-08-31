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
			<header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
				<div className="container flex h-16 items-center px-4">
					<Link className="font-bold text-xl" href="/admin">
						Rewaya Admin
					</Link>
					<nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block">
						<Link
							href="/admin"
							className="text-base font-medium transition-colors hover:text-primary"
						>
							Dashboard
						</Link>
						<Link
							href="/admin/products"
							className="text-base font-medium text-stone-500 transition-colors hover:text-primary"
						>
							Products
						</Link>
						<Link
							href="/admin/bundles"
							className="text-base font-medium text-stone-500 transition-colors hover:text-primary"
						>
							Bundles
						</Link>
						<Link
							href="/admin/orders"
							className="text-base font-medium text-stone-500 transition-colors hover:text-primary"
						>
							Orders
						</Link>
						<Link
							href="/admin/users"
							className="text-base font-medium text-stone-500 transition-colors hover:text-primary"
						>
							Users
						</Link>
					</nav>
					<div className="ml-auto flex items-center space-x-4">
						<div className="text-base font-medium">{email}</div>
						<Link
							href="/"
							className="text-base text-stone-500 hover:text-primary"
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
