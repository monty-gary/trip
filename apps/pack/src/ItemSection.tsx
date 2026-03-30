import { PackItem, TripPack } from './storage';
import { ItemCard } from './ItemCard';

interface ItemSectionProps {
  title: string;
  items: PackItem[];
  trip: TripPack;
  activePersonId: string;
  onToggleClaim: (itemId: string) => void;
  onUpdateItem: (itemId: string, patch: Partial<PackItem>) => void;
  onDeleteItem: (itemId: string) => void;
}

export function ItemSection({
  title,
  items,
  trip,
  activePersonId,
  onToggleClaim,
  onUpdateItem,
  onDeleteItem
}: ItemSectionProps) {
  return (
    <section className="panel section-panel">
      <div className="section-head">
        <h2>{title}</h2>
        <span>{items.length}</span>
      </div>
      <div className="cards">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            trip={trip}
            activePersonId={activePersonId}
            onToggleClaim={onToggleClaim}
            onUpdateItem={onUpdateItem}
            onDeleteItem={onDeleteItem}
          />
        ))}
        {items.length === 0 ? <p className="empty">Nothing here right now.</p> : null}
      </div>
    </section>
  );
}