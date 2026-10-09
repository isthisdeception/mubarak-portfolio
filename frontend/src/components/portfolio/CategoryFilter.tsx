import React from 'react';

export interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  counts?: Record<string, number>;
  totalCount?: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  counts,
  totalCount,
}) => {
  return (
    <div className="filter-group" role="tablist" aria-label="Portfolio categories">
      <button
        type="button"
        role="tab"
        aria-selected={activeCategory === 'all'}
        className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
        onClick={() => onSelectCategory('all')}
      >
        <span>All</span>
        {totalCount !== undefined && (
          <span className="filter-count">({totalCount})</span>
        )}
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={activeCategory === cat}
          className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat)}
        >
          <span>{cat}</span>
          {counts && counts[cat] !== undefined && (
            <span className="filter-count">({counts[cat]})</span>
          )}
        </button>
      ))}
    </div>
  );
};
