import { FormEvent, useMemo, useState } from 'react';

type ItemState = 'need' | 'covered' | 'maybe';

interface Person {
  id: string;
  name: string;
}

interface PackItem {
  id: string;
  name: string;
  category: string;
  neededQuantity: number;
  claimedBy: string[];
  note: string;
  state: ItemState;
}

interface TripPack {
  tripName: string;
  people: Person[];
  items: PackItem[];
}

const initialTrip: TripPack = {
  tripName: 'Cabin Weekend',
  people: [
    { id: 'ava', name: 'Ava' },
    { id: 'leo', name: 'Leo' },
    { id: 'mira', name: 'Mira' },
    { id: 'sam', name: 'Sam' }
  ],
  items: [
    { id: 'plates', name: 'Paper plates', category: 'Kitchen', neededQuantity: 2, claimedBy: ['ava'], note: 'Dinner for Friday and Saturday.', state: 'need' },
    { id: 'speaker', name: 'Portable speaker', category: 'Camp vibes', neededQuantity: 1, claimedBy: ['leo'], note: 'Charge it before leaving.', state: 'covered' },
    { id: 'coffee', name: 'Coffee beans', category: 'Morning', neededQuantity: 1, claimedBy: [], note: 'Ground is fine too.', state: 'need' },
    { id: 'cards', name: 'Cards or board game', category: 'Fun', neededQuantity: 1, claimedBy: ['sam'], note: 'Maybe overkill if someone also brings Catan.', state: 'maybe' },
    { id: 'towels', name: 'Extra towels', category: 'Basics', neededQuantity: 3, claimedBy: ['mira'], note: 'Host said there are only two in the house.', state: 'need' },
    { id: 'ice', name: 'Bag of ice', category: 'Kitchen', neededQuantity: 2, claimedBy: ['ava', 'sam'], note: 'Grab on the drive in.', state: 'covered' }
  ]
};

function App() {
  const [trip, setTrip] = useState<TripPack>(initialTrip);
  const [activePersonId, setActivePersonId] = useState<string>(initialTrip.people[0]?.id ?? '');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Basics');
  const [formQuantity, setFormQuantity] = useState('1');
  const [formNote, setFormNote] = useState('');
  const [formState, setFormState] = useState<ItemState>('need');

  const activePerson = trip.people.find((person) => person.id === activePersonId) ?? trip.people[0];

  const duplicateWarnings = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of trip.items) {
      const key = item.name.trim().toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([name]) => name);
  }, [trip.items]);

  const basicWarnings = useMemo(() => {
    const names = new Set(trip.items.map((item) => item.name.trim().toLowerCase()));
    const warnings: string[] = [];

    if (!names.has('toothpaste')) {
      warnings.push('No toothpaste on the list.');
    }

    if (!Array.from(names).some((name) => name.includes('charger'))) {
      warnings.push('No chargers listed yet.');
    }

    if (Array.from(names).filter((name) => name.includes('game') || name.includes('cards')).length > 1) {
      warnings.push('This trip may be oversupplied with games.');
    }

    return warnings;
  }, [trip.items]);

  const sections = useMemo(
    () => ({
      need: trip.items.filter((item) => deriveState(item) === 'need'),
      covered: trip.items.filter((item) => deriveState(item) === 'covered'),
      maybe: trip.items.filter((item) => deriveState(item) === 'maybe')
    }),
    [trip.items]
  );

  const handleAddItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formName.trim().replace(/\s+/g, ' ');
    const category = formCategory.trim().replace(/\s+/g, ' ');
    const note = formNote.trim().replace(/\s+/g, ' ');
    const neededQuantity = Number(formQuantity);

    if (!name || !category || !Number.isFinite(neededQuantity) || neededQuantity < 1) {
      return;
    }

    setTrip((current) => ({
      ...current,
      items: [
        {
          id: `item-${crypto.randomUUID()}`,
          name,
          category,
          note,
          neededQuantity,
          claimedBy: [],
          state: formState
        },
        ...current.items
      ]
    }));

    setFormName('');
    setFormCategory('Basics');
    setFormQuantity('1');
    setFormNote('');
    setFormState('need');
  };

  const toggleClaim = (itemId: string) => {
    if (!activePerson) {
      return;
    }

    setTrip((current) => ({
      ...current,
      items: current.items.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const claimedBy = item.claimedBy.includes(activePerson.id)
          ? item.claimedBy.filter((id) => id !== activePerson.id)
          : [...item.claimedBy, activePerson.id];

        return {
          ...item,
          claimedBy
        };
      })
    }));
  };

  const updateItem = (itemId: string, patch: Partial<PackItem>) => {
    setTrip((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item))
    }));
  };

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">pack mvp</p>
          <h1>{trip.tripName}</h1>
          <p className="lede">Answer one question fast: who is bringing what, and what is still missing?</p>
        </div>
        <div className="hero-panel">
          <label htmlFor="person-select">You are</label>
          <select id="person-select" value={activePersonId} onChange={(event) => setActivePersonId(event.target.value)}>
            {trip.people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
          <div className="stats">
            <Stat label="Need" value={String(sections.need.length)} />
            <Stat label="Covered" value={String(sections.covered.length)} />
            <Stat label="Maybe" value={String(sections.maybe.length)} />
          </div>
        </div>
      </section>

      <section className="insights">
        <article className="panel">
          <h2>Quick warnings</h2>
          <ul>
            {duplicateWarnings.length === 0 && basicWarnings.length === 0 ? <li>List looks balanced so far.</li> : null}
            {duplicateWarnings.map((warning) => (
              <li key={warning}>Duplicate item name: {warning}</li>
            ))}
            {basicWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Add item</h2>
          <form className="form" onSubmit={handleAddItem}>
            <input placeholder="Item name" value={formName} onChange={(event) => setFormName(event.target.value)} />
            <div className="inline">
              <input placeholder="Category" value={formCategory} onChange={(event) => setFormCategory(event.target.value)} />
              <input
                placeholder="Qty"
                inputMode="numeric"
                value={formQuantity}
                onChange={(event) => setFormQuantity(event.target.value.replace(/[^\d]/g, ''))}
              />
            </div>
            <textarea placeholder="Optional note" value={formNote} onChange={(event) => setFormNote(event.target.value)} />
            <select value={formState} onChange={(event) => setFormState(event.target.value as ItemState)}>
              <option value="need">Need</option>
              <option value="covered">Covered</option>
              <option value="maybe">Maybe / extra</option>
            </select>
            <button type="submit">Add to list</button>
          </form>
        </article>
      </section>

      <section className="list-grid">
        <ItemSection
          title="Need"
          items={sections.need}
          trip={trip}
          activePersonId={activePersonId}
          onToggleClaim={toggleClaim}
          onUpdateItem={updateItem}
        />
        <ItemSection
          title="Covered"
          items={sections.covered}
          trip={trip}
          activePersonId={activePersonId}
          onToggleClaim={toggleClaim}
          onUpdateItem={updateItem}
        />
        <ItemSection
          title="Maybe / extras"
          items={sections.maybe}
          trip={trip}
          activePersonId={activePersonId}
          onToggleClaim={toggleClaim}
          onUpdateItem={updateItem}
        />
      </section>
    </main>
  );
}

