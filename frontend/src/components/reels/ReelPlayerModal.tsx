import React, { useEffect, useRef } from 'react';
import type { ReelItem } from '../../data/reels';

export interface ReelPlayerModalProps {
  reel: ReelItem | null;
  reels: ReelItem[];
  onClose: () => void;
  onNavigate: (reel: ReelItem) => void;
}

export const ReelPlayerModal: React.FC<ReelPlayerModalProps> = ({
  reel,
  reels,
  onClose,
  onNavigate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!reel) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = reels.findIndex((r) => r.id === reel.id);
        const prevIndex = (currentIndex - 1 + reels.length) % reels.length;
        onNavigate(reels[prevIndex]);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = reels.findIndex((r) => r.id === reel.id);
        const nextIndex = (currentIndex + 1) % reels.length;
        onNavigate(reels[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reel, reels, onClose, onNavigate]);

  // Restart video playback when reel changes
  useEffect(() => {
    if (videoRef.current && reel) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: video remains ready for user tap
      });
    }
  }, [reel]);

  if (!reel) return null;

  const currentIndex = reels.findIndex((r) => r.id === reel.id);
  const total = reels.length;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + total) % total;
    onNavigate(reels[prevIndex]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % total;
    onNavigate(reels[nextIndex]);
  };

  return (
    <div
      className="cinema-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Playing reel: ${reel.title}`}
      onClick={onClose}
    >
      {/* Top Header */}
      <div className="cinema-modal-header" onClick={(e) => e.stopPropagation()}>
        <span className="cinema-counter">
          Reel {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button
          type="button"
          className="cinema-close-btn"
          onClick={onClose}
          aria-label="Close cinema player (Esc)"
        >
          Close [Esc]
        </button>
      </div>

      {/* Main Body */}
      <div className="cinema-modal-body" onClick={(e) => e.stopPropagation()}>
        <div className="cinema-video-container">
          {reels.length > 1 && (
            <button
              type="button"
              className="cinema-nav-btn cinema-nav-prev"
              onClick={handlePrev}
              aria-label="Previous reel"
            >
              ←
            </button>
          )}

          {reel.embedUrl ? (
            <iframe
              src={`${reel.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={reel.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="cinema-video"
              style={{
                aspectRatio: reel.aspectRatio === 'vertical' ? '9 / 16' : '16 / 9',
                border: 'none',
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <video
              ref={videoRef}
              src={reel.videoSrc}
              poster={reel.poster}
              controls
              playsInline
              autoPlay
              className="cinema-video"
              style={{
                aspectRatio: reel.aspectRatio === 'vertical' ? '9 / 16' : '16 / 9',
              }}
            >
              Your browser does not support the video tag.
            </video>
          )}

          {reels.length > 1 && (
            <button
              type="button"
              className="cinema-nav-btn cinema-nav-next"
              onClick={handleNext}
              aria-label="Next reel"
            >
              →
            </button>
          )}
        </div>

        {/* Caption & Metadata */}
        <div className="cinema-caption">
          <h3 className="cinema-title">{reel.title}</h3>
          <div className="cinema-meta-row">
            <span className="cinema-gear-note">{reel.category}</span>
            <span>{reel.location}</span>
            <span>{reel.year}</span>
            <span>Duration: {reel.duration}</span>
          </div>
          {reel.gearOrFormat && (
            <div style={{ fontFamily: 'var(--font-accent)', fontSize: '0.68rem', color: 'var(--color-accent)', letterSpacing: 'var(--tracking-wide)' }}>
              {reel.gearOrFormat}
            </div>
          )}
          <p className="cinema-desc">{reel.description}</p>
        </div>
      </div>
    </div>
  );
};
