import { Metadata } from "next";

import { CategoriesView } from "@/features/admin/catalog/categories-view";

export const metadata: Metadata = {
	title: "Categories & Genres | Rewaya Admin",
	description:
		"Manage 24 store categories, slugs, and display order for Rewaya Bookstore.",
};

export default function CategoriesPage() {
	return <CategoriesView />;
}
