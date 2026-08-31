import { Card } from "@/components/ui/card";

export function AdminDashboardView() {
	return (
		<div className="flex flex-col space-y-4">
			<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="p-6">
					<div className="text-base font-medium text-stone-500">
						Total Revenue
					</div>
					<div className="text-2xl font-bold">AED 0</div>
				</Card>
				<Card className="p-6">
					<div className="text-base font-medium text-stone-500">Orders</div>
					<div className="text-2xl font-bold">+0</div>
				</Card>
				<Card className="p-6">
					<div className="text-base font-medium text-stone-500">Products</div>
					<div className="text-2xl font-bold">0</div>
				</Card>
				<Card className="p-6">
					<div className="text-base font-medium text-stone-500">
						Active Users
					</div>
					<div className="text-2xl font-bold">0</div>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4 p-6 min-h-[300px] flex items-center justify-center text-stone-500">
					Sales Chart Placeholder
				</Card>
				<Card className="col-span-3 p-6 min-h-[300px] flex items-center justify-center text-stone-500">
					Recent Sales Placeholder
				</Card>
			</div>
		</div>
	);
}
