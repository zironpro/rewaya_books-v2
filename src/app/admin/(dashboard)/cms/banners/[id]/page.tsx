import { HeroBannerEditView } from "@/features/admin/cms/hero-banner-edit-view";

export default async function EditBannerPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = await params;
	return <HeroBannerEditView bannerId={resolvedParams.id} />;
}
