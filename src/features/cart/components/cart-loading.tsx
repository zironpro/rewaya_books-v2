import { Spinner } from "@/components/ui/spinner";

export function CartLoading() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 border-stone-100 border-y py-20">
			<Spinner className="size-6 text-stone-400" />
			<p className="text-sm text-stone-400">Loading your bag…</p>
		</div>
	);
}
