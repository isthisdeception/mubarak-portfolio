import React, { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams, Navigate } from 'react-router-dom';
import {
  disciplinesData,
  portfolioItems,
} from '../data/portfolio';
import type {
  DisciplineId,
  PortfolioItem,
} from '../data/portfolio';
import { PortfolioItemCard } from '../components/portfolio/PortfolioItemCard';
import { CategoryFilter } from '../components/portfolio/CategoryFilter';
import { Lightbox } from '../components/portfolio/Lightbox';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const WorkDiscipline: React.FC = () => {
  const { discipline } = useParams<{ discipline: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const validDiscipline = (discipline || '') as DisciplineId;
  const meta = disciplinesData[validDiscipline];

  useDocumentTitle(meta ? `${meta.name} Archive` : 'Portfolio');

  // Items for this discipline (unconditional hook)
  const disciplineItems = useMemo(() => {
    if (!validDiscipline) return [];
    return portfolioItems.filter((i) => i.discipline === validDiscipline);
  }, [validDiscipline]);

  // Derive active lightbox item from URL query param (unconditional hook)
  const activeItemId = searchParams.get('item');
  const activeLightboxItem = useMemo(() => {
    if (!activeItemId) return null;
    return disciplineItems.find((item) => item.id === activeItemId) || null;
  }, [activeItemId, disciplineItems]);

  const handleOpenLightbox = (item: PortfolioItem) => {
    const next = new URLSearchParams(searchParams);
    next.set('item', item.id);
    setSearchParams(next);
  };

  const handleCloseLightbox = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('item');
    setSearchParams(next);
  };

  const handleNavigateLightbox = (nextItem: PortfolioItem) => {
    const next = new URLSearchParams(searchParams);
    next.set('item', nextItem.id);
    setSearchParams(next);
  };

  // Filtered by subcategory (unconditional hook)
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return disciplineItems;
    return disciplineItems.filter((i) => i.category === selectedCategory);
  }, [disciplineItems, selectedCategory]);

  // Category counts (unconditional hook)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of disciplineItems) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [disciplineItems]);

  // Other disciplines for navigation strip (unconditional hook)
  const otherDisciplines = useMemo(() => {
    return (Object.keys(disciplinesData) as DisciplineId[]).filter(
      (d) => d !== validDiscipline
    );
  }, [validDiscipline]);

  // If invalid discipline route, fallback to /work
  if (!meta) {
    return <Navigate to="/work" replace />;
  }

  return (
    <div className="work-page reveal-fade">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <Link to="/work" className="discipline-back-link">
          <span aria-hidden="true">←</span>
          <span>Return to Work Hub</span>
        </Link>

        {/* Discipline Header */}
        <header className="work-header reveal-slide-up">
          <span className="work-header-meta">Discipline Archive</span>
          <h1 className="work-header-title">{meta.name}</h1>
          <p className="work-header-desc">{meta.description}</p>
        </header>

        {/* Subcategory Filter Bar */}
        <div className="portfolio-filter-bar">
          <span
            style={{
              fontFamily: 'var(--font-accent)',
              fontSize: '0.7rem',
              letterSpacing: 'var(--tracking-widest)',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
          >
            Subcategories
          </span>

          <CategoryFilter
            categories={meta.categories}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            counts={categoryCounts}
            totalCount={disciplineItems.length}
          />
        </div>

        {/* Gallery Grid */}
        <div className="portfolio-grid">
          {filteredItems.map((item) => (
            <PortfolioItemCard
              key={item.id}
              item={item}
              onClick={handleOpenLightbox}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ paddingBlock: 'var(--space-16)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              No works available in this category yet.
            </p>
          </div>
        )}

        {/* Chapter Transition Strip */}
        <div className="discipline-nav-strip">
          <span
            style={{
              fontFamily: 'var(--font-accent)',
              fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
          >
            Explore Other Disciplines
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
            {otherDisciplines.map((otherId) => (
              <Link
                key={otherId}
                to={`/work/${otherId}`}
                className="discipline-nav-item"
              >
                {disciplinesData[otherId].name} →
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        item={activeLightboxItem}
        items={filteredItems}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigateLightbox}
      />
    </div>
  );
};
