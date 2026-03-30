import { useMemo, useState } from 'react';
import { TripPack, PackItem, normalizePerson, clearTrip } from './storage';
import { ListView } from './ListView';
import { ItemDetail } from './ItemDetail';

interface TripViewProps {
  trip: TripPack;
  onTripUpdate: (trip: TripPack) => void;
  onResetTrip: () => void;
}

type ViewState =
  | { view: 'list' }
  | { view: 'detail'; itemId: string };

export function TripView({ trip, onTripUpdate, onResetTrip }: TripViewProps) {
  const [viewState, setViewState] = useState<ViewState>({ view: 'list' });
  const [activePersonId, setActivePersonId] = useState<string>(trip.people[0]?.id ?? '');

  const activePerson = trip.people.find((p) => p.id === activePersonId) ?? trip.people[0];

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

  const coverageWarnings = useMemo(() => {
    const warnings: string[] = [];
    const unclaimed = trip.items.filter(
      (item) => item.state !== 'maybe' && item.claimedBy.length === 0
    );
    if (unclaimed.length > 0) {
      warnings.push(`${unclaimed.length} item${unclaimed.length === 1 ? '' : 's'} with no one claiming ${unclaimed.length === 1 ? 'it' : 'them'} yet.`);
    }
    const underClaimed = trip.items.filter(
      (item) => item.state !== 'maybe' && item.claimedBy.length > 0 && item.claimedBy.length < item.neededQuantity
    );
    if (underClaimed.length > 0) {
      warnings.push(`${underClaimed.length} item${underClaimed.length === 1 ? '' : 's'} still need${underClaimed.length === 1 ? 's' : ''} more volunteers.`);
    }
    return warnings;
  }, [trip.items]);

  const addItem = (itemData: Omit<PackItem, 'id'>) => {
    onTripUpdate({
      ...trip,
      items: [
        { ...itemData, id: `item-${crypto.randomUUID()}` },
        ...trip.items
      ]
    });
  };

  const addPerson = (name: string) => {
    const person = normalizePerson(name, trip.people);
    if (!trip.people.find((p) => p.id === person.id)) {
      onTripUpdate({ ...trip, people: [...trip.people, person] });
    }
  };

  const toggleClaim = (itemId: string) => {
    if (!activePerson) return;
    onTripUpdate({
      ...trip,
      items: trip.items.map((item) => {
        if (item.id !== itemId) return item;
        const claimedBy = item.claimedBy.includes(activePerson.id)
          ? item.claimedBy.filter((id) => id !== activePerson.id)
          : [...item.claimedBy, activePerson.id];
        return { ...item, claimedBy };
      })
    });
  };

  const updateItem = (itemId: string, patch: Partial<PackItem>) => {
    onTripUpdate({
      ...trip,
      items: trip.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item))
    });
  };

  const deleteItem = (itemId: string) => {
    onTripUpdate({
      ...trip,
      items: trip.items.filter((item) => item.id !== itemId)
    });
  };

  const updateTripName = (name: string) => {
    onTripUpdate({ ...trip, tripName: name });
  };

  const handleReset = () => {
    clearTrip();
    onResetTrip();
  };

  // Detail view
  if (viewState.view === 'detail') {
    const item = trip.items.find((i) => i.id === viewState.itemId);
    if (!item) {
      setViewState({ view: 'list' });
      return null;
    }
    return (
      <ItemDetail
        item={item}
        trip={trip}
        activePersonId={activePersonId}
        onToggleClaim={toggleClaim}
        onUpdateItem={updateItem}
        onDeleteItem={deleteItem}
        onBack={() => setViewState({ view: 'list' })}
      />
    );
  }

  // List view (default)
  return (
    <ListView
      trip={trip}
      activePersonId={activePersonId}
      onSelectItem={(itemId) => setViewState({ view: 'detail', itemId })}
      onAddItem={addItem}
      onAddPerson={addPerson}
      onSetActivePerson={setActivePersonId}
      onResetTrip={handleReset}
      onTripNameUpdate={updateTripName}
      duplicateWarnings={duplicateWarnings}
      coverageWarnings={coverageWarnings}
    />
  );
}
