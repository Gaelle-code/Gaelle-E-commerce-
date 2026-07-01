# Gaelle Online Shop — E-Comus Storefront

A fully working e-commerce web client built with **React**, **Tailwind CSS**, **Axios**, and **TanStack Query**, consuming the live [E-Comus API](https://e-commas-apis-production-e0f8.up.railway.app/api-docs/).

## Tech Stack

- React 18 (function components + hooks)
- React Router v6
- TanStack Query v5 (`useQuery` / `useMutation`)
- Axios (centralized instance with interceptors)
- Tailwind CSS (utility-first, no hand-written CSS)
- Vite

## Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd ecommerce

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env — set VITE_ECOMUS_API_BASE_URL if needed (defaults to the live API)
# Optionally set VITE_ECOMUS_USER_ID to a fixed MongoDB ObjectId for a persistent user

# 4. Run dev server
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Architecture

```
src/
├── api/           # Axios client, endpoint paths, query keys, session, utils
├── app/           # QueryClient, providers, router
├── components/    # Shared layout (Header, Footer) and UI primitives (Button, Card, Toast…)
├── features/
│   ├── products/  # Product list, detail, filters — useQuery hooks
│   ├── cart/      # Cart CRUD — useMutation hooks with cache invalidation
│   ├── checkout/  # Place order from cart
│   ├── orders/    # Order history
│   ├── comments/  # Product reviews — create, react, delete
│   └── variants/  # Product variant selection
├── hooks/         # useDebouncedValue
└── pages/         # NotFoundPage
```

## Key Design Decisions

### Axios instance (`src/api/client.js`)
One centralized `axios.create()` with base URL from env, JSON headers, 15 s timeout, and a response interceptor that normalizes errors into `{ message, status, raw }`.

### TanStack Query
- `useQuery` for all reads with descriptive keys: `['products', params]`, `['product', id]`, `['comments', productId]`, etc.
- `useMutation` for all writes (add/update/remove cart item, place order, post comment, react) with `queryClient.invalidateQueries` on success.
- Loading, error, and empty states are surfaced in every page — never swallowed.

### State separation
- **Server state** lives only in the TanStack Query cache (products, cart, orders, comments).
- **UI state** lives in `useState` (search input value, selected variant, form fields, image error flag).
- No server data is copied into `useState`.

### Guest session
A persistent anonymous `userId` (MongoDB ObjectId format) is generated once and stored in `localStorage`. All cart and order calls include it automatically via `getUserId()`.

## Features

- Product listing with search (debounced), category filter, and pagination
- Product detail with variant selector, quantity picker, add-to-cart, and buy-now
- Product reviews — post, like/dislike, delete own comments
- Cart — add, update quantity, remove items, clear cart, running total
- Checkout — place order from cart with delivery details form
- Order history — list all past orders with status badges
- Toast notifications on every action success/failure
- Skeleton loaders, empty states, and error states throughout

## API Notes

- Base URL: `https://e-commas-apis-production-e0f8.up.railway.app`
- All routes are documented at `/api-docs/`
- No authentication required — `userId` is passed in body/query params

## Deployment

Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com):

```bash
npm run build
# dist/ folder is the output
```

Set `VITE_ECOMUS_API_BASE_URL` as an environment variable in your deployment dashboard if needed.

## Screenshots

> Add screenshots of the running app here before submission.

## Live Demo

> Add your deployed URL here.
