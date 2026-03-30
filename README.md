# trip

Tiny, event-scoped web apps for trips, weekends, cabins, vacations, festivals, and other temporary friend-group chaos.

The idea is simple:

- one trip = one lightweight shared space
- each tool solves one real coordination problem
- the tools are intentionally small, fast, and disposable
- the whole thing should feel closer to a custom group chat than a serious productivity suite

This is not meant to become Notion-for-holidays. It should stay playful, obvious, and low-friction.

## Product shape

`trip` is the umbrella repo/app.

Inside it live several tiny tools:

- `dosh` — split expenses and settle up
- `pack` — who brings what
- `poll` — quick group decisions
- `jest` — fun/social tools for the trip itself

Each trip gets its own temporary shared context:

- trip name
- people list
- optional password / invite token
- lightweight live sync
- mobile-first UI

The same group should be able to jump between tools without feeling like they are entering a different product every time.

## Design goals

### 1. Tiny and obvious
Every screen should be understandable in seconds.

### 2. Built for the occasion
These apps are for a specific event, not for permanent life management.

### 3. Shared, not personal
The unit is the group, not the individual account.

### 4. Slightly playful
A little personality is good. Forced gamification is not.

### 5. Zero-admin energy
No onboarding ceremony. Open it, join, use it.

## Repo structure

Planned structure:

```text
trip/
  README.md
  apps/
    dosh/
    pack/
    poll/
    jest/
  packages/
    shared-ui/
    shared-protocol/
    shared-trip-core/
```

Depending on how much code is shared, this can stay a monorepo or remain conceptually unified while the apps mature independently first.

## Core shared model

All tools should reuse the same trip-level foundation:

- **Trip**
  - name
  - currency
  - join secret / code
  - created time
  - archive flag

- **People**
  - display name
  - case-insensitive unique identity within a trip
  - soft-removable / revivable where useful

- **Presence**
  - lightweight real-time connection
  - optional "who is here now"

- **Notes / metadata**
  - small free-text fields where the tool benefits from them

This means `pack`, `poll`, and `jest` should all feel like siblings of `dosh`, not random one-off microsites.

## The tools

## `dosh`

Already exists.

Purpose:

- track shared expenses
- compute balances
- suggest settlements
- keep payment entries understandable

Positioning:

- dead simple splitwise-for-this-trip
- not household finance
- not reimbursements bureaucracy

Likely role in `trip`:

- migrate in as `apps/dosh`
- keep current small-surface philosophy
- reuse shared trip + people layer

## `pack`

The next app to build.

Purpose:

- answer: **who brings what?**
- avoid duplicate items and forgotten essentials
- reduce the pre-trip message spam of “do we have towels / speaker / oil / cards / chargers?”

Core model:

- item name
- category (optional)
- quantity needed
- quantity claimed
- who is bringing it
- note (optional)
- status: needed / covered / extra

Core interactions:

- add item
- claim item
- unclaim item
- mark item covered
- quick edit quantity/note
- surface duplicate or suspicious overlap

Useful UI sections:

- **Need**
- **Covered**
- **Maybe / Extras**

Fun twist:

- friendly warnings like:
  - "3 bottle openers, 0 toothpaste"
  - "This trip may be oversupplied with board games"

Stretch ideas:

- starter templates:
  - cabin weekend
  - camping
  - ski trip
  - beach house
  - festival
- item suggestions based on trip type
- “missing basics” hints

Positioning:

- practical first
- funny second

## `poll`

Purpose:

- fast, low-stakes group decisions
- where to eat
- what to do next
- departure time
- tonight’s plan

Core model:

- poll question
- options
- optional deadline
- single-choice or multi-choice
- anonymous or visible votes

Core interactions:

- create poll in seconds
- vote in one tap
- live results
- close poll
- rerun or remix poll

Useful twists:

- tie-break mode
- hidden votes until reveal
- random winner mode for indecisive groups
- “captain decides” override for deadlock moments

Positioning:

- lighter and faster than formal polling tools
- optimized for trip indecision, not civic democracy

## `jest`

This is the playful bucket.

The name is intentionally a bit stupid. Good.

