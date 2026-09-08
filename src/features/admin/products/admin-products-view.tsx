"use client";

import { useEffect, useState } from "react";

import { gql } from "graphql-request";
import { Edit, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { graphqlClient } from "@/lib/graphql-client";

const GET_ADMIN_PRODUCTS = gql`
  query GetAdminProducts {
    products {
      id
      title
      price
      stock
      categoryName
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export function AdminProductsView() {
	const [products, setProducts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchProducts();
	}, []);

	async function fetchProducts() {
		setLoading(true);
		try {
			const data: any = await graphqlClient.request(GET_ADMIN_PRODUCTS);
			setProducts(data.products || []);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete(id: string) {
		if (confirm("Are you sure you want to delete this product?")) {
			try {
				await graphqlClient.request(DELETE_PRODUCT, { id });
				fetchProducts();
			} catch (e) {
				console.error(e);
			}
		}
	}

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-3xl tracking-tight">Products</h2>
				<Button>
					<Plus className="mr-2 h-4 w-4" /> Add Product
				</Button>
			</div>

			<div className="rounded-md border bg-white">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-base">
						<thead className="border-b bg-stone-50 text-sm text-stone-500 uppercase">
							<tr>
								<th className="px-6 py-4 font-medium">Title</th>
								<th className="px-6 py-4 font-medium">Category</th>
								<th className="px-6 py-4 font-medium">Price</th>
								<th className="px-6 py-4 font-medium">Stock</th>
								<th className="px-6 py-4 text-right font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td
										className="px-6 py-8 text-center text-stone-500"
										colSpan={5}
									>
										Loading products...
									</td>
								</tr>
							) : products.length === 0 ? (
								<tr>
									<td
										className="px-6 py-8 text-center text-stone-500"
										colSpan={5}
									>
										No products found.
									</td>
								</tr>
							) : (
								products.map((product) => (
									<tr
										className="border-b last:border-0 hover:bg-stone-50/50"
										key={product.id}
									>
										<td className="px-6 py-4 font-medium text-stone-900">
											{product.title}
										</td>
										<td className="px-6 py-4 text-stone-500">
											{product.categoryName || "-"}
										</td>
										<td className="px-6 py-4">
											AED {product.price.toFixed(2)}
										</td>
										<td className="px-6 py-4">{product.stock || 0}</td>
										<td className="px-6 py-4 text-right">
											<Button
												className="mr-2 h-8 w-8"
												size="icon"
												variant="ghost"
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
												onClick={() => handleDelete(product.id)}
												size="icon"
												variant="ghost"
											>
												<Trash2 className="h-4 w-4" />
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
