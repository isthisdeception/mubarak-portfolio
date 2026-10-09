import React from 'react';
import type { PortfolioItem } from '../../data/portfolio';

export interface PortfolioItemCardProps {
  item: PortfolioItem;
  onClick: (item: PortfolioItem) => void;
}

export const PortfolioItemCard: React.FC<PortfolioItemCardProps> = ({
  item,
  onClick,
}) => {
  return (
    <article className="gallery-card-wrapper">
      <button
        type="button"
        className="gallery-card"
        onClick={() => onClick(item)}
        aria-label={`Open ${item.title} in full view`}
      >
        <div className={`gallery-card-media aspect-${item.aspectRatio}`}>
          <img
            src={item.src}
            alt={item.alt}
            className="gallery-card-img"
            loading="lazy"
          />
          {item.mediaType === 'video' && (
            <span className="media-type-badge">Motion / Reel</span>
          )}
        </div>

        <div className="gallery-card-caption">
          <div className="gallery-card-title-row">
            <h3 className="gallery-card-title">{item.title}</h3>
            <span className="gallery-card-year">{item.year}</span>
          </div>

          <div className="gallery-card-meta">
            <span className="gallery-card-category">{item.category}</span>
            <span>{item.location}</span>
          </div>
        </div>
      </button>
    </article>
  );
};
