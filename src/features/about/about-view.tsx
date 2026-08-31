import Image from "next/image";

export const AboutView = () => {
	return (
		<main className="grow">
			{/* Hero Section */}
			<section className="border-stone-100 border-b py-20 md:py-32">
				<div className="container">
					<div className="max-w-4xl">
						<span className="mb-8 block font-bold text-sm text-stone-400">
							Our Story
						</span>
						<h1 className="mb-12 font-black font-serif text-4xl leading-[0.9] sm:text-5xl md:text-6xl lg:text-8xl">
							Where words <br />
							<span className="font-normal text-stone-300 italic">meet</span>{" "}
							soul.
						</h1>
						<p className="max-w-2xl font-light text-stone-600 text-xl leading-relaxed md:text-2xl">
							Rewaya was born from a simple belief: that books are more than
							paper and ink—they are the vessels of our shared humanity and
							divine wisdom.
						</p>
					</div>
				</div>
			</section>

			{/* Philosophy */}
			<section className="bg-white py-20 md:py-32">
				<div className="container">
					<div className="grid grid-cols-1 items-center gap-24 md:grid-cols-2">
						<div>
							<Image
								alt="Aesthetic library"
								className="aspect-3/4 w-full object-cover grayscale"
								height={1200}
								src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop"
								width={900}
							/>
						</div>
						<div className="flex flex-col gap-12">
							<div>
								<h3 className="mb-6 font-bold font-serif text-3xl">
									Curated with Purpose
								</h3>
								<p className="font-bold text-sm text-stone-500 leading-relaxed">
									Every title in our collection is hand-selected. We don't just
									sell books; we offer pathways to reflection, growth, and
									peace. From classical Islamic texts to modern masterpieces of
									fiction and self-improvement.
								</p>
							</div>
							<div>
								<h3 className="mb-6 font-bold font-serif text-3xl">
									A Global Community
								</h3>
								<p className="font-bold text-sm text-stone-500 leading-relaxed">
									Rewaya serves seekers from all walks of life. We bridge the
									gap between tradition and modernity, creating a space where
									everyone is welcome to explore the world's most profound
									ideas.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Vision */}
			<section className="bg-black py-32 text-white">
				<div className="container text-center">
					<div className="mx-auto max-w-3xl">
						<h2 className="mb-12 font-black font-serif text-4xl italic md:text-6xl">
							The future of reading is reflective.
						</h2>
						<p className="text-sm text-stone-400 leading-loose">
							Join us in our mission to bring back the art of deep reading and
							thoughtful contemplation. In a world of noise, we choose the
							melody of silence and the weight of words.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
};
