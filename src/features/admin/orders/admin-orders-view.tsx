"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { graphqlClient } from "@/lib/graphql-client";
import { gql } from "graphql-request";

const GET_ADMIN_ORDERS = gql`
  query GetAdminOrders {
    orders {
      id
      email
      status
      total
      createdAt
      items {
        title
        bundleId
        quantity
      }
    }
  }
`;

export function AdminOrdersView() {
	const [orders, setOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchOrders();
	}, []);

	async function fetchOrders() {
		setLoading(true);
		try {
			const data: any = await graphqlClient.request(GET_ADMIN_ORDERS);
			setOrders(data.orders || []);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">Orders</h2>
			</div>

			<div className="rounded-md border bg-white">
				<div className="overflow-x-auto">
					<table className="w-full text-base text-left">
						<thead className="text-sm text-stone-500 uppercase bg-stone-50 border-b">
							<tr>
								<th className="px-6 py-4 font-medium">Order ID</th>
								<th className="px-6 py-4 font-medium">Date</th>
								<th className="px-6 py-4 font-medium">Customer</th>
								<th className="px-6 py-4 font-medium">Items</th>
								<th className="px-6 py-4 font-medium">Status</th>
								<th className="px-6 py-4 font-medium">Total</th>
								<th className="px-6 py-4 font-medium text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-8 text-center text-stone-500"
									>
										Loading orders...
									</td>
								</tr>
							) : orders.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-8 text-center text-stone-500"
									>
										No orders found.
									</td>
								</tr>
							) : (
								orders.map((order) => (
									<tr
										key={order.id}
										className="border-b last:border-0 hover:bg-stone-50/50"
									>
										<td className="px-6 py-4 font-medium text-stone-900">
											{order.id.slice(-6).toUpperCase()}
										</td>
										<td className="px-6 py-4 text-stone-500">
											{new Date(Number(order.createdAt)).toLocaleDateString()}
										</td>
										<td className="px-6 py-4">{order.email}</td>
										<td className="px-6 py-4">
											<div className="flex flex-col gap-1">
												{order.items?.map((item: any, idx: number) => (
													<span key={idx} className="text-sm">
														{item.quantity}x {item.bundleId ? "(Bundle) " : ""}{item.title}
													</span>
												))}
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-2 py-1 rounded-full text-sm font-medium ${
													order.status === "PENDING"
														? "bg-yellow-100 text-yellow-800"
														: order.status === "COMPLETED"
															? "bg-green-100 text-green-800"
															: "bg-stone-100 text-stone-800"
												}`}
											>
												{order.status}
											</span>
										</td>
										<td className="px-6 py-4 font-medium">
											AED {order.total.toFixed(2)}
										</td>
										<td className="px-6 py-4 text-right">
											<Button variant="ghost" size="icon" className="h-8 w-8">
												<Eye className="h-4 w-4" />
											</Button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