It contains the trip-social mini-apps that are fun in a group setting but too small to deserve their own top-level brand.

The first confirmed candidate is:

### `jest/bingo`

Purpose:

- trip scavenger hunt / photo hunt / social bingo

Core model:

- board of prompts
- prompts can be text-only or require a photo
- optional custom board per trip
- optional solo or team mode

Prompt examples:

- dog wearing something absurd
- menu typo
- someone says “we should definitely do this more often”
- cursed souvenir
- beautiful sunset
- drink with umbrella

Core interactions:

- mark square done
- upload proof optionally
- first line / first full card wins
- reveal completed boards live

Why it works:

- naturally creates photos and jokes
- low effort
- easy to understand instantly

### Other strong `jest` modules

These can live under `jest` rather than each becoming its own standalone app.

#### `jest/timeline`
A loose day plan for the trip.

Use case:

- brunch at 10
- leave at 12
- check-in at 15
- dinner maybe 19-ish

Twist:

- a “we’re late” action shifts the rest of the day forward automatically

Why it belongs here:

- useful, but not deep enough for a whole product

#### `jest/rooms`
Room / bed / sleeping spot assignment.

Use case:

- who gets what room
- who is on sofa duty
- avoid awkward ad hoc negotiation

Possible modes:

- random assign
- snake draft
- manual assign with group confirmation

#### `jest/counter`
Inside-joke / incident counter.

Use case:

- count recurring trip events
- lost keys
- someone saying “one quick beer”
- dramatic weather complaints

Value:

- becomes the post-trip stats / award generator

#### `jest/capsule`
Memory capsule.

Use case:

- every person drops one line per day
- “best moment today”
- “most cursed moment today”

Twist:

- reveal only at the end of the trip

#### `jest/spin`
Spin-the-plan wheel.

Use case:

- break indecision loops
- pick next activity / bar / game / dessert / walk route

Twist:

- each person gets limited vetoes

#### `jest/challenges`
Tiny social challenges.

Use case:

- gentle trip quests, not cringe party-game nonsense

Examples:

- take a group photo with a stranger’s dog
- find the worst postcard
- learn one useful local phrase

This one should stay optional and tasteful. If it feels like forced fun, cut it.

## Recommended product boundaries

To keep this good, explicitly avoid turning it into:

- full itinerary planner
- travel booking platform
- chat app
- social network
- massive gamified "group operating system"

The sweet spot is:

- tiny shared utilities
- event-specific
- immediate payoff
- little or no setup

## Recommended MVP order

### Phase 1
- `dosh`
- `pack`
- `poll`

This gives the core practical trio:

- money
- stuff
- decisions

### Phase 2
- `jest/bingo`
- `jest/timeline`
- `jest/rooms`

These add delight and trip-specific utility without much conceptual overhead.

### Phase 3
- `jest/capsule`
- `jest/counter`
- `jest/spin`
- maybe `jest/challenges`

These are more personality-driven and should be added only if they stay lightweight.

## UX tone

The tone should feel:

- warm
- quick
- slightly cheeky
- never corporate
- never too cute

Good:

- “Everyone is square.”
- “Covered.”
- “No suggested payments.”
- “You may have too many extension cords.”

Bad:

- fake startup productivity language
- achievement spam
- forced avatars / profiles / bios

## Shared technical approach

All modules should aim for the same engineering posture:

- simple real-time sync
- low-complexity backend
- mobile-first responsive frontend
- easy static/front deployment when possible
- minimal auth friction

Ideal shared capabilities:

- trip creation
- people management
- join via password or code
- section/module navigation
- consistent component library
- reusable live-state transport

## A good north star

If WhatsApp group chaos and a tiny purpose-built web app had a competent child, that is `trip`.

It should help with exactly the parts of group trips that group chats are bad at:

- money
- coordination
- decisions
- tiny bits of shared fun

And it should do that without becoming work.

## Immediate next step

Build `pack` next.

Why:

- high practical value
- low conceptual complexity
- naturally complements `dosh`
- easy to explain
- likely to be used before, during, and after departure

After that, build `poll`, then `jest/bingo`.
