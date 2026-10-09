import React from 'react';
import type { ReelCategory } from '../../data/reels';

export interface ReelCategoryNavProps {
  categories: ReelCategory[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  counts?: Record<string, number>;
  totalCount: number;
}

export const ReelCategoryNav: React.FC<ReelCategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  counts,
  totalCount,
}) => {
  return (
    <nav className="reels-filter-bar" aria-label="Reel category filter">
      <button
        type="button"
        className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
        onClick={() => onSelectCategory('all')}
      >
        <span>All Reels</span>
        <span className="filter-count">({totalCount})</span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat)}
        >
          <span>{cat}</span>
          {counts && counts[cat] !== undefined && (
            <span className="filter-count">({counts[cat]})</span>
          )}
        </button>
      ))}
    </nav>
  );
};