function ItemSection({
  title,
  items,
  trip,
  activePersonId,
  onToggleClaim,
  onUpdateItem
}: {
  title: string;
  items: PackItem[];
  trip: TripPack;
  activePersonId: string;
  onToggleClaim: (itemId: string) => void;
  onUpdateItem: (itemId: string, patch: Partial<PackItem>) => void;
}) {
  return (
    <section className="panel section-panel">
      <div className="section-head">
        <h2>{title}</h2>
        <span>{items.length}</span>
      </div>
      <div className="cards">
        {items.map((item) => {
          const claimedNames = item.claimedBy
            .map((personId) => trip.people.find((person) => person.id === personId)?.name)
            .filter(Boolean)
            .join(', ');
          const isClaimedByActive = item.claimedBy.includes(activePersonId);
          const status = deriveState(item);

          return (
            <article className="item-card" key={item.id}>
              <div className="item-head">
                <div>
                  <p className="category">{item.category}</p>
                  <h3>{item.name}</h3>
                </div>
                <span className={`chip chip-${status}`}>{status}</span>
              </div>
              <p className="note">{item.note || 'No note yet.'}</p>
              <div className="meta">
                <span>Need {item.neededQuantity}</span>
                <span>Claimed {item.claimedBy.length}</span>
                <span>{claimedNames || 'Nobody yet'}</span>
              </div>
              <div className="editor">
                <input
                  value={String(item.neededQuantity)}
                  inputMode="numeric"
                  onChange={(event) =>
                    onUpdateItem(item.id, {
                      neededQuantity: Math.max(1, Number(event.target.value.replace(/[^\d]/g, '')) || 1)
                    })
                  }
                />
                <input
                  value={item.note}
                  onChange={(event) => onUpdateItem(item.id, { note: event.target.value })}
                />
                <select
                  value={item.state}
                  onChange={(event) => onUpdateItem(item.id, { state: event.target.value as ItemState })}
                >
                  <option value="need">Need</option>
                  <option value="covered">Covered</option>
                  <option value="maybe">Maybe / extra</option>
                </select>
              </div>
              <button className={isClaimedByActive ? 'ghost' : ''} type="button" onClick={() => onToggleClaim(item.id)}>
                {isClaimedByActive ? 'Unclaim' : 'I can bring this'}
              </button>
            </article>
          );
        })}
        {items.length === 0 ? <p className="empty">Nothing here right now.</p> : null}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function deriveState(item: PackItem): ItemState {
  if (item.state === 'maybe') {
    return 'maybe';
  }

  if (item.claimedBy.length >= item.neededQuantity || item.state === 'covered') {
    return 'covered';
  }

  return 'need';
}

export default App;
