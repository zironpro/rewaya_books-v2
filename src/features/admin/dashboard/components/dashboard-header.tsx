"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronRight, Search, X, Package, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toastManager } from "@/components/ui/toast";
type AppNotification = {
	_id: string;
	title: string;
	message: string;
	type: "new_order" | "cancelled";
	orderId: string;
	read: boolean;
	createdAt: string;
};

export function DashboardHeader() {
	const router = useRouter();
	const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
	const prevNotifCountRef = React.useRef<number>(0);

	const unreadCount = notifications.filter(n => !n.read).length;

	const fetchNotifications = React.useCallback(async () => {
		try {
			const res = await fetch("/api/admin/notifications");
			const data = await res.json();
			if (data.notifications) {
				setNotifications(data.notifications);
			}
		} catch (error) {
			console.error("Failed to fetch notifications", error);
		}
	}, []);

	React.useEffect(() => {
		fetchNotifications();
		const interval = setInterval(fetchNotifications, 10000);
		return () => clearInterval(interval);
	}, [fetchNotifications]);

	const handleBellClick = async () => {
		setIsDropdownOpen(!isDropdownOpen);
		if (!isDropdownOpen && unreadCount > 0) {
			setNotifications(prev => prev.map(n => ({ ...n, read: true })));
			try {
				await fetch("/api/admin/notifications", { method: "PATCH" });
			} catch (error) {
				console.error("Failed to mark notifications as read", error);
			}
		}
	};

	const handleNotificationClick = (orderId: string) => {
		setIsDropdownOpen(false);
		router.push(`/admin/orders/${orderId}`);
	};

	const playNotificationSound = React.useCallback(() => {
		try {
			const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
			const ctx = new AudioContext();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			
			osc.connect(gain);
			gain.connect(ctx.destination);
			
			osc.type = "sine";
			osc.frequency.setValueAtTime(800, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
			
			gain.gain.setValueAtTime(0, ctx.currentTime);
			gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
			gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
			
			osc.start(ctx.currentTime);
			osc.stop(ctx.currentTime + 0.3);
		} catch (e) {
			console.error("Audio playback failed", e);
		}
	}, []);

	React.useEffect(() => {
		const currentCount = notifications.length;
		if (prevNotifCountRef.current > 0 && currentCount > prevNotifCountRef.current) {
			// A new notification just arrived! Play sound and toast
			playNotificationSound();
			const latest = notifications[0]; // Assuming sorted descending
			toastManager.add({
				title: latest.title,
				description: latest.message,
				type: latest.type === "new_order" ? "success" : "error",
			});
		}
		prevNotifCountRef.current = currentCount;
	}, [notifications, playNotificationSound]);

	return (
		<header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-slate-200 border-b bg-white/80 px-3 backdrop-blur-md sm:px-4 dark:border-slate-800 dark:bg-slate-950/80">
			<div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
				{/* Sidebar Trigger Button */}
				<SidebarTrigger />
				<Separator className="h-5 shrink-0" orientation="vertical" />

				{/* Breadcrumb Trail */}
				<nav className="flex items-center gap-1.5 truncate text-slate-500 text-sm dark:text-slate-400">
					<span className="hidden truncate font-medium text-slate-700 sm:inline dark:text-slate-200">
						alrewaya Admin
					</span>
					<ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-slate-300 sm:inline" />
					<span className="truncate font-semibold text-primary">
						Overview
					</span>
				</nav>
			</div>

			<div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
				<div className="relative">
					<Button
						className="relative h-8 w-8 text-slate-600 dark:text-slate-300"
						size="icon"
						variant="ghost"
						onClick={handleBellClick}
					>
						<Bell className="h-4 w-4" />
						{unreadCount > 0 && (
							<span className="absolute top-1.5 right-1.5 flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
								<span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
							</span>
						)}
						<span className="sr-only">Notifications</span>
					</Button>

					{isDropdownOpen && (
						<div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
							<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
								<h3 className="font-semibold text-sm">Notifications</h3>
								{notifications.length > 0 && (
									<Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setNotifications([])}>
										Clear all
									</Button>
								)}
							</div>
							<div className="max-h-[300px] overflow-y-auto">
								{notifications.length === 0 ? (
									<div className="px-4 py-6 text-center text-slate-500 text-sm">
										No new notifications
									</div>
								) : (
									<div className="flex flex-col">
										{notifications.map((notif) => (
											<button
												key={notif._id}
												onClick={() => handleNotificationClick(notif.orderId)}
												className={`flex items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 ${!notif.read ? "bg-primary/5" : ""}`}
											>
												<div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${notif.type === "new_order" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"}`}>
													{notif.type === "new_order" ? <Package className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
												</div>
												<div className="flex flex-col gap-1">
													<p className="font-medium text-sm text-slate-900 dark:text-slate-100">
														{notif.title}
													</p>
													<p className="text-slate-500 text-xs dark:text-slate-400">
														{notif.message}
													</p>
													<span className="text-[10px] text-slate-400">
														{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
													</span>
												</div>
											</button>
										))}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
