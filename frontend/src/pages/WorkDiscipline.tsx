import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams, Navigate } from 'react-router-dom';
import { disciplinesData } from '../data/portfolio';
import type { DisciplineId, DisciplineMeta, PortfolioItem } from '../data/portfolio';
import { portfolioApi } from '../api/client';
import { PortfolioItemCard } from '../components/portfolio/PortfolioItemCard';
import { CategoryFilter } from '../components/portfolio/CategoryFilter';
import { Lightbox } from '../components/portfolio/Lightbox';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const WorkDiscipline: React.FC = () => {
  const { discipline } = useParams<{ discipline: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const validDiscipline = (discipline || '') as DisciplineId;
  const isKnownDiscipline = validDiscipline in disciplinesData;

  // API State
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [disciplinesMap, setDisciplinesMap] =
    useState<Record<DisciplineId, DisciplineMeta>>(disciplinesData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const meta = isKnownDiscipline ? disciplinesMap[validDiscipline] : null;

  useDocumentTitle(meta ? `${meta.name} Archive` : 'Portfolio');

  const loadData = useCallback(async () => {
    if (!validDiscipline || !isKnownDiscipline) return;
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedDisciplines, fetchedItems] = await Promise.all([
        portfolioApi.getDisciplines(),
        portfolioApi.getItems({ discipline: validDiscipline }),
      ]);

      const map = { ...disciplinesData };
      for (const disc of fetchedDisciplines) {
        if (disc.id in map) {
          map[disc.id as DisciplineId] = disc;
        }
      }
      setDisciplinesMap(map);
      setItems(fetchedItems);
    } catch (err) {
      console.error(`Failed to load ${validDiscipline} archive:`, err);
      setError(
        'Unable to load the discipline archive from the server. Please ensure the backend is running and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [validDiscipline, isKnownDiscipline]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derive active lightbox item from URL query param
  const activeItemId = searchParams.get('item');
  const activeLightboxItem = useMemo(() => {
    if (!activeItemId) return null;
    return items.find((item) => item.id === activeItemId) || null;
  }, [activeItemId, items]);

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

  // Filtered by subcategory
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter((i) => i.category === selectedCategory);
  }, [items, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [items]);

  // Other disciplines for navigation strip
  const otherDisciplines = useMemo(() => {
    return (Object.keys(disciplinesMap) as DisciplineId[]).filter(
      (d) => d !== validDiscipline
    );
  }, [disciplinesMap, validDiscipline]);

  // If invalid discipline route, fallback to /work
  if (!isKnownDiscipline || !meta) {
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
            totalCount={items.length}
          />
        </div>

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
            Loading {meta.name} archive...
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

        {/* Gallery Grid */}
        {!isLoading && !error && (
          <div className="portfolio-grid">
            {filteredItems.map((item) => (
              <PortfolioItemCard
                key={item.id}
                item={item}
                onClick={handleOpenLightbox}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && filteredItems.length === 0 && (
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
            Continue Exploring
          </span>

          <div className="discipline-nav-buttons">
            {otherDisciplines.map((d) => (
              <Link
                key={d}
                to={`/work/${d}`}
                className="discipline-nav-link"
              >
                <span>{disciplinesMap[d]?.name || d}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox for Stills & Motion Posters */}
      <Lightbox
        item={activeLightboxItem}
        items={filteredItems}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigateLightbox}
      />
    </div>
  );
};
