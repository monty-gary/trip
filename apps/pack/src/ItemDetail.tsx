import { useState } from 'react';
import { PackItem, TripPack } from './storage';

type ItemState = 'need' | 'covered' | 'maybe';

interface ItemDetailProps {
  item: PackItem;
  trip: TripPack;
  activePersonId: string;
  onToggleClaim: (itemId: string) => void;
  onUpdateItem: (itemId: string, patch: Partial<PackItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onBack: () => void;
}

export function ItemDetail({
  item,
  trip,
  activePersonId,
  onToggleClaim,
  onUpdateItem,
  onDeleteItem,
  onBack
}: ItemDetailProps) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const claimedNames = item.claimedBy
    .map((personId) => trip.people.find((person) => person.id === personId)?.name)
    .filter(Boolean)
    .join(', ');

  const isClaimedByActive = item.claimedBy.includes(activePersonId);
  const status = deriveState(item);
  const claimedCount = item.claimedBy.length;
  const isFullyClaimed = claimedCount >= item.neededQuantity;
  const progressPct = item.neededQuantity > 0
    ? Math.min(100, Math.round((claimedCount / item.neededQuantity) * 100))
    : 0;

  const handleDeleteClick = () => {
    if (deleteConfirm) {
      onDeleteItem(item.id);
      onBack();
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  return (
    <main className="shell">
      <button type="button" className="ghost back-btn" onClick={onBack}>
        ← Back to list
      </button>

      <article className={`detail-card panel ${isFullyClaimed ? 'fully-claimed' : ''}`}>
        <div className="detail-header">
          <div>
            <p className="category">{item.category}</p>
            <h2>{item.name}</h2>
          </div>
          <span className={`chip chip-${status}`}>{status}</span>
        </div>

        <p className="note">{item.note || 'No note yet.'}</p>

        <div className="detail-progress">
          <div className="detail-progress-label">
            <span>
              {isFullyClaimed && <span className="check-icon">✓ </span>}
              {claimedCount}/{item.neededQuantity} claimed
            </span>
            <span className="detail-claimed-names">{claimedNames || 'Nobody yet'}</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${isFullyClaimed ? 'progress-full' : ''}`}
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        <div className="detail-fields">
          <label>Quantity needed</label>
          <input
            value={String(item.neededQuantity)}
            inputMode="numeric"
            onChange={(event) =>
              onUpdateItem(item.id, {
                neededQuantity: Math.max(1, Number(event.target.value.replace(/[^\d]/g, '')) || 1)
              })
            }
          />

          <label>Note</label>
          <input
            value={item.note}
            placeholder="Optional note"
            onChange={(event) => onUpdateItem(item.id, { note: event.target.value })}
          />

          <label>Status</label>
          <select
            value={item.state}
            onChange={(event) => onUpdateItem(item.id, { state: event.target.value as ItemState })}
          >
            <option value="need">Need</option>
            <option value="covered">Covered</option>
            <option value="maybe">Maybe / extra</option>
          </select>
        </div>

        <div className="detail-actions">
          <button
            className={isClaimedByActive ? 'ghost' : ''}
            type="button"
            onClick={() => onToggleClaim(item.id)}
          >
            {isClaimedByActive ? 'Unclaim' : 'I can bring this'}
          </button>

          <button
            type="button"
            className="ghost danger-btn"
            onClick={handleDeleteClick}
          >
            {deleteConfirm ? 'Tap again to delete' : 'Delete item'}
          </button>
        </div>
      </article>
    </main>
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
