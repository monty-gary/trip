# trip

Tiny event-scoped apps for trips, weekends, cabins, festivals, and other temporary friend-group logistics.

**Live:** [monty-gary.github.io/trip](https://monty-gary.github.io/trip/)

## Apps

### pack — group packing coordination
Who brings what, what is still missing, and what is already covered. Dense list view with item detail drill-in, localStorage persistence, dynamic people with case-insensitive identity matching.

**Status:** live on GitHub Pages

### dosh — realtime shared expenses
Password-gated expense rooms with WebSocket sync, weighted splits, derived balances, and settle-up suggestions.

**Status:** live (hosted separately on Render)

### poll — group decisions *(planned)*
Fast one-tap group decisions for departure times, dinner, and low-stakes indecision.

### jest — social trip tools *(planned)*
A playful bucket for tools that don't deserve a full product.

## Structure

```text
trip/
  apps/
    umbrella/   — landing page
    pack/       — Vite + React + TypeScript
    dosh/
      backend/  — Node + WebSocket server
      frontend/ — Vite + React + TypeScript
```

## Development

```bash
npm install
npm run dev           # umbrella (localhost:5173)
npm run dev:pack      # pack (localhost:5174)
npm run dev:dosh:frontend  # dosh frontend (localhost:5175)
npm run dev:dosh:backend   # dosh backend (localhost:3000)
npm run build         # build everything
```

## Deployment

Pack deploys to GitHub Pages via GitHub Actions on push to main. Dosh backend runs on Render.

## Design principles

- **Event-scoped:** tools are disposable per trip, not permanent workspaces
- **No accounts:** just open and use
- **Pragmatic monorepo:** apps share a repo but mature independently
- **Extract shared code only when duplication is real** — not before
