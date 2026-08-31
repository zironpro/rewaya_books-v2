import { Metadata } from "next";
import { BooksView } from "@/features/admin/catalog/books-view";

export const metadata: Metadata = {
	title: "Books Catalog Manager | Rewaya Admin",
	description:
		"Manage titles, ISBNs, AED pricing, and inventory for Rewaya Book World.",
};

export default function BooksPage() {
	return <BooksView />;
}
