import { FormEvent, useState } from 'react';
import { TripPack, Person, getDemoTrip, normalizePerson } from './storage';

interface TripSetupProps {
  onTripCreated: (trip: TripPack) => void;
}

export function TripSetup({ onTripCreated }: TripSetupProps) {
  const [step, setStep] = useState<'name' | 'people'>('name');
  const [tripName, setTripName] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [currentPersonName, setCurrentPersonName] = useState('');

  const handleNameSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = tripName.trim().replace(/\s+/g, ' ');
    if (!name) return;

    setTripName(name);
    setStep('people');
  };

  const handleAddPerson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = currentPersonName.trim().replace(/\s+/g, ' ');
    if (!name) return;

    const normalizedPerson = normalizePerson(name, people);
    if (!people.find(p => p.id === normalizedPerson.id)) {
      setPeople(prev => [...prev, normalizedPerson]);
    }
    setCurrentPersonName('');
  };

  const handleRemovePerson = (personId: string) => {
    setPeople(prev => prev.filter(p => p.id !== personId));
  };

  const handleFinishSetup = () => {
    if (people.length === 0) return;

    const trip: TripPack = {
      tripName,
      people,
      items: []
    };
    onTripCreated(trip);
  };

  const handleLoadDemo = () => {
    onTripCreated(getDemoTrip());
  };

  if (step === 'name') {
    return (
      <main className="shell">
        <section className="hero">
          <div>
            <p className="eyebrow">pack mvp</p>
            <h1>Set up your trip</h1>
            <p className="lede">Start by giving your trip a name, then add the people who are coming.</p>
          </div>
          <div className="hero-panel">
            <form className="form" onSubmit={handleNameSubmit}>
              <label htmlFor="trip-name">Trip name</label>
              <input
                id="trip-name"
                placeholder="e.g. Cabin Weekend, Beach Trip"
                value={tripName}
                onChange={(event) => setTripName(event.target.value)}
                autoFocus
              />
              <button type="submit">Continue</button>
            </form>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
              <button type="button" className="ghost" onClick={handleLoadDemo}>
                Load demo data
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">pack mvp</p>
          <h1>{tripName}</h1>
          <p className="lede">Add people who are coming on this trip. You can add more later.</p>
        </div>
        <div className="hero-panel">
          <form className="form" onSubmit={handleAddPerson}>
            <label htmlFor="person-name">Add person</label>
            <input
              id="person-name"
              placeholder="Person's name"
              value={currentPersonName}
              onChange={(event) => setCurrentPersonName(event.target.value)}
              autoFocus
            />
            <button type="submit">Add person</button>
          </form>

          {people.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h3>People coming ({people.length})</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {people.map(person => (
                  <div
                    key={person.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid var(--line)',
                      borderRadius: '14px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {person.name}
                    <button
                      type="button"
                      onClick={() => handleRemovePerson(person.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--ink-soft)',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        width: 'auto',
                        minWidth: 'auto',
                        borderRadius: '50%'
                      }}
                      title={`Remove ${person.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleFinishSetup}
                disabled={people.length === 0}
                style={{ marginTop: '1rem' }}
              >
                Start planning ({people.length} {people.length === 1 ? 'person' : 'people'})
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}