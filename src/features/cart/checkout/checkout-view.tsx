"use client";

import { useEffect, useState } from "react";

import { AlertCircle, CreditCard, Edit3, MapPin, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastManager } from "@/components/ui/toast";

import { useCart } from "@/features/cart/cart-provider";
import {
	useGetShippingConfigsQuery,
	useGetTaxConfigsQuery,
} from "@/types/graphql";

export function CheckoutView({ cart, user }: { cart: any; user?: any }) {
	const [loading, setLoading] = useState(false);
	const { clearCart } = useCart();
	const { data: shippingData } = useGetShippingConfigsQuery();
	const { data: taxData } = useGetTaxConfigsQuery();

	// Address Display State
	const hasSavedAddress = !!user?.shippingAddress?.addressLine1;
	const [isEditingAddress, setIsEditingAddress] = useState(!hasSavedAddress);

	// Form State
	const [email, setEmail] = useState(user?.email || "");
	const [phone, setPhone] = useState(user?.phone || "");

	const [firstName, setFirstName] = useState(
		user?.shippingAddress?.firstName || ""
	);
	const [lastName, setLastName] = useState(
		user?.shippingAddress?.lastName || ""
	);
	const [addressLine1, setAddressLine1] = useState(
		user?.shippingAddress?.addressLine1 || ""
	);
	const [addressLine2, setAddressLine2] = useState(
		user?.shippingAddress?.addressLine2 || ""
	);
	const [city, setCity] = useState(user?.shippingAddress?.city || "");
	const [state, setState] = useState(user?.shippingAddress?.state || "");
	const [postalCode, setPostalCode] = useState(
		user?.shippingAddress?.postalCode || ""
	);
	const [country, setCountry] = useState(
		user?.shippingAddress?.country || "UAE"
	);

	const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
		"standard"
	);
	const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">(
		"stripe"
	);

	const [couponCode, setCouponCode] = useState("");
	const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
	const [couponError, setCouponError] = useState("");
	const [applyingCoupon, setApplyingCoupon] = useState(false);

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Initialize email if user prop changes
	useEffect(() => {
		if (user?.email && !email) setEmail(user.email);
	}, [user, email]);

	const baseCartTotal =
		cart?.lineItems?.reduce((acc: number, item: any) => {
			const price =
				typeof item.price === "object"
					? Number(item.price.amount || 0)
					: Number(item.price || 0);
			return acc + price * (item.quantity || 1);
		}, 0) || 0;

	// Calculate discount
	let discountAmount = 0;
	if (appliedCoupon) {
		if (appliedCoupon.discountType === "percentage") {
			discountAmount = baseCartTotal * (appliedCoupon.discountAmount / 100);
		} else {
			discountAmount = appliedCoupon.discountAmount;
		}
	}
	const cartTotal = Math.max(0, baseCartTotal - discountAmount);

	// Calculate shipping cost
	const shippingConfigs = shippingData?.shippingConfigs || [];

	let shippingCost = 0;
	let standardShippingCost = 0;
	let matchedConfig: any = null;

	if (shippingConfigs.length > 0) {
		matchedConfig = shippingConfigs.find(
			(c: any) =>
				c.countries.includes(country) ||
				c.countries.includes("*") ||
				c.countries.includes("Worldwide")
		);
		if (matchedConfig) {
			standardShippingCost = matchedConfig.standardFee;
			if (
				matchedConfig.freeThreshold > 0 &&
				baseCartTotal >= matchedConfig.freeThreshold
			) {
				standardShippingCost = 0;
			}

			if (shippingMethod === "express" && matchedConfig.isExpressEnabled) {
				shippingCost = matchedConfig.expressFee;
			} else {
				shippingCost = standardShippingCost;
			}
		}
	}

	useEffect(() => {
		if (
			matchedConfig &&
			!matchedConfig.isExpressEnabled &&
			shippingMethod === "express"
		) {
			setShippingMethod("standard");
		}
		if (
			matchedConfig &&
			!matchedConfig.isCodEnabled &&
			paymentMethod === "cod"
		) {
			setPaymentMethod("stripe");
		}
	}, [country, matchedConfig, shippingMethod, paymentMethod]);

	// Calculate Tax
	const taxConfigs = taxData?.taxConfigs || [];
	let taxCost = 0;
	let taxName = "Tax";
	if (taxConfigs.length > 0) {
		// Find matching tax rule for country
		const activeTaxes = taxConfigs.filter((t: any) => t.status === "Active");
		const matchedTax = activeTaxes.find(
			(t: any) =>
				t.region === country ||
				t.region === "Worldwide" ||
				t.region === "Global"
		);

		if (matchedTax) {
			taxName = matchedTax.name;
			const amountToTax = matchedTax.appliedToShipping
				? cartTotal + shippingCost
				: cartTotal;
			taxCost = amountToTax * (matchedTax.rate / 100);
		}
	}

	const codFee =
		paymentMethod === "cod" && matchedConfig?.codFee ? matchedConfig.codFee : 0;
	const orderTotal = cartTotal + shippingCost + taxCost + codFee;

	const handleApplyCoupon = async () => {
		if (!couponCode) return;
		setApplyingCoupon(true);
		setCouponError("");
		try {
			const { graphqlClient } = await import("@/lib/graphql-client");
			const { VALIDATE_COUPON } = await import("@/graphql/queries");
			const data: any = await graphqlClient.request(VALIDATE_COUPON, {
				code: couponCode,
				cartTotal: baseCartTotal,
				email: email || user?.email || undefined,
			});
			if (data.validateCoupon) {
				setAppliedCoupon(data.validateCoupon);
				toastManager.add({
					title: "Coupon Applied",
					description: "Your discount has been applied.",
					type: "success",
				});
			}
		} catch (error: any) {
			console.error(error);
			setCouponError(
				error.response?.errors?.[0]?.message || "Invalid coupon code"
			);
			setAppliedCoupon(null);
		} finally {
			setApplyingCoupon(false);
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		if (!email) newErrors.email = "Required";
		if (!firstName) newErrors.firstName = "Required";
		if (!lastName) newErrors.lastName = "Required";
		if (!addressLine1) newErrors.addressLine1 = "Required";
		if (!city) newErrors.city = "Required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	async function handleCheckout(e: React.FormEvent) {
		e.preventDefault();
		if (!validateForm()) return;

		setLoading(true);

		try {
			const shippingAddress = {
				firstName,
				lastName,
				addressLine1,
				addressLine2,
				city,
				state,
				postalCode,
				country,
			};

			const response = await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					cartId: cart._id,
					paymentMethod,
					shippingMethod,
					shippingAddress,
					contact: { email, phone },
					couponCode: appliedCoupon?.code,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to initiate checkout");
			}

			if (paymentMethod === "cod" && data.orderId) {
				clearCart();
				window.location.href = `/thank-you?orderId=${data.orderId}`;
			} else if (data.url) {
				window.location.href = data.url;
			}
		} catch (error) {
			console.error("Checkout failed:", error);
			toastManager.add({
				title: "Checkout Error",
				description:
					error instanceof Error ? error.message : "Something went wrong.",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	}

	if (!cart?.lineItems?.length) {
		return (
			<div className="container mx-auto py-24 text-center">
				<h1 className="mb-4 font-bold text-3xl">Your cart is empty</h1>
				<p className="mb-8 text-slate-500">
					Add some items before proceeding to checkout.
				</p>
				<Button onClick={() => (window.location.href = "/")}>
					Continue Shopping
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-6xl px-4 py-12">
			<h1 className="mb-8 font-extrabold text-3xl text-slate-900 dark:text-white">
				Checkout
			</h1>

			<form
				className="grid grid-cols-1 gap-10 lg:grid-cols-12"
				onSubmit={handleCheckout}
			>
				{/* Left Column: Forms */}
				<div className="space-y-8 lg:col-span-7">
					{/* Contact Info */}
					<section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-slate-900 text-xl dark:text-white">
							Contact Information
						</h2>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-1.5">
								<Label
									className={errors.email ? "text-red-500" : ""}
									htmlFor="email"
								>
									Email Address *
								</Label>
								<Input
									className={errors.email ? "border-red-500" : ""}
									id="email"
									onChange={(e) => setEmail(e.target.value)}
									type="email"
									value={email}
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="phone">Phone Number</Label>
								<Input
									id="phone"
									onChange={(e) => setPhone(e.target.value)}
									type="tel"
									value={phone}
								/>
							</div>
						</div>
					</section>

					{/* Shipping Address */}
					<section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="font-bold text-slate-900 text-xl dark:text-white">
								Shipping Address
							</h2>
							{!isEditingAddress && (
								<Button
									onClick={() => setIsEditingAddress(true)}
									size="sm"
									type="button"
									variant="outline"
								>
									<Edit3 className="mr-2 h-4 w-4" /> Edit Address
								</Button>
							)}
						</div>

						{isEditingAddress ? (
							<div className="fade-in zoom-in-95 grid animate-in grid-cols-1 gap-4 duration-200 md:grid-cols-2">
								<div className="space-y-1.5">
									<Label
										className={errors.firstName ? "text-red-500" : ""}
										htmlFor="firstName"
									>
										First Name *
									</Label>
									<Input
										className={errors.firstName ? "border-red-500" : ""}
										id="firstName"
										onChange={(e) => setFirstName(e.target.value)}
										value={firstName}
									/>
								</div>
								<div className="space-y-1.5">
									<Label
										className={errors.lastName ? "text-red-500" : ""}
										htmlFor="lastName"
									>
										Last Name *
									</Label>
									<Input
										className={errors.lastName ? "border-red-500" : ""}
										id="lastName"
										onChange={(e) => setLastName(e.target.value)}
										value={lastName}
									/>
								</div>
								<div className="space-y-1.5 md:col-span-2">
									<Label
										className={errors.addressLine1 ? "text-red-500" : ""}
										htmlFor="addressLine1"
									>
										Address Line 1 *
									</Label>
									<Input
										className={errors.addressLine1 ? "border-red-500" : ""}
										id="addressLine1"
										onChange={(e) => setAddressLine1(e.target.value)}
										placeholder="Street address, P.O. box, etc."
										value={addressLine1}
									/>
								</div>
								<div className="space-y-1.5 md:col-span-2">
									<Label htmlFor="addressLine2">
										Address Line 2 (Optional)
									</Label>
									<Input
										id="addressLine2"
										onChange={(e) => setAddressLine2(e.target.value)}
										placeholder="Apartment, suite, unit, etc."
										value={addressLine2}
									/>
								</div>
								<div className="space-y-1.5">
									<Label
										className={errors.city ? "text-red-500" : ""}
										htmlFor="city"
									>
										City *
									</Label>
									<Input
										className={errors.city ? "border-red-500" : ""}
										id="city"
										onChange={(e) => setCity(e.target.value)}
										value={city}
									/>
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="state">Emirate / State</Label>
									<Input
										id="state"
										onChange={(e) => setState(e.target.value)}
										value={state}
									/>
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="country">Country</Label>
									<select
										className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
										id="country"
										onChange={(e) => setCountry(e.target.value)}
										value={country}
									>
										<option value="UAE">United Arab Emirates</option>
										<option value="KSA">Saudi Arabia</option>
										<option value="Oman">Oman</option>
										<option value="Qatar">Qatar</option>
										<option value="Bahrain">Bahrain</option>
										<option value="Kuwait">Kuwait</option>
										<option value="UK">United Kingdom</option>
										<option value="US">United States</option>
										<option value="Worldwide">Rest of the World</option>
									</select>
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="postalCode">Postal Code</Label>
									<Input
										id="postalCode"
										onChange={(e) => setPostalCode(e.target.value)}
										value={postalCode}
									/>
								</div>
								{hasSavedAddress && (
									<div className="mt-2 flex justify-end md:col-span-2">
										<Button
											onClick={() => {
												setIsEditingAddress(false);
												// Reset to saved
												setFirstName(user?.shippingAddress?.firstName || "");
												setLastName(user?.shippingAddress?.lastName || "");
												setAddressLine1(
													user?.shippingAddress?.addressLine1 || ""
												);
												setAddressLine2(
													user?.shippingAddress?.addressLine2 || ""
												);
												setCity(user?.shippingAddress?.city || "");
												setState(user?.shippingAddress?.state || "");
												setPostalCode(user?.shippingAddress?.postalCode || "");
											}}
											type="button"
											variant="ghost"
										>
											Cancel
										</Button>
									</div>
								)}
							</div>
						) : (
							<div className="fade-in flex animate-in items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
								<MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
								<div>
									<div className="font-semibold text-slate-900 dark:text-white">
										{firstName} {lastName}
									</div>
									<div className="mt-1 text-slate-600 text-sm leading-relaxed dark:text-slate-400">
										{addressLine1}{" "}
										{addressLine2 && (
											<>
												<br />
												{addressLine2}
											</>
										)}
										<br />
										{city}, {state} {postalCode}
										<br />
										{country}
									</div>
								</div>
							</div>
						)}
					</section>

					{/* Delivery Method (if express available) */}
					{matchedConfig?.isExpressEnabled && (
						<section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
							<h2 className="mb-4 font-bold text-slate-900 text-xl dark:text-white">
								Delivery Method
							</h2>
							<div className="space-y-3">
								<label
									className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300 dark:border-slate-700"}`}
								>
									<input
										checked={shippingMethod === "standard"}
										className="h-5 w-5 text-primary focus:ring-primary"
										name="shippingMethod"
										onChange={() => setShippingMethod("standard")}
										type="radio"
										value="standard"
									/>
									<div>
										<div className="font-bold text-slate-900 dark:text-white">
											Standard Delivery
											<span className="ml-2 font-normal text-slate-500 text-sm">
												({matchedConfig.deliveryTime || "3-5 days"})
											</span>
										</div>
										<div className="mt-1 font-semibold text-primary text-sm">
											{standardShippingCost === 0
												? "FREE"
												: `AED ${standardShippingCost.toFixed(2)}`}
										</div>
									</div>
								</label>

								<label
									className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${shippingMethod === "express" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300 dark:border-slate-700"}`}
								>
									<input
										checked={shippingMethod === "express"}
										className="h-5 w-5 text-primary focus:ring-primary"
										name="shippingMethod"
										onChange={() => setShippingMethod("express")}
										type="radio"
										value="express"
									/>
									<div>
										<div className="font-bold text-slate-900 dark:text-white">
											Express Delivery
											<span className="ml-2 font-normal text-slate-500 text-sm">
												({matchedConfig.expressDeliveryTime || "1-2 days"})
											</span>
										</div>
										<div className="mt-1 font-semibold text-primary text-sm">
											AED {matchedConfig.expressFee?.toFixed(2) || "0.00"}
										</div>
									</div>
								</label>
							</div>
						</section>
					)}

					{/* Payment Method */}
					<section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-4 font-bold text-slate-900 text-xl dark:text-white">
							Payment Method
						</h2>
						<div className="space-y-3">
							<label
								className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${paymentMethod === "stripe" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300 dark:border-slate-700"}`}
							>
								<input
									checked={paymentMethod === "stripe"}
									className="h-5 w-5 text-primary focus:ring-primary"
									name="paymentMethod"
									onChange={() => setPaymentMethod("stripe")}
									type="radio"
									value="stripe"
								/>
								<CreditCard
									className={`h-6 w-6 ${paymentMethod === "stripe" ? "text-primary" : "text-slate-400"}`}
								/>
								<div>
									<div className="font-bold text-slate-900 dark:text-white">
										Credit / Debit Card
									</div>
									<div className="text-slate-500 text-sm">
										Secure payment via Stripe (UPI, Cards, Apple Pay)
									</div>
								</div>
							</label>

							{matchedConfig?.isCodEnabled && (
								<label
									className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300 dark:border-slate-700"}`}
								>
									<input
										checked={paymentMethod === "cod"}
										className="h-5 w-5 text-primary focus:ring-primary"
										name="paymentMethod"
										onChange={() => setPaymentMethod("cod")}
										type="radio"
										value="cod"
									/>
									<Truck
										className={`h-6 w-6 ${paymentMethod === "cod" ? "text-primary" : "text-slate-400"}`}
									/>
									<div>
										<div className="font-bold text-slate-900 dark:text-white">
											Cash on Delivery
										</div>
										<div className="text-slate-500 text-sm">
											Pay when your order arrives
										</div>
										{matchedConfig?.codFee > 0 && (
											<div className="mt-1 font-semibold text-primary text-sm">
												+ AED {matchedConfig.codFee.toFixed(2)} COD Fee
											</div>
										)}
									</div>
								</label>
							)}
						</div>
					</section>
				</div>

				{/* Right Column: Order Summary */}
				<div className="lg:col-span-5">
					<div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
						<h2 className="mb-6 font-bold text-slate-900 text-xl dark:text-white">
							Order Summary
						</h2>

						<div className="mb-6 max-h-[400px] space-y-4 overflow-y-auto pr-2">
							{cart?.lineItems?.map((item: any) => (
								<div
									className="flex items-start justify-between gap-4"
									key={item._id}
								>
									<div className="flex-1">
										<div className="line-clamp-2 font-semibold text-slate-900 text-sm dark:text-white">
											{item.title || item.productName?.translated}
										</div>
										<div className="mt-1 text-slate-500 text-xs">
											Qty: {item.quantity}
										</div>
									</div>
									<div className="shrink-0 font-bold text-slate-900 text-sm dark:text-white">
										AED{" "}
										{(
											(typeof item.price === "object"
												? Number(item.price.amount || 0)
												: Number(item.price || 0)) * (item.quantity || 1)
										).toFixed(2)}
									</div>
								</div>
							))}
						</div>

						{/* Promo Code */}
						<div className="mb-6 border-slate-200 border-t pt-4 dark:border-slate-700">
							<Label className="mb-2 block" htmlFor="promo">
								Promo Code
							</Label>
							<div className="flex gap-2">
								<Input
									disabled={!!appliedCoupon || applyingCoupon}
									id="promo"
									onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
									placeholder="Enter code"
									value={couponCode}
								/>
								<Button
									disabled={!couponCode || !!appliedCoupon || applyingCoupon}
									onClick={handleApplyCoupon}
									type="button"
									variant="secondary"
								>
									{appliedCoupon ? "Applied" : "Apply"}
								</Button>
							</div>
							{couponError && (
								<div className="mt-1 text-red-500 text-sm">{couponError}</div>
							)}
							{appliedCoupon && (
								<div className="mt-1 flex items-center justify-between text-green-600 text-sm">
									<span>{appliedCoupon.code} applied!</span>
									<button
										className="text-red-500 hover:underline"
										onClick={() => {
											setAppliedCoupon(null);
											setCouponCode("");
										}}
										type="button"
									>
										Remove
									</button>
								</div>
							)}
						</div>

						<div className="space-y-3 border-slate-200 border-t pt-6 dark:border-slate-700">
							<div className="flex justify-between text-slate-600 text-sm dark:text-slate-400">
								<span>Subtotal</span>
								<span className="font-medium">
									AED {baseCartTotal.toFixed(2)}
								</span>
							</div>
							{appliedCoupon && (
								<div className="flex justify-between text-green-600 text-sm dark:text-green-400">
									<span>Discount ({appliedCoupon.code})</span>
									<span className="font-medium">
										- AED {discountAmount.toFixed(2)}
									</span>
								</div>
							)}
							<div className="flex justify-between text-slate-600 text-sm dark:text-slate-400">
								<span>
									{shippingMethod === "express"
										? "Express Shipping"
										: "Standard Shipping"}{" "}
									({country})
								</span>
								<span
									className={
										shippingCost === 0
											? "font-medium text-green-600 dark:text-green-400"
											: "font-medium"
									}
								>
									{shippingCost === 0
										? "Free"
										: `AED ${shippingCost.toFixed(2)}`}
								</span>
							</div>
							{taxCost > 0 && (
								<div className="flex justify-between text-slate-600 text-sm dark:text-slate-400">
									<span>{taxName}</span>
									<span className="font-medium">AED {taxCost.toFixed(2)}</span>
								</div>
							)}
							{codFee > 0 && (
								<div className="flex justify-between text-slate-600 text-sm dark:text-slate-400">
									<span>Cash on Delivery Fee</span>
									<span className="font-medium">AED {codFee.toFixed(2)}</span>
								</div>
							)}

							<div className="flex justify-between border-slate-200 border-t pt-3 font-extrabold text-lg text-slate-900 dark:border-slate-700 dark:text-white">
								<span>Total</span>
								<span>AED {orderTotal.toFixed(2)}</span>
							</div>
						</div>

						<Button
							className="mt-8 h-12 w-full font-bold text-base shadow-md"
							disabled={loading}
							size="lg"
							type="submit"
						>
							{loading ? (
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
									Processing...
								</div>
							) : paymentMethod === "cod" ? (
								`Place Order (AED ${orderTotal.toFixed(2)})`
							) : (
								`Pay with Stripe (AED ${orderTotal.toFixed(2)})`
							)}
						</Button>

						{Object.keys(errors).length > 0 && (
							<div className="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-red-500 text-sm">
								<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
								<span>Please fill in all required fields marked with *</span>
							</div>
						)}
					</div>
				</div>
			</form>
		</div>
	);
}
