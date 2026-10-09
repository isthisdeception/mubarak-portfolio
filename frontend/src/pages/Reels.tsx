import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { reelCategories } from '../data/reels';
import type { ReelItem } from '../data/reels';
import { reelsApi } from '../api/client';
import { ReelCard } from '../components/reels/ReelCard';
import { ReelCategoryNav } from '../components/reels/ReelCategoryNav';
import { ReelPlayerModal } from '../components/reels/ReelPlayerModal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Reels: React.FC = () => {
  useDocumentTitle('Reels & Motion Narratives');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [reels, setReels] = useState<ReelItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await reelsApi.getItems();
      setReels(items);
    } catch (err) {
      console.error('Failed to load motion reels:', err);
      setError(
        'Unable to load motion reels from the server. Please ensure the backend is running and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derive active reel from URL query param (?play=id)
  const activeReelId = searchParams.get('play');
  const activeReel = useMemo(() => {
    if (!activeReelId) return null;
    return reels.find((r) => r.id === activeReelId) || null;
  }, [activeReelId, reels]);

  const handleOpenReel = (reel: ReelItem) => {
    const next = new URLSearchParams(searchParams);
    next.set('play', reel.id);
    setSearchParams(next);
  };

  const handleCloseReel = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('play');
    setSearchParams(next);
  };

  const handleNavigateReel = (nextReel: ReelItem) => {
    const next = new URLSearchParams(searchParams);
    next.set('play', nextReel.id);
    setSearchParams(next);
  };

  // Filter reels by selected category
  const filteredReels = useMemo(() => {
    if (selectedCategory === 'all') return reels;
    return reels.filter((r) => r.category === selectedCategory);
  }, [selectedCategory, reels]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const reel of reels) {
      counts[reel.category] = (counts[reel.category] || 0) + 1;
    }
    return counts;
  }, [reels]);

  return (
    <div className="reels-page reveal-fade">
      <div className="container">
        {/* Header */}
        <header className="reels-header reveal-slide-up">
          <span className="reels-header-meta">02 · Motion Narratives</span>
          <h1 className="reels-header-title">Reels & Sequences</h1>
          <p className="reels-header-desc">
            Short-form cinematic cuts, on-set calibration logs, and high-elevation aerial
            perspectives framed for modern motion storytelling.
          </p>
        </header>

        {/* Category Navigation */}
        <ReelCategoryNav
          categories={reelCategories}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={categoryCounts}
          totalCount={reels.length}
        />

        {/* Loading State */}
        {isLoading && (
          <div
            style={{
              paddingBlock: 'var(--space-16)',
              textAlign: 'center',
              fontFamily: 'var(--font-accent)',
              letterSpacing: 'var(--tracking-widest)',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-sm)',
              textTransform: 'uppercase',
            }}
          >
            Loading motion sequences...
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div
            role="alert"
            style={{
              paddingBlock: 'var(--space-16)',
              textAlign: 'center',
              maxWidth: '540px',
              marginInline: 'auto',
            }}
          >
            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-6)',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              {error}
            </p>
            <button
              type="button"
              className="filter-btn active"
              onClick={loadData}
              style={{ marginInline: 'auto' }}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Spacious Video Grid */}
        {!isLoading && !error && (
          <div className="reels-grid">
            {filteredReels.map((reel) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                onSelect={handleOpenReel}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && filteredReels.length === 0 && (
          <div style={{ paddingBlock: 'var(--space-16)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              No reels found under this category.
            </p>
          </div>
        )}
      </div>

      {/* Focused Cinema Modal Player */}
      <ReelPlayerModal
        reel={activeReel}
        reels={filteredReels}
        onClose={handleCloseReel}
        onNavigate={handleNavigateReel}
      />
    </div>
  );
};
