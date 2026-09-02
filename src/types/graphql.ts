/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { customFetcher } from '@/lib/graphql-client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;

						export class TypedDocumentString<TResult, TVariables>
						extends String
						{
						__apiType?: import('@graphql-typed-document-node/core').DocumentTypeDecoration<TResult, TVariables> | undefined;
						
						constructor(private value: string, public __meta__?: Record<string, any>) {
							super(value);
						}

						toString(): string & import('@graphql-typed-document-node/core').DocumentTypeDecoration<TResult, TVariables> {
							return this.value as any;
						}
						}
						
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Bundle = {
  __typename?: 'Bundle';
  books?: Maybe<Array<Maybe<Product>>>;
  coverImage?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isFeatured?: Maybe<Scalars['Boolean']['output']>;
  originalPrice?: Maybe<Scalars['Float']['output']>;
  price: Scalars['Float']['output'];
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type BundleInput = {
  books?: InputMaybe<Array<Scalars['ID']['input']>>;
  coverImage?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isFeatured?: InputMaybe<Scalars['Boolean']['input']>;
  originalPrice?: InputMaybe<Scalars['Float']['input']>;
  price: Scalars['Float']['input'];
  slug: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type Category = {
  __typename?: 'Category';
  count?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  products?: Maybe<Array<Maybe<Product>>>;
  slug: Scalars['String']['output'];
  sort?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type CategoryInput = {
  count?: InputMaybe<Scalars['Int']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  products?: InputMaybe<Array<Scalars['ID']['input']>>;
  slug: Scalars['String']['input'];
  sort?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type CheckoutInput = {
  email: Scalars['String']['input'];
  items: Array<OrderItemInput>;
  shippingAddress: ShippingAddressInput;
  total: Scalars['Float']['input'];
};

export type Coupon = {
  __typename?: 'Coupon';
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  discountAmount: Scalars['Float']['output'];
  discountType: Scalars['String']['output'];
  expiryDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  maxUses?: Maybe<Scalars['Int']['output']>;
  minPurchase?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  usedCount?: Maybe<Scalars['Int']['output']>;
};

export type CouponInput = {
  code: Scalars['String']['input'];
  discountAmount: Scalars['Float']['input'];
  discountType: Scalars['String']['input'];
  expiryDate?: InputMaybe<Scalars['String']['input']>;
  maxUses?: InputMaybe<Scalars['Int']['input']>;
  minPurchase?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type HeroBanner = {
  __typename?: 'HeroBanner';
  createdAt?: Maybe<Scalars['String']['output']>;
  ctaHref?: Maybe<Scalars['String']['output']>;
  ctaLabel?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type HeroBannerInput = {
  ctaHref?: InputMaybe<Scalars['String']['input']>;
  ctaLabel?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type HomepageSection = {
  __typename?: 'HomepageSection';
  badge?: Maybe<Scalars['String']['output']>;
  categorySlug: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  limit?: Maybe<Scalars['Int']['output']>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type HomepageSectionInput = {
  badge?: InputMaybe<Scalars['String']['input']>;
  categorySlug: Scalars['String']['input'];
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  key: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  checkout: Order;
  createBundle: Bundle;
  createCategory: Category;
  createCoupon: Coupon;
  createHeroBanner: HeroBanner;
  createHomepageSection: HomepageSection;
  createPopup: Popup;
  createProduct: Product;
  createRefundRequest: RefundRequest;
  createShippingConfig: ShippingConfig;
  createTaxConfig: TaxConfig;
  deleteBundle: Scalars['Boolean']['output'];
  deleteCategory: Scalars['Boolean']['output'];
  deleteCoupon: Scalars['Boolean']['output'];
  deleteHeroBanner: Scalars['Boolean']['output'];
  deleteHomepageSection: Scalars['Boolean']['output'];
  deletePopup: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteShippingConfig: Scalars['Boolean']['output'];
  deleteTaxConfig: Scalars['Boolean']['output'];
  processStripeRefund: RefundRequest;
  updateBundle: Bundle;
  updateCategory: Category;
  updateCoupon: Coupon;
  updateHeroBanner: HeroBanner;
  updateOrderStatus: Order;
  updatePopup: Popup;
  updateProduct: Product;
  updateRefundRequestStatus: RefundRequest;
  updateShippingConfig: ShippingConfig;
  updateTaxConfig: TaxConfig;
};


export type MutationCheckoutArgs = {
  input: CheckoutInput;
};


export type MutationCreateBundleArgs = {
  input: BundleInput;
};


export type MutationCreateCategoryArgs = {
  input: CategoryInput;
};


export type MutationCreateCouponArgs = {
  input: CouponInput;
};


export type MutationCreateHeroBannerArgs = {
  input: HeroBannerInput;
};


export type MutationCreateHomepageSectionArgs = {
  input: HomepageSectionInput;
};


export type MutationCreatePopupArgs = {
  input: PopupInput;
};


export type MutationCreateProductArgs = {
  input: ProductInput;
};


export type MutationCreateRefundRequestArgs = {
  input: RefundRequestInput;
};


export type MutationCreateShippingConfigArgs = {
  input: ShippingConfigInput;
};


export type MutationCreateTaxConfigArgs = {
  input: TaxConfigInput;
};


export type MutationDeleteBundleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCouponArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteHeroBannerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteHomepageSectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePopupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShippingConfigArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaxConfigArgs = {
  id: Scalars['ID']['input'];
};


export type MutationProcessStripeRefundArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateBundleArgs = {
  id: Scalars['ID']['input'];
  input: BundleInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID']['input'];
  input: CategoryInput;
};


export type MutationUpdateCouponArgs = {
  id: Scalars['ID']['input'];
  input: CouponInput;
};


export type MutationUpdateHeroBannerArgs = {
  id: Scalars['ID']['input'];
  input: HeroBannerInput;
};


export type MutationUpdateOrderStatusArgs = {
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdatePopupArgs = {
  id: Scalars['ID']['input'];
  input: PopupInput;
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: ProductInput;
};


export type MutationUpdateRefundRequestStatusArgs = {
  adminNotes?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateShippingConfigArgs = {
  id: Scalars['ID']['input'];
  input: ShippingConfigInput;
};


export type MutationUpdateTaxConfigArgs = {
  id: Scalars['ID']['input'];
  input: TaxConfigInput;
};

export type Order = {
  __typename?: 'Order';
  couponCode?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  discountAmount?: Maybe<Scalars['Float']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  invoiceNumber?: Maybe<Scalars['String']['output']>;
  invoiceUrl?: Maybe<Scalars['String']['output']>;
  isPaid?: Maybe<Scalars['Boolean']['output']>;
  items: Array<OrderItem>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  shippingAddress?: Maybe<ShippingAddress>;
  shippingCost?: Maybe<Scalars['Float']['output']>;
  shippingMethod?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  stripeTransactionId?: Maybe<Scalars['String']['output']>;
  taxAmount?: Maybe<Scalars['Float']['output']>;
  total: Scalars['Float']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  bundle?: Maybe<Bundle>;
  bundleId?: Maybe<Scalars['ID']['output']>;
  price: Scalars['Float']['output'];
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['ID']['output']>;
  quantity: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type OrderItemInput = {
  bundleId?: InputMaybe<Scalars['ID']['input']>;
  price: Scalars['Float']['input'];
  productId?: InputMaybe<Scalars['ID']['input']>;
  quantity: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type Popup = {
  __typename?: 'Popup';
  createdAt?: Maybe<Scalars['String']['output']>;
  ctaHref?: Maybe<Scalars['String']['output']>;
  ctaLabel?: Maybe<Scalars['String']['output']>;
  delaySeconds?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type PopupInput = {
  ctaHref?: InputMaybe<Scalars['String']['input']>;
  ctaLabel?: InputMaybe<Scalars['String']['input']>;
  delaySeconds?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type Product = {
  __typename?: 'Product';
  author?: Maybe<Scalars['String']['output']>;
  categoryId?: Maybe<Scalars['String']['output']>;
  categoryName?: Maybe<Scalars['String']['output']>;
  categorySlug?: Maybe<Scalars['String']['output']>;
  coverImage?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  isbn?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  originalPrice?: Maybe<Scalars['Float']['output']>;
  pages?: Maybe<Scalars['Int']['output']>;
  price: Scalars['Float']['output'];
  publisher?: Maybe<Scalars['String']['output']>;
  ribbon?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  sortOrder?: Maybe<Scalars['Int']['output']>;
  stock?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ProductInput = {
  author?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  categoryName?: InputMaybe<Scalars['String']['input']>;
  categorySlug?: InputMaybe<Scalars['String']['input']>;
  coverImage?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  originalPrice?: InputMaybe<Scalars['Float']['input']>;
  pages?: InputMaybe<Scalars['Int']['input']>;
  price: Scalars['Float']['input'];
  publisher?: InputMaybe<Scalars['String']['input']>;
  ribbon?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  bundleBySlug?: Maybe<Bundle>;
  bundles: Array<Bundle>;
  categories: Array<Category>;
  coupon?: Maybe<Coupon>;
  coupons: Array<Coupon>;
  heroBanners: Array<HeroBanner>;
  homepageSections: Array<HomepageSection>;
  orderById?: Maybe<Order>;
  orders: Array<Order>;
  popups: Array<Popup>;
  productBySlug?: Maybe<Product>;
  products: Array<Product>;
  refundRequest?: Maybe<RefundRequest>;
  refundRequests: Array<RefundRequest>;
  shippingConfigs: Array<ShippingConfig>;
  taxConfigs: Array<TaxConfig>;
  users: Array<User>;
  validateCoupon?: Maybe<Coupon>;
};


export type QueryBundleBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryCouponArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrderByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryRefundRequestArgs = {
  id: Scalars['ID']['input'];
};


export type QueryValidateCouponArgs = {
  cartTotal: Scalars['Float']['input'];
  code: Scalars['String']['input'];
};

export type RefundRequest = {
  __typename?: 'RefundRequest';
  adminNotes?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  order?: Maybe<Order>;
  orderId: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  status: Scalars['String']['output'];
  stripeRefundId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type RefundRequestInput = {
  orderId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};

export type ShippingAddress = {
  __typename?: 'ShippingAddress';
  addressLine1: Scalars['String']['output'];
  addressLine2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
};

export type ShippingAddressInput = {
  addressLine1: Scalars['String']['input'];
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type ShippingConfig = {
  __typename?: 'ShippingConfig';
  countries: Array<Scalars['String']['output']>;
  deliveryTime: Scalars['String']['output'];
  expressDeliveryTime?: Maybe<Scalars['String']['output']>;
  expressFee: Scalars['Float']['output'];
  freeThreshold: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isExpressEnabled?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  standardFee: Scalars['Float']['output'];
  status?: Maybe<Scalars['String']['output']>;
};

export type ShippingConfigInput = {
  countries: Array<Scalars['String']['input']>;
  deliveryTime: Scalars['String']['input'];
  expressDeliveryTime?: InputMaybe<Scalars['String']['input']>;
  expressFee: Scalars['Float']['input'];
  freeThreshold: Scalars['Float']['input'];
  isExpressEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  standardFee: Scalars['Float']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type TaxConfig = {
  __typename?: 'TaxConfig';
  appliedToShipping?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  rate: Scalars['Float']['output'];
  region: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type TaxConfigInput = {
  appliedToShipping?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  rate: Scalars['Float']['input'];
  region: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  city?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};














export type CreateProductMutationVariables = Exact<{
  input: ProductInput;
}>;


export type CreateProductMutation = { createProduct: { id: string, title: string, slug: string, price: number, stock: number | null, ribbon: string | null, publisher: string | null, description: string | null, language: string | null } };

export type UpdateProductMutationVariables = Exact<{
  id: string | number;
  input: ProductInput;
}>;


export type UpdateProductMutation = { updateProduct: { id: string, title: string, slug: string, price: number, stock: number | null, ribbon: string | null, publisher: string | null, description: string | null, language: string | null } };

export type DeleteProductMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteProductMutation = { deleteProduct: boolean };

export type CreateBundleMutationVariables = Exact<{
  input: BundleInput;
}>;


export type CreateBundleMutation = { createBundle: { id: string, title: string, slug: string, price: number } };

export type UpdateBundleMutationVariables = Exact<{
  id: string | number;
  input: BundleInput;
}>;


export type UpdateBundleMutation = { updateBundle: { id: string, title: string, slug: string, price: number } };

export type DeleteBundleMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteBundleMutation = { deleteBundle: boolean };

export type CreateHeroBannerMutationVariables = Exact<{
  input: HeroBannerInput;
}>;


export type CreateHeroBannerMutation = { createHeroBanner: { id: string, title: string, subtitle: string | null, ctaLabel: string | null, ctaHref: string | null, sortOrder: number | null, enabled: boolean | null } };

export type DeleteHeroBannerMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteHeroBannerMutation = { deleteHeroBanner: boolean };

export type UpdateHeroBannerMutationVariables = Exact<{
  id: string | number;
  input: HeroBannerInput;
}>;


export type UpdateHeroBannerMutation = { updateHeroBanner: { id: string, title: string, subtitle: string | null, ctaLabel: string | null, ctaHref: string | null, sortOrder: number | null, enabled: boolean | null, image: string | null } };

export type CreatePopupMutationVariables = Exact<{
  input: PopupInput;
}>;


export type CreatePopupMutation = { createPopup: { id: string, title: string, description: string | null, image: string | null, ctaLabel: string | null, ctaHref: string | null, delaySeconds: number | null, enabled: boolean | null } };

export type UpdatePopupMutationVariables = Exact<{
  id: string | number;
  input: PopupInput;
}>;


export type UpdatePopupMutation = { updatePopup: { id: string, title: string, description: string | null, image: string | null, ctaLabel: string | null, ctaHref: string | null, delaySeconds: number | null, enabled: boolean | null } };

export type DeletePopupMutationVariables = Exact<{
  id: string | number;
}>;


export type DeletePopupMutation = { deletePopup: boolean };

export type CreateHomepageSectionMutationVariables = Exact<{
  input: HomepageSectionInput;
}>;


export type CreateHomepageSectionMutation = { createHomepageSection: { id: string, key: string, title: string, subtitle: string | null, categorySlug: string, limit: number | null, badge: string | null, sortOrder: number | null, enabled: boolean | null } };

export type DeleteHomepageSectionMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteHomepageSectionMutation = { deleteHomepageSection: boolean };

export type CreateShippingConfigMutationVariables = Exact<{
  input: ShippingConfigInput;
}>;


export type CreateShippingConfigMutation = { createShippingConfig: { id: string, name: string, countries: Array<string>, standardFee: number, expressFee: number, freeThreshold: number, deliveryTime: string, status: string | null } };

export type DeleteShippingConfigMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteShippingConfigMutation = { deleteShippingConfig: boolean };

export type UpdateShippingConfigMutationVariables = Exact<{
  id: string | number;
  input: ShippingConfigInput;
}>;


export type UpdateShippingConfigMutation = { updateShippingConfig: { id: string, name: string, countries: Array<string>, standardFee: number, expressFee: number, freeThreshold: number, deliveryTime: string, status: string | null } };

export type CreateTaxConfigMutationVariables = Exact<{
  input: TaxConfigInput;
}>;


export type CreateTaxConfigMutation = { createTaxConfig: { id: string, name: string, rate: number, region: string, type: string, appliedToShipping: boolean | null, status: string | null } };

export type DeleteTaxConfigMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteTaxConfigMutation = { deleteTaxConfig: boolean };

export type UpdateTaxConfigMutationVariables = Exact<{
  id: string | number;
  input: TaxConfigInput;
}>;


export type UpdateTaxConfigMutation = { updateTaxConfig: { id: string, name: string, rate: number, region: string, type: string, appliedToShipping: boolean | null, status: string | null } };

export type CreateCategoryMutationVariables = Exact<{
  input: CategoryInput;
}>;


export type CreateCategoryMutation = { createCategory: { id: string, name: string, slug: string, count: number | null, status: string | null, sort: number | null, image: string | null, products: Array<{ id: string } | null> | null } };

export type UpdateCategoryMutationVariables = Exact<{
  id: string | number;
  input: CategoryInput;
}>;


export type UpdateCategoryMutation = { updateCategory: { id: string, name: string, slug: string, count: number | null, status: string | null, sort: number | null, image: string | null, products: Array<{ id: string } | null> | null } };

export type DeleteCategoryMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteCategoryMutation = { deleteCategory: boolean };

export type UpdateOrderStatusMutationVariables = Exact<{
  id: string | number;
  status: string;
}>;


export type UpdateOrderStatusMutation = { updateOrderStatus: { id: string, status: string } };

export type CreateRefundRequestMutationVariables = Exact<{
  input: RefundRequestInput;
}>;


export type CreateRefundRequestMutation = { createRefundRequest: { id: string, orderId: string, reason: string, status: string } };

export type UpdateRefundRequestStatusMutationVariables = Exact<{
  id: string | number;
  status: string;
  adminNotes?: string | null | undefined;
}>;


export type UpdateRefundRequestStatusMutation = { updateRefundRequestStatus: { id: string, status: string, adminNotes: string | null } };

export type ProcessStripeRefundMutationVariables = Exact<{
  id: string | number;
}>;


export type ProcessStripeRefundMutation = { processStripeRefund: { id: string, status: string, stripeRefundId: string | null } };

export type GetProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsQuery = { products: Array<{ id: string, title: string, slug: string, author: string | null, description: string | null, price: number, originalPrice: number | null, stock: number | null, coverImage: string | null, categoryId: string | null, categorySlug: string | null, categoryName: string | null, isbn: string | null, pages: number | null, language: string | null, format: string | null, ribbon: string | null, publisher: string | null }> };

export type GetProductBySlugQueryVariables = Exact<{
  slug: string;
}>;


export type GetProductBySlugQuery = { productBySlug: { id: string, title: string, slug: string, author: string | null, description: string | null, price: number, originalPrice: number | null, stock: number | null, coverImage: string | null, images: Array<string | null> | null, categoryId: string | null, categorySlug: string | null, categoryName: string | null, isbn: string | null, pages: number | null, language: string | null, format: string | null, ribbon: string | null, publisher: string | null } | null };

export type GetBundlesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBundlesQuery = { bundles: Array<{ id: string, title: string, slug: string, description: string | null, price: number, originalPrice: number | null, coverImage: string | null, isFeatured: boolean | null, books: Array<{ id: string, title: string, slug: string, coverImage: string | null, isbn: string | null, publisher: string | null, author: string | null, language: string | null, description: string | null } | null> | null }> };

export type GetBundleBySlugQueryVariables = Exact<{
  slug: string;
}>;


export type GetBundleBySlugQuery = { bundleBySlug: { id: string, title: string, slug: string, description: string | null, price: number, originalPrice: number | null, coverImage: string | null, isFeatured: boolean | null, books: Array<{ id: string, title: string, slug: string, author: string | null, price: number, coverImage: string | null } | null> | null } | null };

export type CheckoutMutationVariables = Exact<{
  input: CheckoutInput;
}>;


export type CheckoutMutation = { checkout: { id: string, status: string, total: number } };

export type GetOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrdersQuery = { orders: Array<{ id: string, email: string, status: string, total: number, shippingCost: number | null, taxAmount: number | null, couponCode: string | null, discountAmount: number | null, shippingMethod: string | null, paymentMethod: string | null, isPaid: boolean | null, stripeTransactionId: string | null, invoiceUrl: string | null, invoiceNumber: string | null, createdAt: string | null, items: Array<{ productId: string | null, bundleId: string | null, title: string, price: number, quantity: number, product: { isbn: string | null } | null, bundle: { books: Array<{ title: string, isbn: string | null } | null> | null } | null }>, shippingAddress: { firstName: string, lastName: string, addressLine1: string, addressLine2: string | null, city: string, state: string, postalCode: string, country: string, phone: string | null } | null }> };

export type GetHeroBannersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHeroBannersQuery = { heroBanners: Array<{ id: string, title: string, subtitle: string | null, ctaLabel: string | null, ctaHref: string | null, sortOrder: number | null, enabled: boolean | null, image: string | null, createdAt: string | null }> };

export type GetPopupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPopupsQuery = { popups: Array<{ id: string, title: string, description: string | null, image: string | null, ctaLabel: string | null, ctaHref: string | null, delaySeconds: number | null, enabled: boolean | null, createdAt: string | null }> };

export type GetHomepageSectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHomepageSectionsQuery = { homepageSections: Array<{ id: string, key: string, title: string, subtitle: string | null, categorySlug: string, limit: number | null, badge: string | null, sortOrder: number | null, enabled: boolean | null, createdAt: string | null }> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { users: Array<{ id: string, name: string | null, email: string, role: string | null, phone: string | null, city: string | null, region: string | null, createdAt: string | null }> };

export type GetShippingConfigsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetShippingConfigsQuery = { shippingConfigs: Array<{ id: string, name: string, countries: Array<string>, standardFee: number, expressFee: number, isExpressEnabled: boolean | null, freeThreshold: number, deliveryTime: string, expressDeliveryTime: string | null, status: string | null }> };

export type GetTaxConfigsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTaxConfigsQuery = { taxConfigs: Array<{ id: string, name: string, rate: number, region: string, type: string, appliedToShipping: boolean | null, status: string | null }> };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { categories: Array<{ id: string, name: string, slug: string, count: number | null, status: string | null, sort: number | null, image: string | null, createdAt: string | null, updatedAt: string | null, products: Array<{ id: string, title: string, coverImage: string | null } | null> | null }> };

export type GetOrderByIdQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderByIdQuery = { orderById: { id: string, email: string, status: string, total: number, shippingCost: number | null, taxAmount: number | null, couponCode: string | null, discountAmount: number | null, shippingMethod: string | null, paymentMethod: string | null, isPaid: boolean | null, stripeTransactionId: string | null, invoiceUrl: string | null, invoiceNumber: string | null, createdAt: string | null, items: Array<{ productId: string | null, bundleId: string | null, title: string, price: number, quantity: number, product: { isbn: string | null } | null, bundle: { books: Array<{ title: string, isbn: string | null } | null> | null } | null }>, shippingAddress: { firstName: string, lastName: string, addressLine1: string, addressLine2: string | null, city: string, state: string, postalCode: string, country: string, phone: string | null } | null } | null };

export type GetCouponsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCouponsQuery = { coupons: Array<{ id: string, code: string, discountType: string, discountAmount: number, minPurchase: number | null, maxUses: number | null, usedCount: number | null, expiryDate: string | null, status: string | null }> };

export type GetCouponQueryVariables = Exact<{
  id: string | number;
}>;


export type GetCouponQuery = { coupon: { id: string, code: string, discountType: string, discountAmount: number, minPurchase: number | null, maxUses: number | null, usedCount: number | null, expiryDate: string | null, status: string | null } | null };

export type ValidateCouponQueryVariables = Exact<{
  code: string;
  cartTotal: number;
}>;


export type ValidateCouponQuery = { validateCoupon: { id: string, code: string, discountType: string, discountAmount: number, minPurchase: number | null } | null };

export type CreateCouponMutationVariables = Exact<{
  input: CouponInput;
}>;


export type CreateCouponMutation = { createCoupon: { id: string, code: string } };

export type UpdateCouponMutationVariables = Exact<{
  id: string | number;
  input: CouponInput;
}>;


export type UpdateCouponMutation = { updateCoupon: { id: string, code: string } };

export type DeleteCouponMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteCouponMutation = { deleteCoupon: boolean };

export type GetRefundRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRefundRequestsQuery = { refundRequests: Array<{ id: string, orderId: string, userId: string | null, reason: string, status: string, adminNotes: string | null, stripeRefundId: string | null, createdAt: string | null, updatedAt: string | null, order: { id: string, email: string, total: number, paymentMethod: string | null, status: string } | null }> };

export type GetRefundRequestQueryVariables = Exact<{
  id: string | number;
}>;


export type GetRefundRequestQuery = { refundRequest: { id: string, orderId: string, userId: string | null, reason: string, status: string, adminNotes: string | null, stripeRefundId: string | null, createdAt: string | null, updatedAt: string | null, order: { id: string, email: string, total: number, paymentMethod: string | null, status: string, items: Array<{ title: string, price: number, quantity: number }> } | null } | null };



export const CreateProductDocument = new TypedDocumentString(`
    mutation CreateProduct($input: ProductInput!) {
  createProduct(input: $input) {
    id
    title
    slug
    price
    stock
    ribbon
    publisher
    description
    language
  }
}
    `);

export const useCreateProductMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateProductMutation, TError, CreateProductMutationVariables, TContext>) => {
    
    return useMutation<CreateProductMutation, TError, CreateProductMutationVariables, TContext>(
      {
    mutationKey: ['CreateProduct'],
    mutationFn: (variables?: CreateProductMutationVariables) => customFetcher<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, variables)(),
    ...options
  }
    )};

export const UpdateProductDocument = new TypedDocumentString(`
    mutation UpdateProduct($id: ID!, $input: ProductInput!) {
  updateProduct(id: $id, input: $input) {
    id
    title
    slug
    price
    stock
    ribbon
    publisher
    description
    language
  }
}
    `);

export const useUpdateProductMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateProductMutation, TError, UpdateProductMutationVariables, TContext>) => {
    
    return useMutation<UpdateProductMutation, TError, UpdateProductMutationVariables, TContext>(
      {
    mutationKey: ['UpdateProduct'],
    mutationFn: (variables?: UpdateProductMutationVariables) => customFetcher<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, variables)(),
    ...options
  }
    )};

export const DeleteProductDocument = new TypedDocumentString(`
    mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id)
}
    `);

export const useDeleteProductMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteProductMutation, TError, DeleteProductMutationVariables, TContext>) => {
    
    return useMutation<DeleteProductMutation, TError, DeleteProductMutationVariables, TContext>(
      {
    mutationKey: ['DeleteProduct'],
    mutationFn: (variables?: DeleteProductMutationVariables) => customFetcher<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, variables)(),
    ...options
  }
    )};

export const CreateBundleDocument = new TypedDocumentString(`
    mutation CreateBundle($input: BundleInput!) {
  createBundle(input: $input) {
    id
    title
    slug
    price
  }
}
    `);

export const useCreateBundleMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateBundleMutation, TError, CreateBundleMutationVariables, TContext>) => {
    
    return useMutation<CreateBundleMutation, TError, CreateBundleMutationVariables, TContext>(
      {
    mutationKey: ['CreateBundle'],
    mutationFn: (variables?: CreateBundleMutationVariables) => customFetcher<CreateBundleMutation, CreateBundleMutationVariables>(CreateBundleDocument, variables)(),
    ...options
  }
    )};

export const UpdateBundleDocument = new TypedDocumentString(`
    mutation UpdateBundle($id: ID!, $input: BundleInput!) {
  updateBundle(id: $id, input: $input) {
    id
    title
    slug
    price
  }
}
    `);

export const useUpdateBundleMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateBundleMutation, TError, UpdateBundleMutationVariables, TContext>) => {
    
    return useMutation<UpdateBundleMutation, TError, UpdateBundleMutationVariables, TContext>(
      {
    mutationKey: ['UpdateBundle'],
    mutationFn: (variables?: UpdateBundleMutationVariables) => customFetcher<UpdateBundleMutation, UpdateBundleMutationVariables>(UpdateBundleDocument, variables)(),
    ...options
  }
    )};

export const DeleteBundleDocument = new TypedDocumentString(`
    mutation DeleteBundle($id: ID!) {
  deleteBundle(id: $id)
}
    `);

export const useDeleteBundleMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteBundleMutation, TError, DeleteBundleMutationVariables, TContext>) => {
    
    return useMutation<DeleteBundleMutation, TError, DeleteBundleMutationVariables, TContext>(
      {
    mutationKey: ['DeleteBundle'],
    mutationFn: (variables?: DeleteBundleMutationVariables) => customFetcher<DeleteBundleMutation, DeleteBundleMutationVariables>(DeleteBundleDocument, variables)(),
    ...options
  }
    )};

export const CreateHeroBannerDocument = new TypedDocumentString(`
    mutation CreateHeroBanner($input: HeroBannerInput!) {
  createHeroBanner(input: $input) {
    id
    title
    subtitle
    ctaLabel
    ctaHref
    sortOrder
    enabled
  }
}
    `);

export const useCreateHeroBannerMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateHeroBannerMutation, TError, CreateHeroBannerMutationVariables, TContext>) => {
    
    return useMutation<CreateHeroBannerMutation, TError, CreateHeroBannerMutationVariables, TContext>(
      {
    mutationKey: ['CreateHeroBanner'],
    mutationFn: (variables?: CreateHeroBannerMutationVariables) => customFetcher<CreateHeroBannerMutation, CreateHeroBannerMutationVariables>(CreateHeroBannerDocument, variables)(),
    ...options
  }
    )};

export const DeleteHeroBannerDocument = new TypedDocumentString(`
    mutation DeleteHeroBanner($id: ID!) {
  deleteHeroBanner(id: $id)
}
    `);

export const useDeleteHeroBannerMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteHeroBannerMutation, TError, DeleteHeroBannerMutationVariables, TContext>) => {
    
    return useMutation<DeleteHeroBannerMutation, TError, DeleteHeroBannerMutationVariables, TContext>(
      {
    mutationKey: ['DeleteHeroBanner'],
    mutationFn: (variables?: DeleteHeroBannerMutationVariables) => customFetcher<DeleteHeroBannerMutation, DeleteHeroBannerMutationVariables>(DeleteHeroBannerDocument, variables)(),
    ...options
  }
    )};

export const UpdateHeroBannerDocument = new TypedDocumentString(`
    mutation UpdateHeroBanner($id: ID!, $input: HeroBannerInput!) {
  updateHeroBanner(id: $id, input: $input) {
    id
    title
    subtitle
    ctaLabel
    ctaHref
    sortOrder
    enabled
    image
  }
}
    `);

export const useUpdateHeroBannerMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateHeroBannerMutation, TError, UpdateHeroBannerMutationVariables, TContext>) => {
    
    return useMutation<UpdateHeroBannerMutation, TError, UpdateHeroBannerMutationVariables, TContext>(
      {
    mutationKey: ['UpdateHeroBanner'],
    mutationFn: (variables?: UpdateHeroBannerMutationVariables) => customFetcher<UpdateHeroBannerMutation, UpdateHeroBannerMutationVariables>(UpdateHeroBannerDocument, variables)(),
    ...options
  }
    )};

export const CreatePopupDocument = new TypedDocumentString(`
    mutation CreatePopup($input: PopupInput!) {
  createPopup(input: $input) {
    id
    title
    description
    image
    ctaLabel
    ctaHref
    delaySeconds
    enabled
  }
}
    `);

export const useCreatePopupMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePopupMutation, TError, CreatePopupMutationVariables, TContext>) => {
    
    return useMutation<CreatePopupMutation, TError, CreatePopupMutationVariables, TContext>(
      {
    mutationKey: ['CreatePopup'],
    mutationFn: (variables?: CreatePopupMutationVariables) => customFetcher<CreatePopupMutation, CreatePopupMutationVariables>(CreatePopupDocument, variables)(),
    ...options
  }
    )};

export const UpdatePopupDocument = new TypedDocumentString(`
    mutation UpdatePopup($id: ID!, $input: PopupInput!) {
  updatePopup(id: $id, input: $input) {
    id
    title
    description
    image
    ctaLabel
    ctaHref
    delaySeconds
    enabled
  }
}
    `);

export const useUpdatePopupMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdatePopupMutation, TError, UpdatePopupMutationVariables, TContext>) => {
    
    return useMutation<UpdatePopupMutation, TError, UpdatePopupMutationVariables, TContext>(
      {
    mutationKey: ['UpdatePopup'],
    mutationFn: (variables?: UpdatePopupMutationVariables) => customFetcher<UpdatePopupMutation, UpdatePopupMutationVariables>(UpdatePopupDocument, variables)(),
    ...options
  }
    )};

export const DeletePopupDocument = new TypedDocumentString(`
    mutation DeletePopup($id: ID!) {
  deletePopup(id: $id)
}
    `);

export const useDeletePopupMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeletePopupMutation, TError, DeletePopupMutationVariables, TContext>) => {
    
    return useMutation<DeletePopupMutation, TError, DeletePopupMutationVariables, TContext>(
      {
    mutationKey: ['DeletePopup'],
    mutationFn: (variables?: DeletePopupMutationVariables) => customFetcher<DeletePopupMutation, DeletePopupMutationVariables>(DeletePopupDocument, variables)(),
    ...options
  }
    )};

export const CreateHomepageSectionDocument = new TypedDocumentString(`
    mutation CreateHomepageSection($input: HomepageSectionInput!) {
  createHomepageSection(input: $input) {
    id
    key
    title
    subtitle
    categorySlug
    limit
    badge
    sortOrder
    enabled
  }
}
    `);

export const useCreateHomepageSectionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateHomepageSectionMutation, TError, CreateHomepageSectionMutationVariables, TContext>) => {
    
    return useMutation<CreateHomepageSectionMutation, TError, CreateHomepageSectionMutationVariables, TContext>(
      {
    mutationKey: ['CreateHomepageSection'],
    mutationFn: (variables?: CreateHomepageSectionMutationVariables) => customFetcher<CreateHomepageSectionMutation, CreateHomepageSectionMutationVariables>(CreateHomepageSectionDocument, variables)(),
    ...options
  }
    )};

export const DeleteHomepageSectionDocument = new TypedDocumentString(`
    mutation DeleteHomepageSection($id: ID!) {
  deleteHomepageSection(id: $id)
}
    `);

export const useDeleteHomepageSectionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteHomepageSectionMutation, TError, DeleteHomepageSectionMutationVariables, TContext>) => {
    
    return useMutation<DeleteHomepageSectionMutation, TError, DeleteHomepageSectionMutationVariables, TContext>(
      {
    mutationKey: ['DeleteHomepageSection'],
    mutationFn: (variables?: DeleteHomepageSectionMutationVariables) => customFetcher<DeleteHomepageSectionMutation, DeleteHomepageSectionMutationVariables>(DeleteHomepageSectionDocument, variables)(),
    ...options
  }
    )};

export const CreateShippingConfigDocument = new TypedDocumentString(`
    mutation CreateShippingConfig($input: ShippingConfigInput!) {
  createShippingConfig(input: $input) {
    id
    name
    countries
    standardFee
    expressFee
    freeThreshold
    deliveryTime
    status
  }
}
    `);

export const useCreateShippingConfigMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateShippingConfigMutation, TError, CreateShippingConfigMutationVariables, TContext>) => {
    
    return useMutation<CreateShippingConfigMutation, TError, CreateShippingConfigMutationVariables, TContext>(
      {
    mutationKey: ['CreateShippingConfig'],
    mutationFn: (variables?: CreateShippingConfigMutationVariables) => customFetcher<CreateShippingConfigMutation, CreateShippingConfigMutationVariables>(CreateShippingConfigDocument, variables)(),
    ...options
  }
    )};

export const DeleteShippingConfigDocument = new TypedDocumentString(`
    mutation DeleteShippingConfig($id: ID!) {
  deleteShippingConfig(id: $id)
}
    `);

export const useDeleteShippingConfigMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteShippingConfigMutation, TError, DeleteShippingConfigMutationVariables, TContext>) => {
    
    return useMutation<DeleteShippingConfigMutation, TError, DeleteShippingConfigMutationVariables, TContext>(
      {
    mutationKey: ['DeleteShippingConfig'],
    mutationFn: (variables?: DeleteShippingConfigMutationVariables) => customFetcher<DeleteShippingConfigMutation, DeleteShippingConfigMutationVariables>(DeleteShippingConfigDocument, variables)(),
    ...options
  }
    )};

export const UpdateShippingConfigDocument = new TypedDocumentString(`
    mutation UpdateShippingConfig($id: ID!, $input: ShippingConfigInput!) {
  updateShippingConfig(id: $id, input: $input) {
    id
    name
    countries
    standardFee
    expressFee
    freeThreshold
    deliveryTime
    status
  }
}
    `);

export const useUpdateShippingConfigMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateShippingConfigMutation, TError, UpdateShippingConfigMutationVariables, TContext>) => {
    
    return useMutation<UpdateShippingConfigMutation, TError, UpdateShippingConfigMutationVariables, TContext>(
      {
    mutationKey: ['UpdateShippingConfig'],
    mutationFn: (variables?: UpdateShippingConfigMutationVariables) => customFetcher<UpdateShippingConfigMutation, UpdateShippingConfigMutationVariables>(UpdateShippingConfigDocument, variables)(),
    ...options
  }
    )};

