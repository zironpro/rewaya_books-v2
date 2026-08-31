"use client";

import { useState, useEffect } from "react";
import { toastManager } from "@/components/ui/toast";
import { useCart } from "@/features/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Truck, AlertCircle, MapPin, Edit3 } from "lucide-react";
import { useGetShippingConfigsQuery, useGetTaxConfigsQuery } from "@/types/graphql";

export function CheckoutView({ cart, user }: { cart: any, user?: any }) {
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
	
	const [firstName, setFirstName] = useState(user?.shippingAddress?.firstName || "");
	const [lastName, setLastName] = useState(user?.shippingAddress?.lastName || "");
	const [addressLine1, setAddressLine1] = useState(user?.shippingAddress?.addressLine1 || "");
	const [addressLine2, setAddressLine2] = useState(user?.shippingAddress?.addressLine2 || "");
	const [city, setCity] = useState(user?.shippingAddress?.city || "");
	const [state, setState] = useState(user?.shippingAddress?.state || "");
	const [postalCode, setPostalCode] = useState(user?.shippingAddress?.postalCode || "");
	const [country, setCountry] = useState(user?.shippingAddress?.country || "UAE");
	
	const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
	const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");
	
	const [couponCode, setCouponCode] = useState("");
	const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
	const [couponError, setCouponError] = useState("");
	const [applyingCoupon, setApplyingCoupon] = useState(false);

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Initialize email if user prop changes
	useEffect(() => {
		if (user?.email && !email) setEmail(user.email);
	}, [user, email]);

	const baseCartTotal = cart?.lineItems?.reduce((acc: number, item: any) => {
		const price = typeof item.price === "object" ? Number(item.price.amount || 0) : Number(item.price || 0);
		return acc + (price * (item.quantity || 1));
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
		matchedConfig = shippingConfigs.find((c: any) => c.countries.includes(country) || c.countries.includes("*") || c.countries.includes("Worldwide"));
		if (matchedConfig) {
			standardShippingCost = matchedConfig.standardFee;
			if (matchedConfig.freeThreshold > 0 && baseCartTotal >= matchedConfig.freeThreshold) {
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
		if (matchedConfig && !matchedConfig.isExpressEnabled && shippingMethod === "express") {
			setShippingMethod("standard");
		}
	}, [country, matchedConfig, shippingMethod]);

	// Calculate Tax
	const taxConfigs = taxData?.taxConfigs || [];
	let taxCost = 0;
	let taxName = "Tax";
	if (taxConfigs.length > 0) {
		// Find matching tax rule for country
		const activeTaxes = taxConfigs.filter((t: any) => t.status === "Active");
		const matchedTax = activeTaxes.find((t: any) => t.region === country || t.region === "Worldwide" || t.region === "Global");
		
		if (matchedTax) {
			taxName = matchedTax.name;
			const amountToTax = matchedTax.appliedToShipping ? (cartTotal + shippingCost) : cartTotal;
			taxCost = amountToTax * (matchedTax.rate / 100);
		}
	}

	const orderTotal = cartTotal + shippingCost + taxCost;

	const handleApplyCoupon = async () => {
		if (!couponCode) return;
		setApplyingCoupon(true);
		setCouponError("");
		try {
			const { graphqlClient } = await import("@/lib/graphql-client");
			const { VALIDATE_COUPON } = await import("@/graphql/queries");
			const data: any = await graphqlClient.request(VALIDATE_COUPON, { code: couponCode, cartTotal: baseCartTotal });
			if (data.validateCoupon) {
				setAppliedCoupon(data.validateCoupon);
				toastManager.add({ title: "Coupon Applied", description: "Your discount has been applied.", type: "success" });
			}
		} catch (error: any) {
			console.error(error);
			setCouponError(error.response?.errors?.[0]?.message || "Invalid coupon code");
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
					couponCode: appliedCoupon?.code
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
				description: error instanceof Error ? error.message : "Something went wrong.",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	}

	if (!cart?.lineItems?.length) {
		return (
			<div className="container mx-auto py-24 text-center">
				<h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
				<p className="text-slate-500 mb-8">Add some items before proceeding to checkout.</p>
				<Button onClick={() => window.location.href = "/"}>Continue Shopping</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-12 max-w-6xl px-4">
			<h1 className="text-3xl font-extrabold text-slate-900 mb-8 dark:text-white">Checkout</h1>

			<form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				
				{/* Left Column: Forms */}
				<div className="lg:col-span-7 space-y-8">
					
					{/* Contact Info */}
					<section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
						<h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Contact Information</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>Email Address *</Label>
								<Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className={errors.email ? "border-red-500" : ""} />
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="phone">Phone Number</Label>
								<Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
							</div>
						</div>
					</section>

					{/* Shipping Address */}
					<section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold text-slate-900 dark:text-white">Shipping Address</h2>
							{!isEditingAddress && (
								<Button type="button" variant="outline" size="sm" onClick={() => setIsEditingAddress(true)}>
									<Edit3 className="mr-2 h-4 w-4" /> Edit Address
								</Button>
							)}
						</div>
						
						{isEditingAddress ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
								<div className="space-y-1.5">
									<Label htmlFor="firstName" className={errors.firstName ? "text-red-500" : ""}>First Name *</Label>
									<Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} className={errors.firstName ? "border-red-500" : ""} />
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="lastName" className={errors.lastName ? "text-red-500" : ""}>Last Name *</Label>
									<Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} className={errors.lastName ? "border-red-500" : ""} />
								</div>
								<div className="space-y-1.5 md:col-span-2">
									<Label htmlFor="addressLine1" className={errors.addressLine1 ? "text-red-500" : ""}>Address Line 1 *</Label>
									<Input id="addressLine1" placeholder="Street address, P.O. box, etc." value={addressLine1} onChange={e => setAddressLine1(e.target.value)} className={errors.addressLine1 ? "border-red-500" : ""} />
								</div>
								<div className="space-y-1.5 md:col-span-2">
									<Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
									<Input id="addressLine2" placeholder="Apartment, suite, unit, etc." value={addressLine2} onChange={e => setAddressLine2(e.target.value)} />
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="city" className={errors.city ? "text-red-500" : ""}>City *</Label>
									<Input id="city" value={city} onChange={e => setCity(e.target.value)} className={errors.city ? "border-red-500" : ""} />
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="state">Emirate / State</Label>
									<Input id="state" value={state} onChange={e => setState(e.target.value)} />
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="country">Country</Label>
									<select 
										id="country" 
										value={country} 
										onChange={e => setCountry(e.target.value)}
										className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
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
									<Input id="postalCode" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
								</div>
								{hasSavedAddress && (
									<div className="md:col-span-2 flex justify-end mt-2">
										<Button type="button" variant="ghost" onClick={() => {
											setIsEditingAddress(false);
											// Reset to saved
											setFirstName(user?.shippingAddress?.firstName || "");
											setLastName(user?.shippingAddress?.lastName || "");
											setAddressLine1(user?.shippingAddress?.addressLine1 || "");
											setAddressLine2(user?.shippingAddress?.addressLine2 || "");
											setCity(user?.shippingAddress?.city || "");
											setState(user?.shippingAddress?.state || "");
											setPostalCode(user?.shippingAddress?.postalCode || "");
										}}>
											Cancel
										</Button>
									</div>
								)}
							</div>
						) : (
							<div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 dark:bg-slate-800/50 dark:border-slate-700 animate-in fade-in">
								<MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
								<div>
									<div className="font-semibold text-slate-900 dark:text-white">
										{firstName} {lastName}
									</div>
									<div className="text-slate-600 mt-1 dark:text-slate-400 text-sm leading-relaxed">
										{addressLine1} {addressLine2 && <><br />{addressLine2}</>}
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
						<section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
							<h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Delivery Method</h2>
							<div className="space-y-3">
								<label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300 dark:border-slate-700"}`}>
									<input 
										type="radio" 
										name="shippingMethod" 
										value="standard"
										checked={shippingMethod === "standard"}
										onChange={() => setShippingMethod("standard")}
										className="w-5 h-5 text-primary focus:ring-primary"
									/>
									<div>
										<div className="font-bold text-slate-900 dark:text-white">
											Standard Delivery 
											<span className="ml-2 text-sm font-normal text-slate-500">({matchedConfig.deliveryTime || "3-5 days"})</span>
										</div>
										<div className="text-sm font-semibold text-primary mt-1">
											{standardShippingCost === 0 ? "FREE" : `AED ${standardShippingCost.toFixed(2)}`}
										</div>
									</div>
								</label>

								<label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${shippingMethod === "express" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300 dark:border-slate-700"}`}>
									<input 
										type="radio" 
										name="shippingMethod" 
										value="express"
										checked={shippingMethod === "express"}
										onChange={() => setShippingMethod("express")}
										className="w-5 h-5 text-primary focus:ring-primary"
									/>
									<div>
										<div className="font-bold text-slate-900 dark:text-white">
											Express Delivery
											<span className="ml-2 text-sm font-normal text-slate-500">({matchedConfig.expressDeliveryTime || "1-2 days"})</span>
										</div>
										<div className="text-sm font-semibold text-primary mt-1">
											AED {matchedConfig.expressFee?.toFixed(2) || "0.00"}
										</div>
									</div>
								</label>
							</div>
						</section>
					)}

					{/* Payment Method */}
					<section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm dark:bg-slate-900 dark:border-slate-800">
						<h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Payment Method</h2>
						<div className="space-y-3">
							<label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${paymentMethod === "stripe" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300 dark:border-slate-700"}`}>
								<input 
									type="radio" 
									name="paymentMethod" 
									value="stripe"
									checked={paymentMethod === "stripe"}
									onChange={() => setPaymentMethod("stripe")}
									className="w-5 h-5 text-primary focus:ring-primary"
								/>
								<CreditCard className={`h-6 w-6 ${paymentMethod === "stripe" ? "text-primary" : "text-slate-400"}`} />
								<div>
									<div className="font-bold text-slate-900 dark:text-white">Credit / Debit Card</div>
									<div className="text-sm text-slate-500">Secure payment via Stripe (UPI, Cards, Apple Pay)</div>
								</div>
							</label>

							<label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300 dark:border-slate-700"}`}>
								<input 
									type="radio" 
									name="paymentMethod" 
									value="cod"
									checked={paymentMethod === "cod"}
									onChange={() => setPaymentMethod("cod")}
									className="w-5 h-5 text-primary focus:ring-primary"
								/>
								<Truck className={`h-6 w-6 ${paymentMethod === "cod" ? "text-primary" : "text-slate-400"}`} />
								<div>
									<div className="font-bold text-slate-900 dark:text-white">Cash on Delivery</div>
									<div className="text-sm text-slate-500">Pay when your order arrives</div>
								</div>
							</label>
						</div>
					</section>

				</div>

				{/* Right Column: Order Summary */}
				<div className="lg:col-span-5">
					<div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 sticky top-24 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
						<h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Order Summary</h2>
						
						<div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
							{cart?.lineItems?.map((item: any) => (
								<div key={item._id} className="flex justify-between items-start gap-4">
									<div className="flex-1">
										<div className="font-semibold text-slate-900 text-sm dark:text-white line-clamp-2">
											{item.title || item.productName?.translated}
										</div>
										<div className="text-slate-500 text-xs mt-1">Qty: {item.quantity}</div>
									</div>
									<div className="font-bold text-sm text-slate-900 dark:text-white shrink-0">
										AED {((typeof item.price === "object" ? Number(item.price.amount || 0) : Number(item.price || 0)) * (item.quantity || 1)).toFixed(2)}
									</div>
								</div>
							))}
						</div>
						
						{/* Promo Code */}
						<div className="mb-6 pt-4 border-t border-slate-200 dark:border-slate-700">
							<Label htmlFor="promo" className="mb-2 block">Promo Code</Label>
							<div className="flex gap-2">
								<Input
									id="promo"
									placeholder="Enter code"
									value={couponCode}
									onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
									disabled={!!appliedCoupon || applyingCoupon}
								/>
								<Button
									type="button"
									variant="secondary"
									disabled={!couponCode || !!appliedCoupon || applyingCoupon}
									onClick={handleApplyCoupon}
								>
									{appliedCoupon ? "Applied" : "Apply"}
								</Button>
							</div>
							{couponError && <div className="text-red-500 text-sm mt-1">{couponError}</div>}
							{appliedCoupon && (
								<div className="text-green-600 text-sm mt-1 flex justify-between items-center">
									<span>{appliedCoupon.code} applied!</span>
									<button type="button" onClick={() => { setAppliedCoupon(null); setCouponCode(""); }} className="text-red-500 hover:underline">Remove</button>
								</div>
							)}
						</div>
						
						<div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-700">
							<div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
								<span>Subtotal</span>
								<span className="font-medium">AED {baseCartTotal.toFixed(2)}</span>
							</div>
							{appliedCoupon && (
								<div className="flex justify-between text-sm text-green-600 dark:text-green-400">
									<span>Discount ({appliedCoupon.code})</span>
									<span className="font-medium">- AED {discountAmount.toFixed(2)}</span>
								</div>
							)}
							<div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
								<span>{shippingMethod === "express" ? "Express Shipping" : "Standard Shipping"} ({country})</span>
								<span className={shippingCost === 0 ? "font-medium text-green-600 dark:text-green-400" : "font-medium"}>
									{shippingCost === 0 ? "Free" : `AED ${shippingCost.toFixed(2)}`}
								</span>
							</div>
							{taxCost > 0 && (
								<div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
									<span>{taxName}</span>
									<span className="font-medium">AED {taxCost.toFixed(2)}</span>
								</div>
							)}
							
							<div className="flex justify-between font-extrabold text-lg text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-700">
								<span>Total</span>
								<span>AED {orderTotal.toFixed(2)}</span>
							</div>
						</div>

						<Button
							type="submit"
							size="lg"
							className="w-full mt-8 h-12 text-base font-bold shadow-md"
							disabled={loading}
						>
							{loading ? (
								<div className="flex items-center gap-2">
									<div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
									Processing...
								</div>
							) : paymentMethod === "cod" ? (
								`Place Order (AED ${orderTotal.toFixed(2)})`
							) : (
								`Pay with Stripe (AED ${orderTotal.toFixed(2)})`
							)}
						</Button>
						
						{Object.keys(errors).length > 0 && (
							<div className="mt-4 flex items-start gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
								<AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
								<span>Please fill in all required fields marked with *</span>
							</div>
						)}
					</div>
				</div>

			</form>
		</div>
	);
}
