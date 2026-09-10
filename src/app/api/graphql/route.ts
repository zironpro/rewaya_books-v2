import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";

import { Bundle } from "@/lib/db/models/Bundle";
import { Category } from "@/lib/db/models/Category";
import { Coupon } from "@/lib/db/models/Coupon";
import { HeroBanner } from "@/lib/db/models/HeroBanner";
import { HomepageSection } from "@/lib/db/models/HomepageSection";
import { Notification } from "@/lib/db/models/Notification";
import { Order } from "@/lib/db/models/Order";
import { Popup } from "@/lib/db/models/Popup";
import { Product } from "@/lib/db/models/Product";
import { RefundRequest } from "@/lib/db/models/RefundRequest";
import { ShippingConfig } from "@/lib/db/models/ShippingConfig";
import { TaxConfig } from "@/lib/db/models/TaxConfig";
import { User } from "@/lib/db/models/User";
import connectToDatabase from "@/lib/db/mongodb";
import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_URL) {
	const match = process.env.CLOUDINARY_URL.match(
		/cloudinary:\/\/([^:]+):([^@]+)@(.+)/
	);
	if (match) {
		cloudinary.config({
			api_key: match[1],
			api_secret: match[2],
			cloud_name: match[3],
			secure: true,
		});
	}
}

async function uploadToCloudinaryIfNeeded(imageUrl: string): Promise<string> {
	if (!imageUrl || imageUrl.includes("res.cloudinary.com") || imageUrl.includes("placeholder.com")) {
		return imageUrl && !imageUrl.includes("placeholder.com") ? imageUrl : "";
	}
	
	try {
		const fullUrl = imageUrl.startsWith("http") ? imageUrl : `https://static.wixstatic.com/media/${imageUrl}`;
		const result = await cloudinary.uploader.upload(fullUrl, { folder: "rewaya_books", format: "webp" });
		return result.secure_url;
	} catch (error) {
		console.error(`Failed to upload ${imageUrl} to Cloudinary:`, error);
		return "";
	}
}
import { stripe } from "@/lib/stripe";

