import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 60;
export const alt = "Bundle offer";

function fallback() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: "#FBF6EE",
				color: "#2c241c",
				fontSize: 42,
				fontWeight: 600,
				fontFamily: "Georgia, serif",
			}}
		>
			Rewaya Bookworld
			<div
				style={{ fontSize: 22, marginTop: 16, fontWeight: 400, opacity: 0.75 }}
			>
				Bundle
			</div>
		</div>,
		{ ...size }
	);
}

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug: _slug } = await params;
	const bundle: any = null;

	if (!bundle) {
		return fallback();
	}

	let playfairData: ArrayBuffer | null = null;
	let dmData: ArrayBuffer | null = null;
	try {
		const css = await fetch(
			"https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400&display=swap",
			{ next: { revalidate: 900 } }
		).then((r) => r.text());
		const playfairUrl = css.match(
			/font-family: 'Playfair Display'[\s\S]*?url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/
		)?.[1];
		const dmUrl = css.match(
			/font-family: 'DM Sans'[\s\S]*?url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/
		)?.[1];
		if (playfairUrl) {
			playfairData = await fetch(playfairUrl).then((r) => r.arrayBuffer());
		}
		if (dmUrl) {
			dmData = await fetch(dmUrl).then((r) => r.arrayBuffer());
		}
	} catch {
		playfairData = null;
		dmData = null;
	}

	const fonts =
		playfairData && dmData
			? [
					{
						name: "Playfair Display",
						data: playfairData,
						style: "normal" as const,
						weight: 600 as const,
					},
					{
						name: "DM Sans",
						data: dmData,
						style: "normal" as const,
						weight: 400 as const,
					},
				]
			: [];

	try {
		return new ImageResponse(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "row",
					background: "#FBF6EE",
					color: "#2c241c",
					border: "10px solid #C9A84C",
					boxSizing: "border-box",
					padding: 48,
					gap: 36,
				}}
			>
				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						gap: 16,
					}}
				>
					<div
						style={{
							fontSize: 52,
							fontFamily: fonts.length ? "Playfair Display" : "Georgia, serif",
							fontWeight: 600,
							lineHeight: 1.05,
						}}
					>
						{bundle.name}
					</div>
					<div
						style={{
							fontSize: 22,
							fontFamily: fonts.length ? "DM Sans" : "system-ui, sans-serif",
							opacity: 0.78,
						}}
					>
						{bundle.books.length} curated titles · Save{" "}
						{Math.round(
							((bundle.originalPrice - bundle.price) / bundle.originalPrice) *
								100
						)}
						%
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "baseline",
							gap: 18,
							marginTop: 12,
						}}
					>
						<span
							style={{
								fontSize: 44,
								fontFamily: fonts.length
									? "Playfair Display"
									: "Georgia, serif",
								fontWeight: 600,
							}}
						>
							AED {bundle.price}
						</span>
						<span
							style={{
								fontSize: 28,
								textDecoration: "line-through",
								opacity: 0.45,
							}}
						>
							AED {bundle.originalPrice}
						</span>
					</div>
					<div
						style={{
							fontSize: 16,
							marginTop: "auto",
							opacity: 0.55,
							fontFamily: fonts.length ? "DM Sans" : "system-ui, sans-serif",
						}}
					>
						Rewaya Bookworld · UAE delivery
					</div>
				</div>
				<div
					style={{
						width: 420,
						display: "flex",
						flexWrap: "wrap",
						alignItems: "center",
						justifyContent: "center",
						gap: 12,
					}}
				>
					{bundle.books.slice(0, 5).map((book: any, i: number) => (
						// biome-ignore lint/performance/noImgElement: next/og ImageResponse requires native img
						<img
							alt=""
							height={180}
							key={book.id}
							src={book.coverUrl}
							style={{
								width: 120,
								height: 180,
								objectFit: "cover",
								borderRadius: 6,
								boxShadow: "0 12px 28px rgba(44,36,28,0.28)",
								transform: `rotate(${[-8, 5, -4, 7, -5][i] ?? 0}deg) translateY(${i * 6}px)`,
							}}
							width={120}
						/>
					))}
				</div>
			</div>,
			{ ...size, fonts: fonts.length ? fonts : undefined }
		);
	} catch {
		return fallback();
	}
}
