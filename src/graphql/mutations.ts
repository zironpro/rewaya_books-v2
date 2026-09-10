import { gql } from "graphql-tag";

export const CREATE_PRODUCT = gql`
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
      categoryIds
      categories {
        id
        name
        slug
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
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
      categoryIds
      categories {
        id
        name
        slug
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const UPDATE_PRODUCTS_SORT_ORDER = gql`
  mutation UpdateProductsSortOrder($updates: [ProductSortOrderInput!]!) {
    updateProductsSortOrder(updates: $updates)
  }
`;

export const CREATE_BUNDLE = gql`
  mutation CreateBundle($input: BundleInput!) {
    createBundle(input: $input) {
      id
      title
      slug
      price
    }
  }
`;

export const UPDATE_BUNDLE = gql`
  mutation UpdateBundle($id: ID!, $input: BundleInput!) {
    updateBundle(id: $id, input: $input) {
      id
      title
      slug
      price
    }
  }
`;

export const DELETE_BUNDLE = gql`
  mutation DeleteBundle($id: ID!) {
    deleteBundle(id: $id)
  }
`;

export const CREATE_HERO_BANNER = gql`
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
`;

export const DELETE_HERO_BANNER = gql`
  mutation DeleteHeroBanner($id: ID!) {
    deleteHeroBanner(id: $id)
  }
`;

export const UPDATE_HERO_BANNER = gql`
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
`;

export const CREATE_POPUP = gql`
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
`;

export const UPDATE_POPUP = gql`
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
`;

export const DELETE_POPUP = gql`
  mutation DeletePopup($id: ID!) {
    deletePopup(id: $id)
  }
`;

export const CREATE_HOMEPAGE_SECTION = gql`
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
`;

export const DELETE_HOMEPAGE_SECTION = gql`
  mutation DeleteHomepageSection($id: ID!) {
    deleteHomepageSection(id: $id)
  }
`;

export const CREATE_SHIPPING_CONFIG = gql`
  mutation CreateShippingConfig($input: ShippingConfigInput!) {
    createShippingConfig(input: $input) {
      id
      name
      countries
      standardFee
      expressFee
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

export const DELETE_SHIPPING_CONFIG = gql`
  mutation DeleteShippingConfig($id: ID!) {
    deleteShippingConfig(id: $id)
  }
`;

export const UPDATE_SHIPPING_CONFIG = gql`
  mutation UpdateShippingConfig($id: ID!, $input: ShippingConfigInput!) {
    updateShippingConfig(id: $id, input: $input) {
      id
      name
      countries
      standardFee
      expressFee
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

export const CREATE_TAX_CONFIG = gql`
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
`;

export const DELETE_TAX_CONFIG = gql`
  mutation DeleteTaxConfig($id: ID!) {
    deleteTaxConfig(id: $id)
  }
`;

export const UPDATE_TAX_CONFIG = gql`
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
`;

export const CREATE_CATEGORY = gql`
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
`;

export const UPDATE_CATEGORY = gql`
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
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const CREATE_REFUND_REQUEST = gql`
  mutation CreateRefundRequest($input: RefundRequestInput!) {
    createRefundRequest(input: $input) {
      id
      orderId
      reason
      status
    }
  }
`;

export const UPDATE_REFUND_REQUEST_STATUS = gql`
  mutation UpdateRefundRequestStatus($id: ID!, $status: String!, $adminNotes: String) {
    updateRefundRequestStatus(id: $id, status: $status, adminNotes: $adminNotes) {
      id
      status
      adminNotes
    }
  }
`;

export const PROCESS_STRIPE_REFUND = gql`
  mutation ProcessStripeRefund($id: ID!) {
    processStripeRefund(id: $id) {
      id
      status
      stripeRefundId
    }
  }
`;
