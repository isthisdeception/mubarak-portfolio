import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { PortfolioItem } from '../../data/portfolio';

export interface LightboxProps {
  item: PortfolioItem | null;
  items: PortfolioItem[];
  onClose: () => void;
  onNavigate: (item: PortfolioItem) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  item,
  items,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    if (!item) return;

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = items.findIndex((i) => i.id === item.id);
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        onNavigate(items[prevIndex]);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = items.findIndex((i) => i.id === item.id);
        const nextIndex = (currentIndex + 1) % items.length;
        onNavigate(items[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, items, onClose, onNavigate]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const total = items.length;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + total) % total;
    onNavigate(items[prevIndex]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % total;
    onNavigate(items[nextIndex]);
  };

  return (
    <div
      className="lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${item.title}`}
      onClick={onClose}
    >
      {/* Lightbox Top Header */}
      <div className="lightbox-header" onClick={(e) => e.stopPropagation()}>
        <span className="lightbox-counter">
          Frame {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button
          type="button"
          className="lightbox-close-btn"
          onClick={onClose}
          aria-label="Close lightbox modal (Esc)"
        >
          Close [Esc]
        </button>
      </div>

      {/* Main Body */}
      <div className="lightbox-body" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-media-container">
          {items.length > 1 && (
            <button
              type="button"
              className="lightbox-nav-btn lightbox-nav-prev"
              onClick={handlePrev}
              aria-label="Previous frame"
            >
              ←
            </button>
          )}

          <img
            src={item.src}
            alt={item.alt}
            className="lightbox-image"
          />

          {items.length > 1 && (
            <button
              type="button"
              className="lightbox-nav-btn lightbox-nav-next"
              onClick={handleNext}
              aria-label="Next frame"
            >
              →
            </button>
          )}
        </div>

        {/* Caption */}
        <div className="lightbox-caption">
          <h3 className="lightbox-title">{item.title}</h3>
          <div className="lightbox-meta-row">
            <span className="lightbox-discipline-tag">
              {item.discipline} · {item.category}
            </span>
            <span>{item.location}</span>
            <span>{item.year}</span>
            {item.clientOrContext && <span>— {item.clientOrContext}</span>}
          </div>
          {item.description && (
            <p className="lightbox-desc">{item.description}</p>
          )}
          {item.mediaType === 'video' && (
            <div style={{ marginTop: 'var(--space-2)' }}>
              <Link
                to="/reels"
                onClick={onClose}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)' }}
              >
                Explore Short-Form Motion in Reels →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
