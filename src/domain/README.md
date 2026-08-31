# Domain layer

Pure business types and mappers.

## What belongs here

| Layer | Responsibility | Examples |
|-------|----------------|----------|
| `domain/` | Canonical models, view-models, availability rules, map from adapter types | `Book`, `Bundle`, `ProductDetail`, `BundlePresentation` |
| `lib/` | API clients, raw shapes | `products.ts`, `bundles.ts`, `cart.ts` |
| `features/` | Route-specific UI, copy, layout variants | `product-detail-view`, `bundle-landing` sections |
| `components/` | Reusable UI (design system, commerce primitives) | `PurchasePanel`, `Button` |

## Key Abstractions

- `BundlePresentation`: Unified type for UI rendering, combining catalog product row and nested items.

## Import rules

- `domain` may import from `lib/catalog/types` during migration; target is self-contained `domain/catalog`.
- `lib` may import `domain` mappers.
- `features` and `app` import `domain` and `components`, not deep `lib` except in server pages/loaders.

## File layout

```
domain/
  catalog/       # Book, Bundle, Faq
  product/       # availability, ProductDetail mapping
  bundle/        # BundlePresentation for marketing pages
```
