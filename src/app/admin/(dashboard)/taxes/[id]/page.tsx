import { TaxEditView } from "@/features/admin/taxes/tax-edit-view";

export default async function EditTaxPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = await params;
	return <TaxEditView taxId={resolvedParams.id} />;
}
