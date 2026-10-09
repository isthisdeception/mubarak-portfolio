import React from 'react';
import type { ReelItem } from '../../data/reels';

export interface ReelCardProps {
  reel: ReelItem;
  onSelect: (reel: ReelItem) => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel, onSelect }) => {
  return (
    <article className="reel-card-wrapper">
      <button
        type="button"
        className="reel-card"
        onClick={() => onSelect(reel)}
        aria-label={`Watch reel: ${reel.title} (${reel.duration})`}
      >
        <div className={`reel-poster-frame aspect-${reel.aspectRatio}`}>
          <img
            src={reel.poster}
            alt={reel.title}
            className="reel-poster-img"
            loading="lazy"
          />

          {/* Center Play Indicator */}
          <div className="reel-play-overlay">
            <div className="reel-play-button" aria-hidden="true">
              ▶
            </div>
          </div>

          {/* Bottom Duration & Format Indicators */}
          <div className="reel-meta-tags">
            <span className="reel-duration-pill">{reel.duration}</span>
            {reel.aspectRatio === 'vertical' ? (
              <span className="reel-format-pill">9:16 Reel</span>
            ) : (
              <span className="reel-format-pill">16:9 Scope</span>
            )}
          </div>
        </div>

        {/* Card Caption */}
        <div className="reel-caption">
          <div className="reel-title-row">
            <h3 className="reel-title">{reel.title}</h3>
            <span className="reel-year">{reel.year}</span>
          </div>

          <div className="reel-meta-bottom">
            <span className="reel-category">{reel.category}</span>
            <span>{reel.location}</span>
          </div>
        </div>
      </button>
    </article>
  );
};
