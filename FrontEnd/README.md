# FrontEnd

This is the FrontEnd for the Lumina e‑commerce demo (Vite + React + TypeScript).

**Quick Start**

- Install deps:

```bash
cd FrontEnd
npm install
```

- Run dev server:

```bash
npm run dev
```

**Build / Preview**

```bash
npm run build
npm run preview
```

**Environment**

- The frontend expects the backend APIs to be available separately (see `BackEnd`). Configure any runtime endpoints in:
  - [FrontEnd/api/graphqlClient.ts](FrontEnd/api/graphqlClient.ts#L1)
  - [FrontEnd/api/productApi.js](FrontEnd/api/productApi.js#L1)

If you need environment variables for the FrontEnd, add them using Vite env conventions (e.g. `.env.local`) and do NOT commit secrets.

**Project Structure (high level)**

- `App.tsx` / `index.tsx`: application entry
- `pages/`: route pages (Home, Shop, ProductDetails, CartCheckout, UserProfile, etc.)
- `components/`: shared UI and layout (see `Layout.tsx`, `ProtectedRoute.tsx`)
- `api/`: client code for auth, products, tokens
- `lib/` and `util/`: helpers

**Useful files**

- [FrontEnd/package.json](FrontEnd/package.json#L1) — scripts and dependencies
- [FrontEnd/vite.config.ts](FrontEnd/vite.config.ts#L1) — vite config
- [FrontEnd/store.ts](FrontEnd/store.ts#L1) — global state (Zustand)

**Notes**

- Backend must run separately; see the `BackEnd` folder for server setup.
- Do not commit any `.env` files. Use `.env.example` patterns when sharing config.
- If secrets were accidentally committed, rotate them immediately and remove them from git history.

**Contributing**

- Branch from `main` and open PRs for features/fixes. Keep changes small and include brief testing notes.