export const CreateTaxConfigDocument = new TypedDocumentString(`
    mutation CreateTaxConfig($input: TaxConfigInput!) {
  createTaxConfig(input: $input) {
    id
    name
    rate
    region
    type
    appliedToShipping
    status
  }
}
    `);

export const useCreateTaxConfigMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateTaxConfigMutation, TError, CreateTaxConfigMutationVariables, TContext>) => {
    
    return useMutation<CreateTaxConfigMutation, TError, CreateTaxConfigMutationVariables, TContext>(
      {
    mutationKey: ['CreateTaxConfig'],
    mutationFn: (variables?: CreateTaxConfigMutationVariables) => customFetcher<CreateTaxConfigMutation, CreateTaxConfigMutationVariables>(CreateTaxConfigDocument, variables)(),
    ...options
  }
    )};

export const DeleteTaxConfigDocument = new TypedDocumentString(`
    mutation DeleteTaxConfig($id: ID!) {
  deleteTaxConfig(id: $id)
}
    `);

export const useDeleteTaxConfigMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteTaxConfigMutation, TError, DeleteTaxConfigMutationVariables, TContext>) => {
    
    return useMutation<DeleteTaxConfigMutation, TError, DeleteTaxConfigMutationVariables, TContext>(
      {
    mutationKey: ['DeleteTaxConfig'],
    mutationFn: (variables?: DeleteTaxConfigMutationVariables) => customFetcher<DeleteTaxConfigMutation, DeleteTaxConfigMutationVariables>(DeleteTaxConfigDocument, variables)(),
    ...options
  }
    )};

