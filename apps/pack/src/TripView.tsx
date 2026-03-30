import { FormEvent, useMemo, useState } from 'react';
import { TripPack, PackItem, normalizePerson, clearTrip } from './storage';
import { ItemSection } from './ItemSection';

type ItemState = 'need' | 'covered' | 'maybe';

interface TripViewProps {
  trip: TripPack;
  onTripUpdate: (trip: TripPack) => void;
  onResetTrip: () => void;
}

export function TripView({ trip, onTripUpdate, onResetTrip }: TripViewProps) {
  const [activePersonId, setActivePersonId] = useState<string>(trip.people[0]?.id ?? '');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Basics');
  const [formQuantity, setFormQuantity] = useState('1');
  const [formNote, setFormNote] = useState('');
  const [formState, setFormState] = useState<ItemState>('need');
  const [isEditingTripName, setIsEditingTripName] = useState(false);
  const [tripNameEdit, setTripNameEdit] = useState(trip.tripName);
  const [addPersonName, setAddPersonName] = useState('');
  const [showAddPerson, setShowAddPerson] = useState(false);

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

    const updatedTrip: TripPack = {
      ...trip,
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
        ...trip.items
      ]
    };

    onTripUpdate(updatedTrip);

    setFormName('');
    setFormCategory('Basics');
    setFormQuantity('1');
    setFormNote('');
    setFormState('need');
  };

  const handleAddPerson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = addPersonName.trim().replace(/\s+/g, ' ');
    if (!name) return;

    const normalizedPerson = normalizePerson(name, trip.people);
    if (!trip.people.find(p => p.id === normalizedPerson.id)) {
      const updatedTrip: TripPack = {
        ...trip,
        people: [...trip.people, normalizedPerson]
      };
      onTripUpdate(updatedTrip);
    }
    setAddPersonName('');
    setShowAddPerson(false);
  };

  const toggleClaim = (itemId: string) => {
    if (!activePerson) {
      return;
    }

    const updatedTrip: TripPack = {
      ...trip,
      items: trip.items.map((item) => {
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
    };

    onTripUpdate(updatedTrip);
  };

  const updateItem = (itemId: string, patch: Partial<PackItem>) => {
    const updatedTrip: TripPack = {
      ...trip,
      items: trip.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item))
    };
    onTripUpdate(updatedTrip);
  };

  const deleteItem = (itemId: string) => {
    const updatedTrip: TripPack = {
      ...trip,
      items: trip.items.filter((item) => item.id !== itemId)
    };
    onTripUpdate(updatedTrip);
  };

  const handleTripNameSave = () => {
    const name = tripNameEdit.trim().replace(/\s+/g, ' ');
    if (name && name !== trip.tripName) {
      onTripUpdate({ ...trip, tripName: name });
    }
    setIsEditingTripName(false);
  };

  const handleTripNameKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleTripNameSave();
    } else if (event.key === 'Escape') {
      setTripNameEdit(trip.tripName);
      setIsEditingTripName(false);
    }
  };

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">pack mvp</p>
          <div className="trip-name-container">
            {isEditingTripName ? (
              <input
                className="trip-name-edit"
                value={tripNameEdit}
                onChange={(e) => setTripNameEdit(e.target.value)}
                onBlur={handleTripNameSave}
                onKeyDown={handleTripNameKeyDown}
                autoFocus
              />
            ) : (
              <h1 onClick={() => setIsEditingTripName(true)} className="trip-name-editable">
                {trip.tripName}
                <span className="edit-icon">✎</span>
              </h1>
            )}
          </div>
          <p className="lede">Answer one question fast: who is bringing what, and what is still missing?</p>
        </div>
        <div className="hero-panel">
          <div>
            <label htmlFor="person-select">You are</label>
            <select id="person-select" value={activePersonId} onChange={(event) => setActivePersonId(event.target.value)}>
              {trip.people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            {!showAddPerson ? (
              <button type="button" className="ghost" onClick={() => setShowAddPerson(true)}>
                Add person
              </button>
            ) : (
              <form onSubmit={handleAddPerson} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  placeholder="Person's name"
                  value={addPersonName}
                  onChange={(e) => setAddPersonName(e.target.value)}
                  autoFocus
                />
                <button type="submit" style={{ width: 'auto', minWidth: '80px' }}>Add</button>
                <button type="button" className="ghost" onClick={() => { setShowAddPerson(false); setAddPersonName(''); }} style={{ width: 'auto', minWidth: '60px' }}>Cancel</button>
              </form>
            )}
          </div>
          <div className="stats">
            <Stat label="Need" value={String(sections.need.length)} />
            <Stat label="Covered" value={String(sections.covered.length)} />
            <Stat label="Maybe" value={String(sections.maybe.length)} />
          </div>
          <div className="danger-zone">
            <button
              type="button"
              className="ghost danger-btn"
              onClick={() => {
                if (confirm('Reset trip? This will clear all data and return to setup.')) {
                  clearTrip();
                  onResetTrip();
                }
              }}
            >
              Reset trip
            </button>
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
          onDeleteItem={deleteItem}
        />
        <ItemSection
          title="Covered"
          items={sections.covered}
          trip={trip}
          activePersonId={activePersonId}
          onToggleClaim={toggleClaim}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
        />
        <ItemSection
          title="Maybe / extras"
          items={sections.maybe}
          trip={trip}
          activePersonId={activePersonId}
          onToggleClaim={toggleClaim}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
        />
      </section>
    </main>
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