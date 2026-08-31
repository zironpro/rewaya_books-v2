import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ContactView = () => {
	return (
		<main className="grow pt-32">
			<div className="container">
				<div className="mb-32 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-32">
					{/* Contact Info */}
					<div className="flex flex-col justify-between py-12">
						<div>
							<span className="mb-12 block font-bold text-sm text-stone-400">
								Get in touch
							</span>
							<h1 className="mb-16 font-black font-serif text-4xl leading-[0.85] sm:text-5xl md:text-6xl lg:text-8xl">
								Let's <br />
								<span className="font-normal text-stone-300 italic">
									connect.
								</span>
							</h1>

							<div className="space-y-12">
								<div>
									<h3 className="mb-4 font-bold text-sm text-stone-400">
										Email Us
									</h3>
									<p className="font-serif text-2xl">hello@rewayabooks.com</p>
								</div>
								<div>
									<h3 className="mb-4 font-bold text-sm text-stone-400">
										Visit Us
									</h3>
									<p className="font-serif text-2xl">
										123 Wisdom Ave, <br />
										Knowledge District, NY 10001
									</p>
								</div>
								<div>
									<h3 className="mb-4 font-bold text-sm text-stone-400">
										Follow
									</h3>
									<div className="flex gap-8">
										<a
											className="font-bold text-sm transition-colors hover:text-stone-400"
											href="#"
										>
											Instagram
										</a>
										<a
											className="font-bold text-sm transition-colors hover:text-stone-400"
											href="#"
										>
											Twitter
										</a>
										<a
											className="font-bold text-sm transition-colors hover:text-stone-400"
											href="#"
										>
											Pinterest
										</a>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-24 border-stone-100 border-t pt-12">
							<p className="max-w-xs text-sm text-stone-400 leading-loose">
								Our team typically responds within 24-48 business hours. We look
								forward to hearing your thoughts.
							</p>
						</div>
					</div>

					{/* Contact Form */}
					<div className="bg-stone-50 p-6 sm:p-10 md:p-16 lg:p-20">
						<form className="space-y-12">
							<div className="space-y-2">
								<label className="font-bold text-sm text-stone-400">
									Full Name
								</label>
								<Input placeholder="Enter your name" type="text" />
							</div>

							<div className="space-y-2">
								<label className="font-bold text-sm text-stone-400">
									Email Address
								</label>
								<Input placeholder="email@example.com" type="email" />
							</div>

							<div className="space-y-2">
								<label className="font-bold text-sm text-stone-400">
									Message
								</label>
								<textarea
									className="w-full resize-none border-stone-300 border-b bg-transparent py-4 text-sm transition-colors focus:border-black focus:outline-none"
									placeholder="What's on your mind?"
									rows={4}
								/>
							</div>

							<Button className="h-16 w-full" variant="premium">
								Send Message
								<span className="ml-4 transform transition-transform group-hover:translate-x-2">
									→
								</span>
							</Button>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
};