export const UpdateTaxConfigDocument = new TypedDocumentString(`
    mutation UpdateTaxConfig($id: ID!, $input: TaxConfigInput!) {
  updateTaxConfig(id: $id, input: $input) {
    id
    name
    rate
    region
    type
    appliedToShipping
    status
  }
}
    `);

export const useUpdateTaxConfigMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateTaxConfigMutation, TError, UpdateTaxConfigMutationVariables, TContext>) => {
    
    return useMutation<UpdateTaxConfigMutation, TError, UpdateTaxConfigMutationVariables, TContext>(
      {
    mutationKey: ['UpdateTaxConfig'],
    mutationFn: (variables?: UpdateTaxConfigMutationVariables) => customFetcher<UpdateTaxConfigMutation, UpdateTaxConfigMutationVariables>(UpdateTaxConfigDocument, variables)(),
    ...options
  }
    )};

export const CreateCategoryDocument = new TypedDocumentString(`
    mutation CreateCategory($input: CategoryInput!) {
  createCategory(input: $input) {
    id
    name
    slug
    count
    status
    sort
    image
    products {
      id
    }
  }
}
    `);

export const useCreateCategoryMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateCategoryMutation, TError, CreateCategoryMutationVariables, TContext>) => {
    
    return useMutation<CreateCategoryMutation, TError, CreateCategoryMutationVariables, TContext>(
      {
    mutationKey: ['CreateCategory'],
    mutationFn: (variables?: CreateCategoryMutationVariables) => customFetcher<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, variables)(),
    ...options
  }
    )};

