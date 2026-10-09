import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  reelsData,
  reelCategories,
} from '../data/reels';
import type {
  ReelItem,
} from '../data/reels';
import { ReelCard } from '../components/reels/ReelCard';
import { ReelCategoryNav } from '../components/reels/ReelCategoryNav';
import { ReelPlayerModal } from '../components/reels/ReelPlayerModal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Reels: React.FC = () => {
  useDocumentTitle('Reels & Motion Narratives');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Derive active reel from URL query param (?play=id)
  const activeReelId = searchParams.get('play');
  const activeReel = useMemo(() => {
    if (!activeReelId) return null;
    return reelsData.find((r) => r.id === activeReelId) || null;
  }, [activeReelId]);

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
    if (selectedCategory === 'all') return reelsData;
    return reelsData.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const reel of reelsData) {
      counts[reel.category] = (counts[reel.category] || 0) + 1;
    }
    return counts;
  }, []);

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
          totalCount={reelsData.length}
        />

        {/* Spacious Video Grid */}
        <div className="reels-grid">
          {filteredReels.map((reel) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              onSelect={handleOpenReel}
            />
          ))}
        </div>

        {filteredReels.length === 0 && (
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
