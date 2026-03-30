# dosh in trip

`dosh` now lives inside the `trip` monorepo at `apps/dosh`.

## Parts

- `backend/`: Node.js + WebSocket server
- `frontend/`: Vite + React + TypeScript client

## Run

From the repo root:

```bash
npm run dev:dosh:backend
npm run dev:dosh:frontend
```

Frontend runs on `http://localhost:5175`.
Backend runs on `http://localhost:3000`.

## Checks

From the repo root:

```bash
npm run build:dosh
npm run check:dosh
```

## Supported environment

Backend:

- `PORT` default `3000`
- `DOSH_PASSWORD` default `money`
- `DOSH_ADMIN_PASSWORD` default `moneymoney.`
- `CORS_ORIGIN` default `*`
- `DOSH_TOKEN_SECRET` default `dosh-demo-token-secret`
- `DOSH_TOKEN_TTL_MS` default `0`
- `DATABASE_URL` optional

Frontend:

- `VITE_API_BASE_URL` optional

Without `VITE_API_BASE_URL`, the frontend uses `http://localhost:3000` on localhost and otherwise falls back to the existing hosted backend URL baked into the app.