export const UpdateCategoryDocument = new TypedDocumentString(`
    mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
  updateCategory(id: $id, input: $input) {
    id
    name
    slug
    count
    status
    sort
    image
    products {
      id
    }
  }
}
    `);

export const useUpdateCategoryMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCategoryMutation, TError, UpdateCategoryMutationVariables, TContext>) => {
    
    return useMutation<UpdateCategoryMutation, TError, UpdateCategoryMutationVariables, TContext>(
      {
    mutationKey: ['UpdateCategory'],
    mutationFn: (variables?: UpdateCategoryMutationVariables) => customFetcher<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, variables)(),
    ...options
  }
    )};

export const DeleteCategoryDocument = new TypedDocumentString(`
    mutation DeleteCategory($id: ID!) {
  deleteCategory(id: $id)
}
    `);

export const useDeleteCategoryMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteCategoryMutation, TError, DeleteCategoryMutationVariables, TContext>) => {
    
    return useMutation<DeleteCategoryMutation, TError, DeleteCategoryMutationVariables, TContext>(
      {
    mutationKey: ['DeleteCategory'],
    mutationFn: (variables?: DeleteCategoryMutationVariables) => customFetcher<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, variables)(),
    ...options
  }
    )};

export const UpdateOrderStatusDocument = new TypedDocumentString(`
    mutation UpdateOrderStatus($id: ID!, $status: String!) {
  updateOrderStatus(id: $id, status: $status) {
    id
    status
  }
}
    `);

