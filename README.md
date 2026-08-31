# Rewaya (Al Rewaya Book World)

Frontend for **Al Rewaya Book World** — a curated Islamic bookstore experience built with the Next.js App Router. The site showcases books, bundles, and policy pages with a responsive layout (navbar, footer, mobile bottom navigation).

## Tech stack

- **Next.js** 16 (App Router, `src/app`)
- **React** 19 with the **React Compiler** enabled
- **TypeScript**
- **Tailwind CSS** v4
- **Biome** — lint and format (`lint`, `format` scripts)
- **UI & UX** — shadcn-style components, Radix / Base UI primitives, **Framer Motion**, **Embla** carousels, **Lucide** icons
- **Data & forms** — **TanStack Query**, **TanStack Form**, **Jotai** for client state

Product and bundle listings currently use in-app data modules (for example `src/features/products/data/products.ts`, `src/lib/bundles-data.ts`), not a live backend.

## Scripts

```bash
npm run dev      # development server (Turbopack)
npm run build    # production build
npm run start    # run production server
npm run lint     # Biome check with auto-fix where applicable
npm run format   # Biome format
```

Open [http://localhost:3000](http://localhost:3000) after starting the dev server.

## Project layout (high level)

| Path | Purpose |
| --- | --- |
| `src/app/` | Routes and route groups `(main)`, `(auth)` |
| `src/features/` | Page-level views (home, shop, cart, bundles, auth, legal, etc.) |
| `src/components/` | Shared UI, layout, and composite sections |
| `src/lib/` | Utilities, sample store data |
| `src/styles/` | Global CSS |

## Routes (overview)

- **/** — Homepage
- **/shop**, **/product/[id]** — Catalog and product detail
- **/bundles**, **/bundle/[id]** — Bundle listing and detail
- **/cart** — Cart
- **/about**, **/contact** — Marketing / support
- **/terms**, **/privacy** — Legal
- **/login**, **/signup** — Auth shells

## Images

Remote images are allowed from `images.unsplash.com` (see `next.config.ts` `images.remotePatterns`).

## Contributing / agents

See `AGENTS.md` for workspace notes. This repo tracks a recent Next.js major line; prefer the in-repo docs under `node_modules/next/dist/docs/` when API details differ from older guides.
