import { AdminLoginView } from "@/features/admin/auth/admin-login-view";

export const metadata = {
	title: "Admin Login | Rewaya Portal",
	description: "Secure login portal for Rewaya administrators.",
};

export default function AdminLoginPage() {
	return <AdminLoginView />;
}