export const useUpdateOrderStatusMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateOrderStatusMutation, TError, UpdateOrderStatusMutationVariables, TContext>) => {
    
    return useMutation<UpdateOrderStatusMutation, TError, UpdateOrderStatusMutationVariables, TContext>(
      {
    mutationKey: ['UpdateOrderStatus'],
    mutationFn: (variables?: UpdateOrderStatusMutationVariables) => customFetcher<UpdateOrderStatusMutation, UpdateOrderStatusMutationVariables>(UpdateOrderStatusDocument, variables)(),
    ...options
  }
    )};

export const CreateRefundRequestDocument = new TypedDocumentString(`
    mutation CreateRefundRequest($input: RefundRequestInput!) {
  createRefundRequest(input: $input) {
    id
    orderId
    reason
    status
  }
}
    `);

export const useCreateRefundRequestMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateRefundRequestMutation, TError, CreateRefundRequestMutationVariables, TContext>) => {
    
    return useMutation<CreateRefundRequestMutation, TError, CreateRefundRequestMutationVariables, TContext>(
      {
    mutationKey: ['CreateRefundRequest'],
    mutationFn: (variables?: CreateRefundRequestMutationVariables) => customFetcher<CreateRefundRequestMutation, CreateRefundRequestMutationVariables>(CreateRefundRequestDocument, variables)(),
    ...options
  }
    )};

