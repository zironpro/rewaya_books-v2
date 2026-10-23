"use client";

import { useEffect, useState } from "react";

import { gql } from "graphql-request";
import { Edit, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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

const DELETE_PRODUCTS = gql`
  mutation DeleteProducts($ids: [ID!]!) {
    deleteProducts(ids: $ids)
  }
`;

export function AdminProductsView() {
	const [products, setProducts] = useState<any[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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
				setSelectedIds((prev) => prev.filter((item) => item !== id));
				fetchProducts();
			} catch (e) {
				console.error(e);
			}
		}
	}

	async function handleBulkDelete() {
		if (selectedIds.length === 0) return;
		if (
			!confirm(
				`Are you sure you want to delete ${selectedIds.length} selected product(s)?`
			)
		) {
			return;
		}

		setIsBulkDeleting(true);
		try {
			await graphqlClient.request(DELETE_PRODUCTS, { ids: selectedIds });
			setSelectedIds([]);
			fetchProducts();
		} catch (e) {
			console.error("Bulk delete error", e);
			alert("Failed to delete selected products.");
		} finally {
			setIsBulkDeleting(false);
		}
	}

	function toggleSelectAll(checked: boolean) {
		if (checked) {
			setSelectedIds(products.map((p) => p.id));
		} else {
			setSelectedIds([]);
		}
	}

	function toggleSelectProduct(id: string) {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	}

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<h2 className="font-bold text-3xl tracking-tight">Products</h2>
					{selectedIds.length > 0 && (
						<div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700">
							<span>{selectedIds.length} selected</span>
							<Button
								className="h-7 bg-red-600 px-2.5 text-white hover:bg-red-700"
								disabled={isBulkDeleting}
								onClick={handleBulkDelete}
								size="sm"
							>
								<Trash2 className="mr-1.5 h-3.5 w-3.5" />
								{isBulkDeleting ? "Deleting..." : "Delete Selected"}
							</Button>
							<Button
								className="h-7 px-2 text-stone-500 hover:text-stone-800"
								onClick={() => setSelectedIds([])}
								size="sm"
								variant="ghost"
							>
								Clear
							</Button>
						</div>
					)}
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" /> Add Product
				</Button>
			</div>

			<div className="rounded-md border bg-white">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-base">
						<thead className="border-b bg-stone-50 text-sm text-stone-500 uppercase">
							<tr>
								<th className="w-10 px-6 py-4">
									<Checkbox
										aria-label="Select all products"
										checked={
											products.length > 0 &&
											products.every((p) => selectedIds.includes(p.id))
										}
										onCheckedChange={(checked) => toggleSelectAll(!!checked)}
									/>
								</th>
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
										colSpan={6}
									>
										Loading products...
									</td>
								</tr>
							) : products.length === 0 ? (
								<tr>
									<td
										className="px-6 py-8 text-center text-stone-500"
										colSpan={6}
									>
										No products found.
									</td>
								</tr>
							) : (
								products.map((product) => {
									const isSelected = selectedIds.includes(product.id);
									return (
										<tr
											className={`border-b last:border-0 hover:bg-stone-50/50 ${
												isSelected ? "bg-red-50/40" : ""
											}`}
											key={product.id}
										>
											<td className="w-10 px-6 py-4">
												<Checkbox
													aria-label={`Select ${product.title}`}
													checked={isSelected}
													onCheckedChange={() => toggleSelectProduct(product.id)}
												/>
											</td>
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
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
