import { FormEvent, useMemo, useState } from 'react';
import { TripPack, PackItem } from './storage';

type ItemState = 'need' | 'covered' | 'maybe';

interface ListViewProps {
  trip: TripPack;
  activePersonId: string;
  onSelectItem: (itemId: string) => void;
  onAddItem: (item: Omit<PackItem, 'id'>) => void;
  onAddPerson: (name: string) => void;
  onSetActivePerson: (personId: string) => void;
  onResetTrip: () => void;
  onTripNameUpdate: (name: string) => void;
  duplicateWarnings: string[];
  coverageWarnings: string[];
}

export function ListView({
  trip,
  activePersonId,
  onSelectItem,
  onAddItem,
  onAddPerson,
  onSetActivePerson,
  onResetTrip,
  onTripNameUpdate,
  duplicateWarnings,
  coverageWarnings
}: ListViewProps) {
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Basics');
  const [formQuantity, setFormQuantity] = useState('1');
  const [formNote, setFormNote] = useState('');
  const [formState, setFormState] = useState<ItemState>('need');
  const [isEditingTripName, setIsEditingTripName] = useState(false);
  const [tripNameEdit, setTripNameEdit] = useState(trip.tripName);
  const [addPersonName, setAddPersonName] = useState('');
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const hasItems = trip.items.length > 0;

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

    onAddItem({
      name,
      category,
      note,
      neededQuantity,
      claimedBy: [],
      state: formState
    });

    setFormName('');
    setFormCategory('Basics');
    setFormQuantity('1');
    setFormNote('');
    setFormState('need');
    setShowAddForm(false);
  };

  const handleAddPersonSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = addPersonName.trim().replace(/\s+/g, ' ');
    if (!name) return;

    onAddPerson(name);
    setAddPersonName('');
    setShowAddPerson(false);
  };

  const handleTripNameSave = () => {
    const name = tripNameEdit.trim().replace(/\s+/g, ' ');
    if (name && name !== trip.tripName) {
      onTripNameUpdate(name);
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

  const addItemForm = (
    <form className="form" onSubmit={handleAddItem}>
      <input placeholder="Item name" value={formName} onChange={(event) => setFormName(event.target.value)} autoFocus={showAddForm} />
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
  );

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">pack</p>
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
          <p className="lede">Who is bringing what, and what is still missing?</p>
        </div>
        <div className="hero-panel">
          <div>
            <label htmlFor="person-select">You are</label>
            <select id="person-select" value={activePersonId} onChange={(event) => onSetActivePerson(event.target.value)}>
              {trip.people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            {!showAddPerson ? (
              <button type="button" className="ghost" onClick={() => setShowAddPerson(true)}>
                + Add person
              </button>
            ) : (
              <form onSubmit={handleAddPersonSubmit} className="add-person-form">
                <input
                  placeholder="Person's name"
                  value={addPersonName}
                  onChange={(e) => setAddPersonName(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="add-person-btn">Add</button>
                <button type="button" className="ghost add-person-cancel" onClick={() => { setShowAddPerson(false); setAddPersonName(''); }}>Cancel</button>
              </form>
            )}
          </div>
          {hasItems && (
            <div className="stats">
              <Stat label="Need" value={String(sections.need.length)} />
              <Stat label="Covered" value={String(sections.covered.length)} />
              <Stat label="Maybe" value={String(sections.maybe.length)} />
            </div>
          )}
          <div className="danger-zone">
            <button
              type="button"
              className="ghost danger-btn"
              onClick={() => {
                if (confirm('Reset trip? This will clear all data and return to setup.')) {
                  onResetTrip();
                }
              }}
            >
              Reset trip
            </button>
          </div>
        </div>
      </section>

      {/* Empty state */}
      {!hasItems && (
        <section className="empty-state panel">
          <h2>No items yet</h2>
          <p className="empty-state-text">Add the first thing your group needs to bring.</p>
          {addItemForm}
        </section>
      )}

      {/* Populated state */}
      {hasItems && (
        <>
          <section className="insights">
            {(duplicateWarnings.length > 0 || coverageWarnings.length > 0) && (
              <article className="panel">
                <h2>Warnings</h2>
                <ul>
                  {duplicateWarnings.map((warning) => (
                    <li key={warning}>Duplicate item name: {warning}</li>
                  ))}
                  {coverageWarnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </article>
            )}

            <article className="panel">
              {showAddForm ? (
                <>
                  <div className="add-form-header">
                    <h2>Add item</h2>
                    <button type="button" className="ghost add-form-close" onClick={() => setShowAddForm(false)}>×</button>
                  </div>
                  {addItemForm}
                </>
              ) : (
                <button type="button" className="add-item-toggle" onClick={() => setShowAddForm(true)}>
                  + Add item
                </button>
              )}
            </article>
          </section>

          <section className="list-view">
            <ListSection
              title="Need"
              items={sections.need}
              onSelectItem={onSelectItem}
            />
            <ListSection
              title="Covered"
              items={sections.covered}
              onSelectItem={onSelectItem}
            />
            <ListSection
              title="Maybe / extras"
              items={sections.maybe}
              onSelectItem={onSelectItem}
            />
          </section>
        </>
      )}
    </main>
  );
}

interface ListSectionProps {
  title: string;
  items: PackItem[];
  onSelectItem: (itemId: string) => void;
}

function ListSection({ title, items, onSelectItem }: ListSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="panel list-section">
      <div className="section-head">
        <h2>{title}</h2>
        <span>{items.length}</span>
      </div>
      <div className="list-items">
        {items.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            onSelectItem={onSelectItem}
          />
        ))}
      </div>
    </section>
  );
}

interface ListItemProps {
  item: PackItem;
  onSelectItem: (itemId: string) => void;
}

function ListItem({ item, onSelectItem }: ListItemProps) {
  const status = deriveState(item);
  const claimedCount = item.claimedBy.length;
  const isFullyClaimed = claimedCount >= item.neededQuantity;

  return (
    <div className="list-item" onClick={() => onSelectItem(item.id)}>
      <div className={`status-dot status-dot-${status}`} />
      <div className="item-content">
        <span className="item-name">{item.name}</span>
        <span className="item-category">{item.category}</span>
      </div>
      <div className={`claim-fraction ${isFullyClaimed ? 'claim-done' : ''}`}>
        {isFullyClaimed ? '✓' : `${claimedCount}/${item.neededQuantity}`}
      </div>
    </div>
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
