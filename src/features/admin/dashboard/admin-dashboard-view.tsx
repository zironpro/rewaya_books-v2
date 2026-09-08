import { Card } from "@/components/ui/card";

export function AdminDashboardView() {
	return (
		<div className="flex flex-col space-y-4">
			<h2 className="font-bold text-3xl tracking-tight">Dashboard</h2>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="p-6">
					<div className="font-medium text-base text-stone-500">
						Total Revenue
					</div>
					<div className="font-bold text-2xl">AED 0</div>
				</Card>
				<Card className="p-6">
					<div className="font-medium text-base text-stone-500">Orders</div>
					<div className="font-bold text-2xl">+0</div>
				</Card>
				<Card className="p-6">
					<div className="font-medium text-base text-stone-500">Products</div>
					<div className="font-bold text-2xl">0</div>
				</Card>
				<Card className="p-6">
					<div className="font-medium text-base text-stone-500">
						Active Users
					</div>
					<div className="font-bold text-2xl">0</div>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4 flex min-h-[300px] items-center justify-center p-6 text-stone-500">
					Sales Chart Placeholder
				</Card>
				<Card className="col-span-3 flex min-h-[300px] items-center justify-center p-6 text-stone-500">
					Recent Sales Placeholder
				</Card>
			</div>
		</div>
	);
}