export const UpdateRefundRequestStatusDocument = new TypedDocumentString(`
    mutation UpdateRefundRequestStatus($id: ID!, $status: String!, $adminNotes: String) {
  updateRefundRequestStatus(id: $id, status: $status, adminNotes: $adminNotes) {
    id
    status
    adminNotes
  }
}
    `);

export const useUpdateRefundRequestStatusMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateRefundRequestStatusMutation, TError, UpdateRefundRequestStatusMutationVariables, TContext>) => {
    
    return useMutation<UpdateRefundRequestStatusMutation, TError, UpdateRefundRequestStatusMutationVariables, TContext>(
      {
    mutationKey: ['UpdateRefundRequestStatus'],
    mutationFn: (variables?: UpdateRefundRequestStatusMutationVariables) => customFetcher<UpdateRefundRequestStatusMutation, UpdateRefundRequestStatusMutationVariables>(UpdateRefundRequestStatusDocument, variables)(),
    ...options
  }
    )};

export const ProcessStripeRefundDocument = new TypedDocumentString(`
    mutation ProcessStripeRefund($id: ID!) {
  processStripeRefund(id: $id) {
    id
    status
    stripeRefundId
  }
}
    `);

export const useProcessStripeRefundMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ProcessStripeRefundMutation, TError, ProcessStripeRefundMutationVariables, TContext>) => {
    
    return useMutation<ProcessStripeRefundMutation, TError, ProcessStripeRefundMutationVariables, TContext>(
      {
    mutationKey: ['ProcessStripeRefund'],
    mutationFn: (variables?: ProcessStripeRefundMutationVariables) => customFetcher<ProcessStripeRefundMutation, ProcessStripeRefundMutationVariables>(ProcessStripeRefundDocument, variables)(),
    ...options
  }
    )};

export const GetProductsDocument = new TypedDocumentString(`
    query GetProducts {
  products {
    id
    title
    slug
    author
    description
    price
    originalPrice
    stock
    coverImage
    categoryId
    categorySlug
    categoryName
    isbn
    pages
    language
    format
    ribbon
    publisher
  }
}
    `);

export const useGetProductsQuery = <
      TData = GetProductsQuery,
      TError = unknown
    >(
      variables?: GetProductsQueryVariables,
      options?: Omit<UseQueryOptions<GetProductsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetProductsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetProductsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetProducts'] : ['GetProducts', variables],
    queryFn: customFetcher<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, variables),
    ...options
  }
    )};

export const GetProductBySlugDocument = new TypedDocumentString(`
    query GetProductBySlug($slug: String!) {
  productBySlug(slug: $slug) {
    id
    title
    slug
    author
    description
    price
    originalPrice
    stock
    coverImage
    images
    categoryId
    categorySlug
    categoryName
    isbn
    pages
    language
    format
    ribbon
    publisher
  }
}
    `);

export const useGetProductBySlugQuery = <
      TData = GetProductBySlugQuery,
      TError = unknown
    >(
      variables: GetProductBySlugQueryVariables,
      options?: Omit<UseQueryOptions<GetProductBySlugQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetProductBySlugQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetProductBySlugQuery, TError, TData>(
      {
    queryKey: ['GetProductBySlug', variables],
    queryFn: customFetcher<GetProductBySlugQuery, GetProductBySlugQueryVariables>(GetProductBySlugDocument, variables),
    ...options
  }
    )};