// Define the GraphQL schema
const typeDefs = gql`
  type Product {
    id: ID!
    title: String!
    slug: String!
    author: String
    description: String
    price: Float!
    originalPrice: Float
    stock: Int
    coverImage: String
    images: [String]
    categoryId: String
    categorySlug: String
    categoryName: String
    categoryIds: [String]
    categories: [Category]
    isbn: String
    pages: Int
    language: String
    format: String
    ribbon: String
    publisher: String
    createdAt: String
    updatedAt: String
    sortOrder: Int
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    count: Int
    status: String
    sort: Int
    image: String
    products: [Product]
    createdAt: String
    updatedAt: String
  }

  type Bundle {
    id: ID!
    title: String!
    slug: String!
    description: String
    price: Float!
    originalPrice: Float
    coverImage: String
    books: [Product]
    isFeatured: Boolean
    createdAt: String
    updatedAt: String
  }

  type User {
    id: ID!
    name: String
    email: String!
    role: String
    phone: String
    city: String
    region: String
    createdAt: String
  }

  type ShippingConfig {
    id: ID!
    name: String!
    countries: [String!]!
    standardFee: Float!
    expressFee: Float!
    isExpressEnabled: Boolean
    isFreeDeliveryEnabled: Boolean
    freeThreshold: Float!
    deliveryTime: String!
    expressDeliveryTime: String
    isCodEnabled: Boolean
    codFee: Float
    status: String
  }

  type TaxConfig {
    id: ID!
    name: String!
    rate: Float!
    region: String!
    type: String!
    appliedToShipping: Boolean
    status: String
  }

  type Coupon {
    id: ID!
    code: String!
    discountType: String!
    discountAmount: Float!
    minPurchase: Float
    isFirstOrder: Boolean
    maxUses: Int
    usedCount: Int
    expiryDate: String
    status: String
    createdAt: String
    updatedAt: String
  }

  type HeroBanner {
    id: ID!
    title: String!
    subtitle: String
    ctaLabel: String
    ctaHref: String
    sortOrder: Int
    enabled: Boolean
    image: String
    createdAt: String
    updatedAt: String
  }

  type Popup {
    id: ID!
    title: String!
    description: String
    image: String
    ctaLabel: String
    ctaHref: String
    delaySeconds: Int
    enabled: Boolean
    expiresAt: String
    countdownText: String
    createdAt: String
    updatedAt: String
  }

  type RefundRequest {
    id: ID!
    orderId: ID!
    userId: ID
    reason: String!
    status: String!
    adminNotes: String
    stripeRefundId: String
    createdAt: String
    updatedAt: String
    order: Order
  }

  type HomepageSection {
    id: ID!
    key: String!
    title: String!
    subtitle: String
    categorySlug: String!
    limit: Int
    badge: String
    sortOrder: Int
    enabled: Boolean
    createdAt: String
    updatedAt: String
  }

  type OrderItem {
    productId: ID
    bundleId: ID
    title: String!
    price: Float!
    quantity: Int!
    product: Product
    bundle: Bundle
  }

  type ShippingAddress {
    firstName: String!
    lastName: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    state: String!
    postalCode: String!
    country: String!
    phone: String
  }

  type Order {
    id: ID!
    email: String!
    status: String!
    total: Float!
    shippingCost: Float
    taxAmount: Float
    items: [OrderItem!]!
    shippingAddress: ShippingAddress
    couponCode: String
    discountAmount: Float
    paymentMethod: String
    shippingMethod: String
    isPaid: Boolean
    stripeTransactionId: String
    invoiceUrl: String
    invoiceNumber: String
    createdAt: String
    deliveredAt: String
  }

  type ProductConnection {
    items: [Product!]!
    totalCount: Int!
    totalPages: Int!
  }

  type AdminDashboardStats {
    totalSales: Float!
    totalOrders: Int!
    activeCustomers: Int!
    totalBooks: Int!
  }

  type Query {
    productsPaginated(
      category: String
      q: String
      sort: String
      page: Int
      limit: Int
      customOrderIds: [ID!]
    ): ProductConnection!
    products: [Product!]!
    productBySlug(slug: String!): Product
    bundles: [Bundle!]!
    bundleBySlug(slug: String!): Bundle
    orders: [Order!]!
    orderById(id: ID!): Order
    heroBanners: [HeroBanner!]!
    homepageSections: [HomepageSection!]!
    users: [User!]!
    shippingConfigs: [ShippingConfig!]!
    taxConfigs: [TaxConfig!]!
    categories: [Category!]!
    coupons: [Coupon!]!
    coupon(id: ID!): Coupon
    validateCoupon(code: String!, cartTotal: Float!, email: String): Coupon
    popups: [Popup!]!
    refundRequests: [RefundRequest!]!
    refundRequest(id: ID!): RefundRequest
    adminDashboardStats: AdminDashboardStats!
  }

  input ProductInput {
    title: String!
    slug: String!
    author: String
    description: String
    price: Float!
    originalPrice: Float
    stock: Int
    coverImage: String
    categoryId: String
    categorySlug: String
    categoryName: String
    categoryIds: [String]
    isbn: String
    pages: Int
    language: String
    format: String
    ribbon: String
    publisher: String
    sortOrder: Int
  }

  input ShippingConfigInput {
    name: String!
    countries: [String!]!
    standardFee: Float!
    expressFee: Float!
    isExpressEnabled: Boolean
    isFreeDeliveryEnabled: Boolean
    freeThreshold: Float!
    deliveryTime: String!
    expressDeliveryTime: String
    isCodEnabled: Boolean
    codFee: Float
    status: String
  }

  input TaxConfigInput {
    name: String!
    rate: Float!
    region: String!
    type: String!
    appliedToShipping: Boolean
    status: String
  }

  input CouponInput {
    code: String!
    discountType: String!
    discountAmount: Float!
    minPurchase: Float
    isFirstOrder: Boolean
    maxUses: Int
    expiryDate: String
    status: String
  }

  input HeroBannerInput {
    title: String!
    subtitle: String
    ctaLabel: String
    ctaHref: String
    sortOrder: Int
    enabled: Boolean
    image: String
  }

  input CategoryInput {
    name: String!
    slug: String!
    count: Int
    status: String
    sort: Int
    image: String
    products: [ID!]
  }

  input OrderItemInput {
    productId: ID
    bundleId: ID
    title: String!
    price: Float!
    quantity: Int!
  }

  input CheckoutInput {
    email: String!
    items: [OrderItemInput!]!
    total: Float!
    shippingAddress: ShippingAddressInput!
  }

  input ShippingAddressInput {
    firstName: String!
    lastName: String!
    addressLine1: String!
    addressLine2: String
    city: String!
    state: String!
    postalCode: String!
    country: String!
    phone: String
  }

  input BundleInput {
    title: String!
    slug: String!
    description: String
    price: Float!
    originalPrice: Float
    coverImage: String
    books: [ID!]
    isFeatured: Boolean
  }

  input HeroBannerInput {
    title: String!
    subtitle: String
    ctaLabel: String
    ctaHref: String
    sortOrder: Int
    enabled: Boolean
    image: String
  }

  input HomepageSectionInput {
    key: String!
    title: String!
    subtitle: String
    categorySlug: String!
    limit: Int
    badge: String
    sortOrder: Int
    enabled: Boolean
  }

  input PopupInput {
    title: String!
    description: String
    image: String
    ctaLabel: String
    ctaHref: String
    delaySeconds: Int
    enabled: Boolean
    expiresAt: String
    countdownText: String
  }

  input RefundRequestInput {
    orderId: ID!
    reason: String!
  }

  input ProductSortOrderInput {
    id: ID!
    sortOrder: Int!
  }

  type Mutation {
    updateOrderStatus(id: ID!, status: String!): Order!
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    updateProductsSortOrder(updates: [ProductSortOrderInput!]!): Boolean!
    checkout(input: CheckoutInput!): Order!
    
    createBundle(input: BundleInput!): Bundle!
    updateBundle(id: ID!, input: BundleInput!): Bundle!
    deleteBundle(id: ID!): Boolean!
    
    createHeroBanner(input: HeroBannerInput!): HeroBanner!
    updateHeroBanner(id: ID!, input: HeroBannerInput!): HeroBanner!
    deleteHeroBanner(id: ID!): Boolean!
    
    createHomepageSection(input: HomepageSectionInput!): HomepageSection!
    deleteHomepageSection(id: ID!): Boolean!
    
    createShippingConfig(input: ShippingConfigInput!): ShippingConfig!
    updateShippingConfig(id: ID!, input: ShippingConfigInput!): ShippingConfig!
    deleteShippingConfig(id: ID!): Boolean!
    
    createTaxConfig(input: TaxConfigInput!): TaxConfig!
    updateTaxConfig(id: ID!, input: TaxConfigInput!): TaxConfig!
    deleteTaxConfig(id: ID!): Boolean!
    
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    createCoupon(input: CouponInput!): Coupon!
    updateCoupon(id: ID!, input: CouponInput!): Coupon!
    deleteCoupon(id: ID!): Boolean!

    createPopup(input: PopupInput!): Popup!
    updatePopup(id: ID!, input: PopupInput!): Popup!
    deletePopup(id: ID!): Boolean!

    createRefundRequest(input: RefundRequestInput!): RefundRequest!
    updateRefundRequestStatus(id: ID!, status: String!, adminNotes: String): RefundRequest!
    processStripeRefund(id: ID!): RefundRequest!
  }
`;

