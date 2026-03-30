# trip

Tiny event-scoped apps for trips, weekends, cabins, festivals, and other temporary friend-group logistics.

This repository is now a working monorepo. It currently includes:

- `umbrella`: a simple launcher/status app for the whole project
- `dosh`: migrated from the standalone sibling repo and adapted to run here
- `pack`: an initial working MVP for "who brings what"

## Structure

```text
trip/
  apps/
    umbrella/   # landing app for the umbrella project
    dosh/
      backend/  # Node + WebSocket server
      frontend/ # Vite + React + TypeScript client
    pack/       # Vite + React + TypeScript MVP
```

## Workspace commands

Install dependencies once from the repo root:

```bash
npm install
```

Run the umbrella launcher:

```bash
npm run dev
```

Run individual apps:

```bash
npm run dev:umbrella
npm run dev:pack
npm run dev:dosh:backend
npm run dev:dosh:frontend
```

Build everything that currently has a build:

```bash
npm run build
```

## Ports

- `umbrella`: `http://localhost:5173`
- `pack`: `http://localhost:5174`
- `dosh` frontend: `http://localhost:5175`
- `dosh` backend: `http://localhost:3000`

## Current apps

### `umbrella`

Small launcher app for the repo. It gives the project a concrete top-level surface instead of leaving the repo as a concept document.

### `dosh`

Realtime shared expense splitting.

Current behavior preserved from the standalone repo:

- password gate and admin mode
- per-tab expense rooms
- live WebSocket sync
- weighted expense splits
- derived balances and settle-up suggestions

See [apps/dosh/README.md](/workspace/repos/trip/apps/dosh/README.md).

### `pack`

Initial MVP for group packing coordination.

Current behavior:

- seeded demo trip and people
- add items with category, quantity, note, and status
- pick "You are" and claim or unclaim items
- sections for `Need`, `Covered`, and `Maybe / extras`
- quick inline edits for quantity, note, and status
- lightweight warnings for duplicates and missing basics

See [apps/pack/README.md](/workspace/repos/trip/apps/pack/README.md).

## Notes

- This is intentionally pragmatic. There is no shared package layer yet because there is not enough shared code to justify one.
- `poll` and `jest` remain planned, but the monorepo layout leaves room for them to join cleanly later.
