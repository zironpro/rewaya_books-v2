import { PopupEditView } from "@/features/admin/cms/popup-edit-view";

export default async function EditPopupPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = await params;
	return <PopupEditView popupId={resolvedParams.id} />;
}
