"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { toastManager } from "@/components/ui/toast";
import { FOOTER_STORE } from "@/components/layout/data/FooterLinks";

export const ContactView = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !email || !message) {
			toastManager.add({
				title: "Missing Fields",
				description: "Please fill in all the required fields.",
				type: "error",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, message }),
			});
			
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Failed to send message");
			}

			toastManager.add({
				title: "Message Sent!",
				description: "Thank you for reaching out. We will get back to you soon.",
				type: "success",
			});
			
			setName("");
			setEmail("");
			setMessage("");
		} catch (error: any) {
			toastManager.add({
				title: "Error",
				description: error.message || "Something went wrong. Please try again.",
				type: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="relative min-h-screen overflow-hidden bg-slate-50 pt-32 pb-24 dark:bg-slate-950">
			{/* Decorative background gradients */}
			<div className="absolute top-0 right-0 -mr-[20%] -mt-[10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
			<div className="absolute bottom-0 left-0 -ml-[20%] -mb-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />

			<div className="container relative z-10 mx-auto max-w-6xl px-4">
				<div className="mb-16 text-center">
					<h1 className="font-extrabold text-4xl tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
						Get in <span className="text-primary">Touch</span>
					</h1>
					<p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
						We'd love to hear from you. Our friendly team is always here to chat.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
					{/* Contact Information */}
					<div className="flex flex-col space-y-8">
						<div className="rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 dark:shadow-none transition-transform hover:-translate-y-1 duration-300">
							<div className="flex items-center gap-4 mb-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
									<MapPin className="h-6 w-6" />
								</div>
								<h3 className="font-bold text-xl text-slate-900 dark:text-white">Visit Us</h3>
							</div>
							<div className="ml-16 space-y-1 text-slate-600 dark:text-slate-400">
								{FOOTER_STORE.addressLines.map((line, i) => (
									<p key={i}>{line}</p>
								))}
							</div>
						</div>

						<div className="rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 dark:shadow-none transition-transform hover:-translate-y-1 duration-300">
							<div className="flex items-center gap-4 mb-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
									<Mail className="h-6 w-6" />
								</div>
								<h3 className="font-bold text-xl text-slate-900 dark:text-white">Email Us</h3>
							</div>
							<div className="ml-16 space-y-2">
								<p className="text-slate-600 dark:text-slate-400">
									Support: <a href={`mailto:${FOOTER_STORE.supportEmail}`} className="font-medium text-slate-900 dark:text-white hover:text-primary transition-colors">{FOOTER_STORE.supportEmail}</a>
								</p>
								<p className="text-slate-600 dark:text-slate-400">
									Accounts: <a href={`mailto:${FOOTER_STORE.accountsEmail}`} className="font-medium text-slate-900 dark:text-white hover:text-primary transition-colors">{FOOTER_STORE.accountsEmail}</a>
								</p>
							</div>
						</div>

						<div className="rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 dark:shadow-none transition-transform hover:-translate-y-1 duration-300">
							<div className="flex items-center gap-4 mb-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
									<Phone className="h-6 w-6" />
								</div>
								<h3 className="font-bold text-xl text-slate-900 dark:text-white">Call Us</h3>
							</div>
							<div className="ml-16 space-y-2">
								<p className="text-slate-600 dark:text-slate-400">
									Phone: <a href={`tel:${FOOTER_STORE.phone.replace(/\s/g, '')}`} className="font-medium text-slate-900 dark:text-white hover:text-primary transition-colors">{FOOTER_STORE.phone}</a>
								</p>
								<p className="text-slate-600 dark:text-slate-400">
									Tel: <a href={`tel:${FOOTER_STORE.tel.replace(/\s/g, '')}`} className="font-medium text-slate-900 dark:text-white hover:text-primary transition-colors">{FOOTER_STORE.tel}</a>
								</p>
								<p className="text-sm text-slate-500 mt-2">{FOOTER_STORE.hours}</p>
							</div>
						</div>
					</div>

					{/* Contact Form */}
					<div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-2xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none lg:ml-8">
						<h2 className="font-bold text-2xl text-slate-900 dark:text-white mb-6">Send us a message</h2>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
									Full Name
								</label>
								<input
									id="name"
									type="text"
									placeholder="John Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
									disabled={isSubmitting}
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
									Email Address
								</label>
								<input
									id="email"
									type="email"
									placeholder="john@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
									disabled={isSubmitting}
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="message" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
									Message
								</label>
								<textarea
									id="message"
									rows={5}
									placeholder="How can we help you?"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:bg-slate-800"
									disabled={isSubmitting}
								/>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-white transition-all hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-5 w-5 animate-spin" />
										Sending...
									</>
								) : (
									<>
										Send Message
										<Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
									</>
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
};
