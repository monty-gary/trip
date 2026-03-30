# pack

`pack` is the first pass at the trip packing app: who brings what, what is still missing, and what may already be over-covered.

## Run

From the repo root:

```bash
npm run dev:pack
```

The app runs on `http://localhost:5174`.

## Current scope

- seeded cabin-weekend demo data
- choose the active person
- add items with category, quantity, note, and section
- claim and unclaim items
- quick inline edits for quantity, note, and status
- simple warnings for duplicates and obvious missing basics

## Current limitations

- local state only, no persistence yet
- no shared trip identity or auth layer yet
- no realtime sync yet