export const GetBundlesDocument = new TypedDocumentString(`
    query GetBundles {
  bundles {
    id
    title
    slug
    description
    price
    originalPrice
    coverImage
    isFeatured
    books {
      id
      title
      slug
      coverImage
      isbn
      publisher
      author
      language
      description
    }
  }
}
    `);

export const useGetBundlesQuery = <
      TData = GetBundlesQuery,
      TError = unknown
    >(
      variables?: GetBundlesQueryVariables,
      options?: Omit<UseQueryOptions<GetBundlesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetBundlesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetBundlesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetBundles'] : ['GetBundles', variables],
    queryFn: customFetcher<GetBundlesQuery, GetBundlesQueryVariables>(GetBundlesDocument, variables),
    ...options
  }
    )};

export const GetBundleBySlugDocument = new TypedDocumentString(`
    query GetBundleBySlug($slug: String!) {
  bundleBySlug(slug: $slug) {
    id
    title
    slug
    description
    price
    originalPrice
    coverImage
    isFeatured
    books {
      id
      title
      slug
      author
      price
      coverImage
    }
  }
}
    `);

export const useGetBundleBySlugQuery = <
      TData = GetBundleBySlugQuery,
      TError = unknown
    >(
      variables: GetBundleBySlugQueryVariables,
      options?: Omit<UseQueryOptions<GetBundleBySlugQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetBundleBySlugQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetBundleBySlugQuery, TError, TData>(
      {
    queryKey: ['GetBundleBySlug', variables],
    queryFn: customFetcher<GetBundleBySlugQuery, GetBundleBySlugQueryVariables>(GetBundleBySlugDocument, variables),
    ...options
  }
    )};

export const CheckoutDocument = new TypedDocumentString(`
    mutation Checkout($input: CheckoutInput!) {
  checkout(input: $input) {
    id
    status
    total
  }
}
    `);

export const useCheckoutMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CheckoutMutation, TError, CheckoutMutationVariables, TContext>) => {
    
    return useMutation<CheckoutMutation, TError, CheckoutMutationVariables, TContext>(
      {
    mutationKey: ['Checkout'],
    mutationFn: (variables?: CheckoutMutationVariables) => customFetcher<CheckoutMutation, CheckoutMutationVariables>(CheckoutDocument, variables)(),
    ...options
  }
    )};

export const GetOrdersDocument = new TypedDocumentString(`
    query GetOrders {
  orders {
    id
    email
    status
    total
    shippingCost
    taxAmount
    couponCode
    discountAmount
    shippingMethod
    items {
      productId
      bundleId
      title
      price
      quantity
      product {
        isbn
      }
      bundle {
        books {
          title
          isbn
        }
      }
    }
    shippingAddress {
      firstName
      lastName
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
      phone
    }
    paymentMethod
    isPaid
    stripeTransactionId
    invoiceUrl
    invoiceNumber
    createdAt
  }
}
    `);

export const useGetOrdersQuery = <
      TData = GetOrdersQuery,
      TError = unknown
    >(
      variables?: GetOrdersQueryVariables,
      options?: Omit<UseQueryOptions<GetOrdersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetOrdersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetOrdersQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetOrders'] : ['GetOrders', variables],
    queryFn: customFetcher<GetOrdersQuery, GetOrdersQueryVariables>(GetOrdersDocument, variables),
    ...options
  }
    )};

export const GetHeroBannersDocument = new TypedDocumentString(`
    query GetHeroBanners {
  heroBanners {
    id
    title
    subtitle
    ctaLabel
    ctaHref
    sortOrder
    enabled
    image
    createdAt
  }
}
    `);

export const useGetHeroBannersQuery = <
      TData = GetHeroBannersQuery,
      TError = unknown
    >(
      variables?: GetHeroBannersQueryVariables,
      options?: Omit<UseQueryOptions<GetHeroBannersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetHeroBannersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetHeroBannersQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetHeroBanners'] : ['GetHeroBanners', variables],
    queryFn: customFetcher<GetHeroBannersQuery, GetHeroBannersQueryVariables>(GetHeroBannersDocument, variables),
    ...options
  }
    )};

export const GetPopupsDocument = new TypedDocumentString(`
    query GetPopups {
  popups {
    id
    title
    description
    image
    ctaLabel
    ctaHref
    delaySeconds
    enabled
    createdAt
  }
}
    `);

export const useGetPopupsQuery = <
      TData = GetPopupsQuery,
      TError = unknown
    >(
      variables?: GetPopupsQueryVariables,
      options?: Omit<UseQueryOptions<GetPopupsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetPopupsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetPopupsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetPopups'] : ['GetPopups', variables],
    queryFn: customFetcher<GetPopupsQuery, GetPopupsQueryVariables>(GetPopupsDocument, variables),
    ...options
  }
    )};

export const GetHomepageSectionsDocument = new TypedDocumentString(`
    query GetHomepageSections {
  homepageSections {
    id
    key
    title
    subtitle
    categorySlug
    limit
    badge
    sortOrder
    enabled
    createdAt
  }
}
    `);

export const useGetHomepageSectionsQuery = <
      TData = GetHomepageSectionsQuery,
      TError = unknown
    >(
      variables?: GetHomepageSectionsQueryVariables,
      options?: Omit<UseQueryOptions<GetHomepageSectionsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetHomepageSectionsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetHomepageSectionsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetHomepageSections'] : ['GetHomepageSections', variables],
    queryFn: customFetcher<GetHomepageSectionsQuery, GetHomepageSectionsQueryVariables>(GetHomepageSectionsDocument, variables),
    ...options
  }
    )};

export const GetUsersDocument = new TypedDocumentString(`
    query GetUsers {
  users {
    id
    name
    email
    role
    phone
    city
    region
    createdAt
  }
}
    `);

export const useGetUsersQuery = <
      TData = GetUsersQuery,
      TError = unknown
    >(
      variables?: GetUsersQueryVariables,
      options?: Omit<UseQueryOptions<GetUsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetUsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetUsersQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetUsers'] : ['GetUsers', variables],
    queryFn: customFetcher<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, variables),
    ...options
  }
    )};

export const GetShippingConfigsDocument = new TypedDocumentString(`
    query GetShippingConfigs {
  shippingConfigs {
    id
    name
    countries
    standardFee
    expressFee
    isExpressEnabled
    freeThreshold
    deliveryTime
    expressDeliveryTime
    status
  }
}
    `);

export const useGetShippingConfigsQuery = <
      TData = GetShippingConfigsQuery,
      TError = unknown
    >(
      variables?: GetShippingConfigsQueryVariables,
      options?: Omit<UseQueryOptions<GetShippingConfigsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetShippingConfigsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetShippingConfigsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetShippingConfigs'] : ['GetShippingConfigs', variables],
    queryFn: customFetcher<GetShippingConfigsQuery, GetShippingConfigsQueryVariables>(GetShippingConfigsDocument, variables),
    ...options
  }
    )};

export const GetTaxConfigsDocument = new TypedDocumentString(`
    query GetTaxConfigs {
  taxConfigs {
    id
    name
    rate
    region
    type
    appliedToShipping
    status
  }
}
    `);

export const useGetTaxConfigsQuery = <
      TData = GetTaxConfigsQuery,
      TError = unknown
    >(
      variables?: GetTaxConfigsQueryVariables,
      options?: Omit<UseQueryOptions<GetTaxConfigsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetTaxConfigsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetTaxConfigsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetTaxConfigs'] : ['GetTaxConfigs', variables],
    queryFn: customFetcher<GetTaxConfigsQuery, GetTaxConfigsQueryVariables>(GetTaxConfigsDocument, variables),
    ...options
  }
    )};

