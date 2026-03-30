import { useState } from 'react';
import { PackItem, TripPack } from './storage';

type ItemState = 'need' | 'covered' | 'maybe';

interface ItemCardProps {
  item: PackItem;
  trip: TripPack;
  activePersonId: string;
  onToggleClaim: (itemId: string) => void;
  onUpdateItem: (itemId: string, patch: Partial<PackItem>) => void;
  onDeleteItem: (itemId: string) => void;
}

export function ItemCard({
  item,
  trip,
  activePersonId,
  onToggleClaim,
  onUpdateItem,
  onDeleteItem
}: ItemCardProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const claimedNames = item.claimedBy
    .map((personId) => trip.people.find((person) => person.id === personId)?.name)
    .filter(Boolean)
    .join(', ');

  const isClaimedByActive = item.claimedBy.includes(activePersonId);
  const status = deriveState(item);
  const claimedCount = item.claimedBy.length;
  const isFullyClaimed = claimedCount >= item.neededQuantity;

  const handleDeleteClick = () => {
    if (deleteConfirm) {
      onDeleteItem(item.id);
    } else {
      setDeleteConfirm(true);
      // Reset confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  return (
    <article className={`item-card ${isFullyClaimed ? 'fully-claimed' : ''}`}>
      <div className="item-head">
        <div>
          <p className="category">{item.category}</p>
          <h3>{item.name}</h3>
        </div>
        <div className="item-actions">
          <span className={`chip chip-${status}`}>{status}</span>
          <button
            type="button"
            className="delete-btn"
            onClick={handleDeleteClick}
            title={deleteConfirm ? 'Tap again to confirm delete' : 'Delete item'}
          >
            {deleteConfirm ? '✓' : '×'}
          </button>
        </div>
      </div>

      <p className="note">{item.note || 'No note yet.'}</p>

      <div className="meta">
        <span>Need {item.neededQuantity}</span>
        <span className="claim-progress">
          {isFullyClaimed && <span className="check-icon">✓ </span>}
          Claimed {claimedCount}/{item.neededQuantity}
        </span>
        <span>{claimedNames || 'Nobody yet'}</span>
      </div>

      <div className="editor-toggle">
        <button
          type="button"
          className="ghost editor-toggle-btn"
          onClick={() => setShowEditor(!showEditor)}
        >
          {showEditor ? 'Hide details' : 'Edit details'}
        </button>
      </div>

      {showEditor && (
        <div className="editor">
          <input
            value={String(item.neededQuantity)}
            inputMode="numeric"
            placeholder="Quantity needed"
            onChange={(event) =>
              onUpdateItem(item.id, {
                neededQuantity: Math.max(1, Number(event.target.value.replace(/[^\d]/g, '')) || 1)
              })
            }
          />
          <input
            value={item.note}
            placeholder="Optional note"
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
      )}

      <button
        className={isClaimedByActive ? 'ghost' : ''}
        type="button"
        onClick={() => onToggleClaim(item.id)}
      >
        {isClaimedByActive ? 'Unclaim' : 'I can bring this'}
      </button>
    </article>
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