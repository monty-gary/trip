import { useCallback, useEffect, useMemo, useState } from 'react';
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

  // Browser history support for detail view
  const navigateToDetail = useCallback((itemId: string) => {
    setViewState({ view: 'detail', itemId });
    history.pushState({ view: 'detail', itemId }, '');
  }, []);

  const navigateToList = useCallback(() => {
    setViewState({ view: 'list' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setViewState({ view: 'list' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  const addItem = useCallback((itemData: Omit<PackItem, 'id'>) => {
    onTripUpdate({
      ...trip,
      items: [
        { ...itemData, id: `item-${crypto.randomUUID()}` },
        ...trip.items
      ]
    });
  }, [trip, onTripUpdate]);

  const addPerson = useCallback((name: string) => {
    const person = normalizePerson(name, trip.people);
    if (!trip.people.find((p) => p.id === person.id)) {
      onTripUpdate({ ...trip, people: [...trip.people, person] });
    }
  }, [trip, onTripUpdate]);

  const toggleClaim = useCallback((itemId: string) => {
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
  }, [trip, activePerson, onTripUpdate]);

  const updateItem = useCallback((itemId: string, patch: Partial<PackItem>) => {
    onTripUpdate({
      ...trip,
      items: trip.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item))
    });
  }, [trip, onTripUpdate]);

  const deleteItem = useCallback((itemId: string) => {
    onTripUpdate({
      ...trip,
      items: trip.items.filter((item) => item.id !== itemId)
    });
  }, [trip, onTripUpdate]);

  const updateTripName = useCallback((name: string) => {
    onTripUpdate({ ...trip, tripName: name });
  }, [trip, onTripUpdate]);

  const handleReset = useCallback(() => {
    clearTrip();
    onResetTrip();
  }, [onResetTrip]);

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
        onBack={() => {
          navigateToList();
          history.back();
        }}
      />
    );
  }

  // List view (default)
  return (
    <ListView
      trip={trip}
      activePersonId={activePersonId}
      onSelectItem={navigateToDetail}
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