// Define the resolvers
const resolvers = {
	Query: {
		adminDashboardStats: async () => {
			await connectToDatabase();
			const [salesResult, ordersCount, usersCount, productsCount] = await Promise.all([
				Order.aggregate([
					{ $match: { isPaid: true } },
					{ $group: { _id: null, total: { $sum: "$total" } } }
				]),
				Order.countDocuments(),
				User.countDocuments(),
				Product.countDocuments()
			]);
			
			const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;
			
			return {
				totalSales,
				totalOrders: ordersCount,
				activeCustomers: usersCount,
				totalBooks: productsCount
			};
		},
		productsPaginated: async (_: any, args: any) => {
			await connectToDatabase();
			const { category, q, sort, page = 1, limit = 25, customOrderIds } = args;
			const skip = (page - 1) * limit;

			let filter: any = { stock: { $gt: 0 } };

			if (category) {
				const catLower = category.toLowerCase();
				filter.$or = [
					{ categorySlug: new RegExp("^" + catLower + "$", "i") },
					{ categoryId: category },
					{ categoryName: new RegExp("^" + catLower + "$", "i") },
					{ categoryIds: category },
				];

				if (customOrderIds && customOrderIds.length > 0) {
					const mongoose = require("mongoose");
					const objectIds = customOrderIds
						.map((id) => {
							try {
								return new mongoose.Types.ObjectId(id);
							} catch (e) {
								return null;
							}
						})
						.filter((id) => id !== null);

					filter.$or.push({ _id: { $in: objectIds } });
				}
			}

			if (q) {
				const query = q.toLowerCase();
				const qOr = [
					{ title: { $regex: new RegExp(query, "i") } },
					{ author: { $regex: new RegExp(query, "i") } },
					{ isbn: query },
				];
				if (filter.$or) {
					filter.$and = [{ $or: filter.$or }, { $or: qOr }];
					delete filter.$or;
				} else {
					filter.$or = qOr;
				}
				/* 
					{ title: { $regex: new RegExp(query, "i") } },
					{ author: { $regex: new RegExp(query, "i") } },
					{ isbn: query }
				);
*/
			}

			let pipeline: any[] = [{ $match: filter }];

			if (customOrderIds && customOrderIds.length > 0) {
				pipeline.push({
					$addFields: {
						indexFound: {
							$indexOfArray: [customOrderIds, { $toString: "$_id" }],
						},
					},
				});
				pipeline.push({
					$addFields: {
						customSortOrder: {
							$cond: [{ $eq: ["$indexFound", -1] }, 999999, "$indexFound"],
						},
					},
				});
				pipeline.push({
					$sort: { customSortOrder: 1, sortOrder: 1, createdAt: -1 },
				});
			} else if (sort) {
				let sortObj: any = {};
				switch (sort) {
					case "price-asc":
						sortObj.price = 1;
						break;
					case "price-desc":
						sortObj.price = -1;
						break;
					case "title-asc":
						sortObj.title = 1;
						break;
					case "title-desc":
						sortObj.title = -1;
						break;
					case "newest":
						sortObj.createdAt = -1;
						break;
					default:
						sortObj.sortOrder = 1;
						sortObj.createdAt = -1;
						break;
				}
				pipeline.push({ $sort: sortObj });
			} else {
				pipeline.push({ $sort: { sortOrder: 1, createdAt: -1 } });
			}

			// execute pipeline
			pipeline.push({ $skip: skip });
			pipeline.push({ $limit: limit });

			const items = await Product.aggregate(pipeline);
			const totalCount = await Product.countDocuments(filter);
			const totalPages = Math.ceil(totalCount / limit);

			// map _id to id to match GraphQL type
			const mappedItems = items.map((item) => ({
				...item,
				id: item._id.toString(),
			}));

			return {
				items: mappedItems,
				totalCount,
				totalPages,
			};
		},
		products: async () => {
			await connectToDatabase();
			return await Product.find({})
				.sort({ sortOrder: 1, createdAt: -1 })
				.lean();
		},
		productBySlug: async (_: any, { slug }: { slug: string }) => {
			await connectToDatabase();
			return await Product.findOne({ slug }).lean();
		},
		bundles: async () => {
			await connectToDatabase();
			return await Bundle.find({}).populate("books");
		},
		bundleBySlug: async (_: any, { slug }: { slug: string }) => {
			await connectToDatabase();
			return await Bundle.findOne({ slug }).populate("books");
		},
		orders: async () => {
			await connectToDatabase();
			return await Order.find({}).sort({ createdAt: -1 });
		},
		orderById: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			return await Order.findById(id);
		},
		heroBanners: async () => {
			await connectToDatabase();
			return await HeroBanner.find({}).sort({ sortOrder: 1, createdAt: -1 });
		},
		homepageSections: async () => {
			await connectToDatabase();
			return await HomepageSection.find({}).sort({
				sortOrder: 1,
				createdAt: -1,
			});
		},
		users: async () => {
			await connectToDatabase();
			return await User.find({}).sort({ createdAt: -1 });
		},
		shippingConfigs: async () => {
			await connectToDatabase();
			return await ShippingConfig.find({});
		},
		taxConfigs: async () => {
			await connectToDatabase();
			return await TaxConfig.find({});
		},
		categories: async () => {
			await connectToDatabase();
			return await Category.find({})
				.populate({
					path: "products",
					select: "id title coverImage slug",
					options: { lean: true },
				})
				.sort({ sort: 1 })
				.lean();
		},
		coupons: async () => {
			await connectToDatabase();
			return await Coupon.find().sort({ createdAt: -1 });
		},
		coupon: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			return await Coupon.findById(id);
		},
		validateCoupon: async (
			_: any,
			{ code, cartTotal, email }: { code: string; cartTotal: number; email?: string }
		) => {
			await connectToDatabase();
			const coupon = await Coupon.findOne({ code: code.toUpperCase() });

			if (!coupon) throw new Error("Invalid coupon code");
			if (coupon.status !== "Active")
				throw new Error("Coupon is no longer active");
			if (coupon.expiryDate) {
				const expiry = new Date(coupon.expiryDate);
				expiry.setHours(23, 59, 59, 999);
				if (expiry < new Date()) {
					throw new Error("Coupon has expired");
				}
			}
			if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
				throw new Error("Coupon usage limit reached");
			if (coupon.minPurchase && cartTotal < coupon.minPurchase)
				throw new Error(
					`Minimum purchase of AED ${coupon.minPurchase} required`
				);

			if (coupon.isFirstOrder) {
				if (!email) {
					throw new Error("Please enter your email to use this first-order coupon");
				}
				const existingOrder = await Order.findOne({ email });
				if (existingOrder) {
					throw new Error("This coupon is only valid for your first order");
				}
			}

			return coupon;
		},
		popups: async () => {
			await connectToDatabase();
			return await Popup.find({}).sort({ createdAt: -1 });
		},
		refundRequests: async () => {
			await connectToDatabase();
			return await RefundRequest.find({}).sort({ createdAt: -1 });
		},
		refundRequest: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			return await RefundRequest.findById(id);
		},
	},
	Product: {
		id: (parent: any) =>
			parent.id || (parent._id ? parent._id.toString() : null),
	},
	Category: {
		id: (parent: any) =>
			parent.id || (parent._id ? parent._id.toString() : null),
	},
	OrderItem: {
		product: async (parent: any) => {
			if (!parent.productId) return null;
			await connectToDatabase();
			return await Product.findById(parent.productId);
		},
		bundle: async (parent: any) => {
			if (!parent.bundleId) return null;
			await connectToDatabase();
			return await Bundle.findById(parent.bundleId).populate("books");
		},
	},
	RefundRequest: {
		order: async (parent: any) => {
			if (!parent.orderId) return null;
			await connectToDatabase();
			return await Order.findById(parent.orderId);
		},
	},
	Mutation: {
		updateOrderStatus: async (
			_: any,
			{ id, status }: { id: string; status: string }
		) => {
			await connectToDatabase();
			const validStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
			if (!validStatuses.includes(status)) {
				throw new Error("Invalid status");
			}

			const existingOrder = await Order.findById(id);
			if (!existingOrder) throw new Error("Order not found");

			const updateData: any = { status };
			if (status === "DELIVERED") {
				updateData.isPaid = true;
				updateData.deliveredAt = new Date();
			}

			const order = await Order.findByIdAndUpdate(id, updateData, {
				new: true,
			});
			if (!order) throw new Error("Order not found");

			// Trigger Cancelled Notification and restore stock
			if (status === "CANCELLED" && existingOrder.status !== "CANCELLED") {
				// Restore stock
				for (const item of order.items) {
					if (item.productId) {
						await Product.findByIdAndUpdate(item.productId, {
							$inc: { stock: item.quantity },
						});
					}
				}

				await Notification.create({
					title: "Order Cancelled",
					message: `Order #${order._id.toString().slice(-6).toUpperCase()} was cancelled.`,
					type: "cancelled",
					orderId: order._id.toString(),
				});
			}

			return order;
		},
		createProduct: async (_: any, { input }: { input: any }) => {
			await connectToDatabase();
			console.log("CREATE PRODUCT INPUT:", input);

			if (input.coverImage) {
				input.coverImage = await uploadToCloudinaryIfNeeded(input.coverImage);
				if (input.coverImage && (!input.images || input.images.length === 0)) {
					input.images = [input.coverImage];
				}
			}

			if (input.sortOrder === undefined || input.sortOrder === null) {
				const maxProduct = await Product.findOne().sort({ sortOrder: -1 });
				input.sortOrder = maxProduct ? (maxProduct.sortOrder || 0) + 1 : 1;
			}

			// Resolve multiple categories
			const resolvedCategories = [];
			if (input.categoryIds && input.categoryIds.length > 0) {
				const cats = await Category.find({ _id: { $in: input.categoryIds } });
				for (const cat of cats) {
					resolvedCategories.push({
						id: cat._id.toString(),
						name: cat.name,
						slug: cat.slug,
					});
				}
				input.categories = resolvedCategories;
			}

			const product = new Product(input);
			await product.save();

			if (input.categoryIds && input.categoryIds.length > 0) {
				await Category.updateMany(
					{ _id: { $in: input.categoryIds } },
					{
						$push: { products: product._id },
						$inc: { count: 1 },
					}
				);
			} else if (input.categoryId) {
				await Category.findByIdAndUpdate(input.categoryId, {
					$push: { products: product._id },
					$inc: { count: 1 },
				});
			} else if (input.categoryName) {
				let cat = await Category.findOne({
					name: {
						$regex: new RegExp("^" + input.categoryName.trim() + "$", "i"),
					},
				});
				if (!cat) {
					cat = new Category({
						name: input.categoryName.trim(),
						slug: input.categoryName
							.trim()
							.toLowerCase()
							.replace(/[^a-z0-9]+/g, "-"),
						count: 0,
					});
					await cat.save();
				}

				await Category.findByIdAndUpdate(cat._id, {
					$push: { products: product._id },
					$inc: { count: 1 },
				});

				product.categoryId = cat._id.toString();
				product.categorySlug = cat.slug;
				await product.save();
			}
			return product;
		},
		updateProduct: async (
			_: any,
			{ id, input }: { id: string; input: any }
		) => {
			await connectToDatabase();
			console.log("UPDATE PRODUCT INPUT:", input);

			if (input.coverImage) {
				input.coverImage = await uploadToCloudinaryIfNeeded(input.coverImage);
				if (input.coverImage && (!input.images || input.images.length === 0)) {
					input.images = [input.coverImage];
				}
			}

			const oldProduct = await Product.findById(id);

			if (input.categoryIds) {
				const oldCategoryIds = oldProduct.categoryIds || [];
				const newCategoryIds = input.categoryIds;

				const addedIds = newCategoryIds.filter(
					(id) => !oldCategoryIds.includes(id)
				);
				const removedIds = oldCategoryIds.filter(
					(id) => !newCategoryIds.includes(id)
				);

				if (addedIds.length > 0) {
					await Category.updateMany(
						{ _id: { $in: addedIds } },
						{ $push: { products: id }, $inc: { count: 1 } }
					);
				}
				if (removedIds.length > 0) {
					await Category.updateMany(
						{ _id: { $in: removedIds } },
						{ $pull: { products: id }, $inc: { count: -1 } }
					);
				}

				const cats = await Category.find({ _id: { $in: newCategoryIds } });
				input.categories = cats.map((cat) => ({
					id: cat._id.toString(),
					name: cat.name,
					slug: cat.slug,
				}));
			} else {
				let newCategoryId = input.categoryId;

				if (!newCategoryId && input.categoryName) {
					let cat = await Category.findOne({
						name: {
							$regex: new RegExp("^" + input.categoryName.trim() + "$", "i"),
						},
					});
					if (!cat) {
						cat = new Category({
							name: input.categoryName.trim(),
							slug: input.categoryName
								.trim()
								.toLowerCase()
								.replace(/[^a-z0-9]+/g, "-"),
							count: 0,
						});
						await cat.save();
					}
					newCategoryId = cat._id.toString();
					input.categoryId = newCategoryId;
					input.categorySlug = cat.slug;
				}

				if (oldProduct && oldProduct.categoryId !== newCategoryId) {
					if (oldProduct.categoryId) {
						await Category.findByIdAndUpdate(oldProduct.categoryId, {
							$pull: { products: id },
							$inc: { count: -1 },
						});
					}
					if (newCategoryId) {
						await Category.findByIdAndUpdate(newCategoryId, {
							$push: { products: id },
							$inc: { count: 1 },
						});
					}
				}
			}

			return await Product.findByIdAndUpdate(id, input, { new: true });
		},
		updateProductsSortOrder: async (
			_: any,
			{ updates }: { updates: { id: string; sortOrder: number }[] }
		) => {
			await connectToDatabase();
			if (!updates || updates.length === 0) return true;

			const bulkOps = updates.map((update) => ({
				updateOne: {
					filter: { _id: update.id },
					update: { $set: { sortOrder: update.sortOrder } },
				},
			}));

			await Product.bulkWrite(bulkOps);
			return true;
		},
		deleteProduct: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			const product = await Product.findById(id);
			if (product && product.categoryId) {
				await Category.findByIdAndUpdate(product.categoryId, {
					$pull: { products: id },
					$inc: { count: -1 },
				});
			}
			const res = await Product.findByIdAndDelete(id);
			return !!res;
		},
		checkout: async (_: any, { input }: { input: any }) => {
			await connectToDatabase();
			const order = new Order({
				email: input.email,
				items: input.items,
				total: input.total,
				shippingAddress: input.shippingAddress,
				status: "PENDING",
			});
			await order.save();

			// Trigger New Order Notification
			await Notification.create({
				title: "New Order Received",
				message: `Order #${order._id.toString().slice(-6).toUpperCase()} has been placed.`,
				type: "new_order",
				orderId: order._id.toString(),
			});

			return order;
		},
		createBundle: async (_: any, { input }: { input: any }) => {
			await connectToDatabase();
			const bundle = new Bundle(input);
			await bundle.save();
			return bundle;
		},
		updateBundle: async (_: any, { id, input }: { id: string; input: any }) => {
			await connectToDatabase();
			const updated = await Bundle.findByIdAndUpdate(id, input, { new: true });
			return updated;
		},
		deleteBundle: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			const res = await Bundle.findByIdAndDelete(id);
			return !!res;
		},
		createHeroBanner: async (_: any, { input }: { input: any }) => {
			await connectToDatabase();
			const banner = new HeroBanner(input);
			await banner.save();
			return banner;
		},
		updateHeroBanner: async (
			_: any,
			{ id, input }: { id: string; input: any }
		) => {
			await connectToDatabase();
			const updated = await HeroBanner.findByIdAndUpdate(id, input, {
				new: true,
			});
			return updated;
		},
		deleteHeroBanner: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			const res = await HeroBanner.findByIdAndDelete(id);
			return !!res;
		},
		createHomepageSection: async (_: any, { input }: { input: any }) => {
			await connectToDatabase();
			const section = new HomepageSection(input);
			await section.save();
			return section;
		},
		deleteHomepageSection: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			const res = await HomepageSection.findByIdAndDelete(id);
			return !!res;
		},
		createShippingConfig: async (_: any, { input }: { input: any }) => {
			await connectToDatabase();
			const config = new ShippingConfig(input);
			await config.save();
			return config;
		},
		updateShippingConfig: async (
			_: any,
			{ id, input }: { id: string; input: any }
		) => {
			await connectToDatabase();
			const config = await ShippingConfig.findByIdAndUpdate(id, input, {
				new: true,
			});
			return config;
		},
		deleteShippingConfig: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			const res = await ShippingConfig.findByIdAndDelete(id);
			return !!res;
		},
		createTaxConfig: async (_: any, { input }: { input: any }) => {
			await connectToDatabase();
			const config = new TaxConfig(input);
			await config.save();
			return config;
		},
		updateTaxConfig: async (
			_: any,
			{ id, input }: { id: string; input: any }
		) => {
			await connectToDatabase();
			const config = await TaxConfig.findByIdAndUpdate(id, input, {
				new: true,
			});
			return config;
		},
		deleteTaxConfig: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			const res = await TaxConfig.findByIdAndDelete(id);
			return !!res;
		},
		createCategory: async (_: any, { input }: { input: any }) => {
			await connectToDatabase();
			const category = new Category(input);
			await category.save();
			return await category.populate("products");
		},
		updateCategory: async (
			_: any,
			{ id, input }: { id: string; input: any }
		) => {
			await connectToDatabase();

			// Sync category name and slug to all associated products
			if (input.name || input.slug) {
				const updateFields: any = {};
				if (input.name) updateFields.categoryName = input.name;
				if (input.slug) updateFields.categorySlug = input.slug;

				if (Object.keys(updateFields).length > 0) {
					await Product.updateMany({ categoryId: id }, { $set: updateFields });
				}
			}

			// If products array is provided, sync product category references
			if (input.products !== undefined) {
				const currentCat = await Category.findById(id);
				const catName = input.name || currentCat?.name || "";
				const catSlug = input.slug || currentCat?.slug || "";

				// 1. Remove this category from all products that currently have it (to cleanly overwrite)
				await Product.updateMany(
					{ categoryIds: id },
					{
						$pull: {
							categoryIds: id,
							categories: { id: id },
						},
					}
				);
				await Product.updateMany(
					{ categoryId: id },
					{
						$unset: { categoryId: "", categoryName: "", categorySlug: "" },
					}
				);

				// 2. Add this category to all products in input.products
				if (input.products.length > 0) {
					await Product.updateMany(
						{ _id: { $in: input.products } },
						{
							$set: {
								categoryId: id,
								categoryName: catName,
								categorySlug: catSlug,
							},
							$addToSet: {
								categoryIds: id,
								categories: { id: id, name: catName, slug: catSlug },
							},
						}
					);
				}
			}

			return await Category.findByIdAndUpdate(id, input, {
				new: true,
			}).populate("products");
		},
		deleteCategory: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			// Unset category details on any products that belonged to this category
			await Product.updateMany(
				{ categoryId: id },
				{ $unset: { categoryId: "", categoryName: "", categorySlug: "" } }
			);
			const res = await Category.findByIdAndDelete(id);
			return !!res;
		},
		createCoupon: async (_: any, { input }: { input: any }) => {
			await connectToDatabase();
			const coupon = new Coupon(input);
			await coupon.save();
			return coupon;
		},
		updateCoupon: async (_: any, { id, input }: { id: string; input: any }) => {
			await connectToDatabase();
			const updated = await Coupon.findByIdAndUpdate(id, input, { new: true });
			return updated;
		},
		deleteCoupon: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			const res = await Coupon.findByIdAndDelete(id);
			return !!res;
		},
		createPopup: async (_: any, { input }: { input: any }) => {
			await connectToDatabase();
			const popup = new Popup(input);
			await popup.save();
			return popup;
		},
		updatePopup: async (_: any, { id, input }: { id: string; input: any }) => {
			await connectToDatabase();
			const updated = await Popup.findByIdAndUpdate(id, input, { new: true });
			return updated;
		},
		deletePopup: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			const res = await Popup.findByIdAndDelete(id);
			return !!res;
		},
		createRefundRequest: async (
			_: any,
			{ input }: { input: any },
			context: any
		) => {
			await connectToDatabase();
			const existing = await RefundRequest.findOne({ orderId: input.orderId });
			if (existing) {
				throw new Error("A refund request for this order already exists.");
			}
			const request = new RefundRequest({
				orderId: input.orderId,
				reason: input.reason,
			});
			await request.save();
			return request;
		},
		updateRefundRequestStatus: async (
			_: any,
			{
				id,
				status,
				adminNotes,
			}: { id: string; status: string; adminNotes?: string }
		) => {
			await connectToDatabase();
			const request = await RefundRequest.findById(id);
			if (!request) throw new Error("Refund request not found");

			request.status = status;
			if (adminNotes !== undefined) request.adminNotes = adminNotes;

			await request.save();

			// When a refund is confirmed (e.g. manual/COD), also cancel the linked order
			if (status === "REFUNDED" && request.orderId) {
				await Order.findByIdAndUpdate(request.orderId, { status: "CANCELLED" });
			}

			return request;
		},
		processStripeRefund: async (_: any, { id }: { id: string }) => {
			await connectToDatabase();
			const request = await RefundRequest.findById(id);
			if (!request) throw new Error("Refund request not found");
			if (request.status === "REFUNDED") throw new Error("Already refunded");
			if (request.status !== "ACCEPTED")
				throw new Error("Refund request must be ACCEPTED first");

			const order = await Order.findById(request.orderId);
			if (!order) throw new Error("Order not found");
			if (order.paymentMethod !== "Stripe")
				throw new Error("Not a Stripe order. Refund manually.");
			if (!order.stripeTransactionId)
				throw new Error("No Stripe Transaction ID found for this order.");
			if (request.stripeRefundId)
				throw new Error("Stripe refund already initiated.");

			try {
				const refund = await stripe.refunds.create({
					payment_intent: order.stripeTransactionId,
				});

				request.stripeRefundId = refund.id;
				request.status = "REFUNDED";
				await request.save();

				order.status = "CANCELLED";
				await order.save();

				return request;
			} catch (error: any) {
				console.error("Stripe Refund Error:", error);
				throw new Error(error.message || "Failed to process Stripe refund");
			}
		},
	},
};

// Initialize Apollo Server
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// Create Next.js handler
const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
