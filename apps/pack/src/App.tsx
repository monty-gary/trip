import { useEffect, useState } from 'react';
import { TripPack, loadTrip, saveTrip } from './storage';
import { TripSetup } from './TripSetup';
import { TripView } from './TripView';

function App() {
  const [trip, setTrip] = useState<TripPack | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load trip from localStorage on mount
  useEffect(() => {
    const savedTrip = loadTrip();
    setTrip(savedTrip);
    setIsLoading(false);
  }, []);

  // Save trip to localStorage whenever it changes
  useEffect(() => {
    if (trip) {
      saveTrip(trip);
    }
  }, [trip]);

  const handleTripCreated = (newTrip: TripPack) => {
    setTrip(newTrip);
  };

  const handleTripUpdate = (updatedTrip: TripPack) => {
    setTrip(updatedTrip);
  };

  const handleResetTrip = () => {
    setTrip(null);
  };

  // Show loading state briefly on initial load
  if (isLoading) {
    return (
      <main className="shell">
        <section className="hero">
          <div>
            <p className="eyebrow">pack mvp</p>
            <h1>Loading...</h1>
          </div>
        </section>
      </main>
    );
  }

  // Show setup flow if no trip exists
  if (!trip) {
    return <TripSetup onTripCreated={handleTripCreated} />;
  }

  // Show main trip view
  return (
    <TripView
      trip={trip}
      onTripUpdate={handleTripUpdate}
      onResetTrip={handleResetTrip}
    />
  );
}

export default App;