export const GetCategoriesDocument = new TypedDocumentString(`
    query GetCategories {
  categories {
    id
    name
    slug
    count
    status
    sort
    image
    products {
      id
      title
      coverImage
    }
    createdAt
    updatedAt
  }
}
    `);

export const useGetCategoriesQuery = <
      TData = GetCategoriesQuery,
      TError = unknown
    >(
      variables?: GetCategoriesQueryVariables,
      options?: Omit<UseQueryOptions<GetCategoriesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetCategoriesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetCategoriesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetCategories'] : ['GetCategories', variables],
    queryFn: customFetcher<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, variables),
    ...options
  }
    )};

export const GetOrderByIdDocument = new TypedDocumentString(`
    query GetOrderById($id: ID!) {
  orderById(id: $id) {
    id
    email
    status
    total
    shippingCost
    taxAmount
    couponCode
    discountAmount
    shippingMethod
    items {
      productId
      bundleId
      title
      price
      quantity
      product {
        isbn
      }
      bundle {
        books {
          title
          isbn
        }
      }
    }
    shippingAddress {
      firstName
      lastName
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
      phone
    }
    paymentMethod
    isPaid
    stripeTransactionId
    invoiceUrl
    invoiceNumber
    createdAt
  }
}
    `);

export const useGetOrderByIdQuery = <
      TData = GetOrderByIdQuery,
      TError = unknown
    >(
      variables: GetOrderByIdQueryVariables,
      options?: Omit<UseQueryOptions<GetOrderByIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetOrderByIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetOrderByIdQuery, TError, TData>(
      {
    queryKey: ['GetOrderById', variables],
    queryFn: customFetcher<GetOrderByIdQuery, GetOrderByIdQueryVariables>(GetOrderByIdDocument, variables),
    ...options
  }
    )};

export const GetCouponsDocument = new TypedDocumentString(`
    query GetCoupons {
  coupons {
    id
    code
    discountType
    discountAmount
    minPurchase
    maxUses
    usedCount
    expiryDate
    status
  }
}
    `);

export const useGetCouponsQuery = <
      TData = GetCouponsQuery,
      TError = unknown
    >(
      variables?: GetCouponsQueryVariables,
      options?: Omit<UseQueryOptions<GetCouponsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetCouponsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetCouponsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetCoupons'] : ['GetCoupons', variables],
    queryFn: customFetcher<GetCouponsQuery, GetCouponsQueryVariables>(GetCouponsDocument, variables),
    ...options
  }
    )};

export const GetCouponDocument = new TypedDocumentString(`
    query GetCoupon($id: ID!) {
  coupon(id: $id) {
    id
    code
    discountType
    discountAmount
    minPurchase
    maxUses
    usedCount
    expiryDate
    status
  }
}
    `);

export const useGetCouponQuery = <
      TData = GetCouponQuery,
      TError = unknown
    >(
      variables: GetCouponQueryVariables,
      options?: Omit<UseQueryOptions<GetCouponQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetCouponQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetCouponQuery, TError, TData>(
      {
    queryKey: ['GetCoupon', variables],
    queryFn: customFetcher<GetCouponQuery, GetCouponQueryVariables>(GetCouponDocument, variables),
    ...options
  }
    )};

export const ValidateCouponDocument = new TypedDocumentString(`
    query ValidateCoupon($code: String!, $cartTotal: Float!) {
  validateCoupon(code: $code, cartTotal: $cartTotal) {
    id
    code
    discountType
    discountAmount
    minPurchase
  }
}
    `);

export const useValidateCouponQuery = <
      TData = ValidateCouponQuery,
      TError = unknown
    >(
      variables: ValidateCouponQueryVariables,
      options?: Omit<UseQueryOptions<ValidateCouponQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ValidateCouponQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ValidateCouponQuery, TError, TData>(
      {
    queryKey: ['ValidateCoupon', variables],
    queryFn: customFetcher<ValidateCouponQuery, ValidateCouponQueryVariables>(ValidateCouponDocument, variables),
    ...options
  }
    )};

export const CreateCouponDocument = new TypedDocumentString(`
    mutation CreateCoupon($input: CouponInput!) {
  createCoupon(input: $input) {
    id
    code
  }
}
    `);

export const useCreateCouponMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateCouponMutation, TError, CreateCouponMutationVariables, TContext>) => {
    
    return useMutation<CreateCouponMutation, TError, CreateCouponMutationVariables, TContext>(
      {
    mutationKey: ['CreateCoupon'],
    mutationFn: (variables?: CreateCouponMutationVariables) => customFetcher<CreateCouponMutation, CreateCouponMutationVariables>(CreateCouponDocument, variables)(),
    ...options
  }
    )};

export const UpdateCouponDocument = new TypedDocumentString(`
    mutation UpdateCoupon($id: ID!, $input: CouponInput!) {
  updateCoupon(id: $id, input: $input) {
    id
    code
  }
}
    `);

export const useUpdateCouponMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCouponMutation, TError, UpdateCouponMutationVariables, TContext>) => {
    
    return useMutation<UpdateCouponMutation, TError, UpdateCouponMutationVariables, TContext>(
      {
    mutationKey: ['UpdateCoupon'],
    mutationFn: (variables?: UpdateCouponMutationVariables) => customFetcher<UpdateCouponMutation, UpdateCouponMutationVariables>(UpdateCouponDocument, variables)(),
    ...options
  }
    )};

export const DeleteCouponDocument = new TypedDocumentString(`
    mutation DeleteCoupon($id: ID!) {
  deleteCoupon(id: $id)
}
    `);

export const useDeleteCouponMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteCouponMutation, TError, DeleteCouponMutationVariables, TContext>) => {
    
    return useMutation<DeleteCouponMutation, TError, DeleteCouponMutationVariables, TContext>(
      {
    mutationKey: ['DeleteCoupon'],
    mutationFn: (variables?: DeleteCouponMutationVariables) => customFetcher<DeleteCouponMutation, DeleteCouponMutationVariables>(DeleteCouponDocument, variables)(),
    ...options
  }
    )};

export const GetRefundRequestsDocument = new TypedDocumentString(`
    query GetRefundRequests {
  refundRequests {
    id
    orderId
    userId
    reason
    status
    adminNotes
    stripeRefundId
    createdAt
    updatedAt
    order {
      id
      email
      total
      paymentMethod
      status
    }
  }
}
    `);

export const useGetRefundRequestsQuery = <
      TData = GetRefundRequestsQuery,
      TError = unknown
    >(
      variables?: GetRefundRequestsQueryVariables,
      options?: Omit<UseQueryOptions<GetRefundRequestsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetRefundRequestsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetRefundRequestsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetRefundRequests'] : ['GetRefundRequests', variables],
    queryFn: customFetcher<GetRefundRequestsQuery, GetRefundRequestsQueryVariables>(GetRefundRequestsDocument, variables),
    ...options
  }
    )};

export const GetRefundRequestDocument = new TypedDocumentString(`
    query GetRefundRequest($id: ID!) {
  refundRequest(id: $id) {
    id
    orderId
    userId
    reason
    status
    adminNotes
    stripeRefundId
    createdAt
    updatedAt
    order {
      id
      email
      total
      paymentMethod
      status
      items {
        title
        price
        quantity
      }
    }
  }
}
    `);

export const useGetRefundRequestQuery = <
      TData = GetRefundRequestQuery,
      TError = unknown
    >(
      variables: GetRefundRequestQueryVariables,
      options?: Omit<UseQueryOptions<GetRefundRequestQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetRefundRequestQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetRefundRequestQuery, TError, TData>(
      {
    queryKey: ['GetRefundRequest', variables],
    queryFn: customFetcher<GetRefundRequestQuery, GetRefundRequestQueryVariables>(GetRefundRequestDocument, variables),
    ...options
  }
    )};
