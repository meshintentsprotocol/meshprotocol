# Blaze launch UI demo

This React module provides the Mesh launch ecosystem preview. It uses the existing Mesh theme and logo. Routes are resolved in `LaunchShell.tsx`; `App.tsx` sends `/launch`, `/lock`, `/verify`, and `/tokens/:category` to that shell. Vercel's SPA rewrite serves deep links.

## Pages and flows

| Route | Purpose | Data source |
| --- | --- | --- |
| `/launch` | Launch product entry | Static content |
| `/launch/examples/e1` | BCH-quoted E1 case study | Linked Chipnet transactions |
| `/launch/templates` | Builder template gallery | Reference examples and browser-local templates |
| `/launch/builders` | Config Studio | Browser-local form and template save |
| `/launch/new` → `/launch/new/review` | Creator draft and review | Browser-local draft |
| `/launch/tokens` | Launch directory | Browser-local launches plus separate E1 case study |
| `/launch/:id` | Trade and graduation simulation | Browser-local state |
| `/launch/:id/manage` | Creator fee and position dashboard | Browser-local state |
| `/launch/:id/proof` | Lock policy and verifier explanation | Browser-local policy, no chain proof |
| `/tokens/:category` | Token identity preview | Static E1 facts or unverified input |
| `/verify` | Token verification request preview | Browser-local request only |
| `/lock` | Vesting schedule and claim simulation | Browser-local state |
| `/launch/sales` | Presale and Alpha simulation | Browser-local state |
| `/launch/partner/analytics` | Builder analytics | Browser-local aggregate |
| `/launch/docs` | Planned builder integration | Static architecture guide |

The demo state is contained in `demo/DemoContext.tsx` and persisted under `mesh_blaze_demo_v1` in `localStorage`. Its IDs are intentionally prefixed `launch-`, `template-`, and so on. They are not transaction IDs, token categories, or contract commitments. The E1 case study is read-only and never shares mutable state with the demo.

Reusable presentation components live in `ui/Primitives.tsx`. The page files group creator/builder flows, launch lifecycle views, and supporting tools. No wallet adapter, transaction builder, server API, or live indexer is imported by this module.

## Before enabling real funding

Replace browser-local state with the wallet and launch SDK; bind published configs to canonical bytes, partner signatures, and a versioned launch manifest; independently verify every transaction output before signing; add a category-keyed indexer with reorg and stale-outpoint handling; and pass the separate Chipnet/security gates for token-quoted E2, vesting, presale, and Alpha. Do not reuse the simplified progress model for contract quotes.
