import { fetchCart } from "@/features/cart/cart-actions";
import { CheckoutView } from "@/features/cart/checkout/checkout-view";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";

export default async function CheckoutPage() {
	const cart = await fetchCart();
	const session = await auth();
	
	let userDoc = null;
	if (session?.user?.email) {
		await connectToDatabase();
		const u = await User.findOne({ email: session.user.email }).lean();
		if (u) {
			userDoc = JSON.parse(JSON.stringify({
				...u,
				_id: u._id.toString(),
			}));
		}
	}

	return <CheckoutView cart={cart} user={userDoc} />;
}
