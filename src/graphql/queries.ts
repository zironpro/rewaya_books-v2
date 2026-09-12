import { gql } from "graphql-tag";

export const GetAdminDashboardStats = gql`
	query GetAdminDashboardStats {
		adminDashboardStats {
			totalSales
			totalOrders
			activeCustomers
			totalBooks
		}
	}
`;

export const GetProductsPaginated = gql`
	query GetProductsPaginated(
		$category: String
		$q: String
		$sort: String
		$page: Int
		$limit: Int
		$customOrderIds: [ID!]
	) {
		productsPaginated(
			category: $category
			q: $q
			sort: $sort
			page: $page
			limit: $limit
			customOrderIds: $customOrderIds
		) {
			items {
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
				categoryIds
				categories {
					id
					name
					slug
				}
				isbn
				pages
				language
				format
				ribbon
				publisher
				createdAt
				updatedAt
				sortOrder
			}
			totalCount
			totalPages
		}
	}
`;

export const GET_PRODUCTS = gql`
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
      images
      categoryId
      categorySlug
      categoryName
      categoryIds
      categories {
        id
        name
        slug
      }
      isbn
      pages
      language
      format
      ribbon
      publisher
      sortOrder
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
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
      categoryIds
      categories {
        id
        name
        slug
      }
      isbn
      pages
      language
      format
      ribbon
      publisher
    }
  }
`;

export const GET_BUNDLES = gql`
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
`;

export const GET_BUNDLE_BY_SLUG = gql`
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
`;

export const CHECKOUT = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      id
      status
      total
    }
  }
`;

export const GET_ORDERS = gql`
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
`;

export const GET_HERO_BANNERS = gql`
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
`;

export const GET_POPUPS = gql`
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
`;

export const GET_HOMEPAGE_SECTIONS = gql`
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
`;

export const GET_USERS = gql`
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
`;

export const GET_SHIPPING_CONFIGS = gql`
  query GetShippingConfigs {
    shippingConfigs {
      id
      name
      countries
      standardFee
      expressFee
      isExpressEnabled
      isFreeDeliveryEnabled
      freeThreshold
      deliveryTime
      expressDeliveryTime
      isCodEnabled
      codFee
      status
    }
  }
`;

export const GET_TAX_CONFIGS = gql`
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
`;

export const GET_CATEGORIES = gql`
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
`;

export const GET_ORDER_BY_ID = gql`
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
`;

export const GET_COUPONS = gql`
  query GetCoupons {
    coupons {
      id
      code
      discountType
      discountAmount
      minPurchase
      isFirstOrder
      maxUses
      usedCount
      expiryDate
      status
    }
  }
`;

export const GET_COUPON = gql`
  query GetCoupon($id: ID!) {
    coupon(id: $id) {
      id
      code
      discountType
      discountAmount
      minPurchase
      isFirstOrder
      maxUses
      usedCount
      expiryDate
      status
    }
  }
`;

export const VALIDATE_COUPON = gql`
  query ValidateCoupon($code: String!, $cartTotal: Float!, $email: String) {
    validateCoupon(code: $code, cartTotal: $cartTotal, email: $email) {
      id
      code
      discountType
      discountAmount
      minPurchase
      isFirstOrder
    }
  }
`;

export const CREATE_COUPON = gql`
  mutation CreateCoupon($input: CouponInput!) {
    createCoupon(input: $input) {
      id
      code
    }
  }
`;

export const UPDATE_COUPON = gql`
  mutation UpdateCoupon($id: ID!, $input: CouponInput!) {
    updateCoupon(id: $id, input: $input) {
      id
      code
    }
  }
`;

export const DELETE_COUPON = gql`
  mutation DeleteCoupon($id: ID!) {
    deleteCoupon(id: $id)
  }
`;

export const GET_REFUND_REQUESTS = gql`
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
`;

export const GET_REFUND_REQUEST = gql`
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
`;
