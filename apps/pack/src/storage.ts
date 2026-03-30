export interface Person {
  id: string;
  name: string;
}

export interface PackItem {
  id: string;
  name: string;
  category: string;
  neededQuantity: number;
  claimedBy: string[];
  note: string;
  state: 'need' | 'covered' | 'maybe';
}

export interface TripPack {
  tripName: string;
  people: Person[];
  items: PackItem[];
}

const STORAGE_KEY = 'pack-app-trip';

export function saveTrip(trip: TripPack): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  } catch (error) {
    console.warn('Failed to save trip to localStorage:', error);
  }
}

export function loadTrip(): TripPack | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load trip from localStorage:', error);
  }
  return null;
}

export function clearTrip(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear trip from localStorage:', error);
  }
}

export function getDemoTrip(): TripPack {
  return {
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
}

// Normalize people names (case-insensitive, preserve display casing from first entry)
export function normalizePerson(name: string, existingPeople: Person[]): Person {
  const normalizedName = name.trim().replace(/\s+/g, ' ');
  const lowerName = normalizedName.toLowerCase();

  // Check if person already exists (case-insensitive)
  const existing = existingPeople.find(p => p.name.toLowerCase() === lowerName);
  if (existing) {
    return existing;
  }

  // Create new person with preserved casing
  return {
    id: lowerName.replace(/\s+/g, '-'),
    name: normalizedName
  };
}