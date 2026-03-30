# pack

Group packing coordination for trips: who brings what, what is still missing, and what is already covered.

## Run

From the repo root:

```bash
npm run dev:pack
```

The app runs on `http://localhost:5174`.

Live: [monty-gary.github.io/trip](https://monty-gary.github.io/trip/)

## Features

- **Setup flow** — name your trip, add people (case-insensitive identity matching)
- **Dense list view** — compact checklist with status dots, names, categories, and claim fractions
- **Item detail** — tap any row to drill into full edit view with progress bar, claim/unclaim, and delete
- **Browser back** — history.pushState support so the back button returns to list from detail
- **localStorage persistence** — auto-save on every change, restore on reload
- **Dynamic people** — add more people anytime, case-insensitive matching
- **Editable trip name** — click the heading to rename
- **Warnings** — duplicate items, unclaimed items, under-claimed items
- **Reset trip** — clears everything and returns to setup
- **Demo data** — opt-in loader in the setup flow for testing

## Architecture

```
src/
  App.tsx          — root: loading → setup or trip view
  TripSetup.tsx    — first-run setup flow (trip name + people)
  TripView.tsx     — view controller (list ↔ detail) + all mutations
  ListView.tsx     — dense checklist, collapsible add-item form, empty state
  ItemDetail.tsx   — full item card with edit fields + progress bar
  storage.ts       — types, localStorage persistence, people normalization
  styles.css       — all styles (no inline styles)
```

## Data model

All state is a single serializable `TripPack` object — ready to swap localStorage for a backend API without restructuring.

```typescript
interface TripPack {
  tripName: string;
  people: Person[];
  items: PackItem[];
}
```

## Current limitations

- Local state only — no sync between devices yet
- No realtime collaboration
- No shared trip identity or auth layer
