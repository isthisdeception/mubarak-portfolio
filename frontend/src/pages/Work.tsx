import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { disciplinesData } from '../data/portfolio';
import type { DisciplineId, DisciplineMeta, PortfolioItem } from '../data/portfolio';
import { portfolioApi } from '../api/client';
import { PortfolioItemCard } from '../components/portfolio/PortfolioItemCard';
import { CategoryFilter } from '../components/portfolio/CategoryFilter';
import { Lightbox } from '../components/portfolio/Lightbox';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Work: React.FC = () => {
  useDocumentTitle('Archive & Selected Works');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // API State
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [disciplinesMap, setDisciplinesMap] =
    useState<Record<DisciplineId, DisciplineMeta>>(disciplinesData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedDisciplines, fetchedItems] = await Promise.all([
        portfolioApi.getDisciplines(),
        portfolioApi.getItems(),
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
      console.error('Failed to load portfolio archive:', err);
      setError(
        'Unable to load the visual archive from the server. Please ensure the backend is running and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derive active lightbox item directly from URL query param
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

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchDiscipline =
        selectedDiscipline === 'all' || item.discipline === selectedDiscipline;
      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      return matchDiscipline && matchCategory;
    });
  }, [items, selectedDiscipline, selectedCategory]);

  // Extract available categories based on selected discipline
  const availableCategories = useMemo(() => {
    if (selectedDiscipline === 'all') {
      return Array.from(new Set(items.map((i) => i.category)));
    }
    const meta = disciplinesMap[selectedDiscipline as DisciplineId];
    return meta ? meta.categories : [];
  }, [items, disciplinesMap, selectedDiscipline]);

  const handleSelectDiscipline = (disc: string) => {
    setSelectedDiscipline(disc);
    setSelectedCategory('all');
  };

  const photoCount = items.filter((i) => i.discipline === 'photography').length;
  const cineCount = items.filter((i) => i.discipline === 'cinematography').length;
  const droneCount = items.filter((i) => i.discipline === 'drone').length;

  return (
    <div className="work-page reveal-fade">
      <div className="container">
        {/* Header */}
        <header className="work-header reveal-slide-up">
          <span className="work-header-meta">01 · Portfolio Hub</span>
          <h1 className="work-header-title">The Archive</h1>
          <p className="work-header-desc">
            Visual works organized across three core disciplines: fine art still photography,
            anamorphic cinematography, and certified aerial drone cinema.
          </p>
        </header>

        {/* ==================================================================
            Three Discipline Entry Chapters (Image-Led, Book-Chapter Feel)
            ================================================================== */}
        <section className="discipline-chapters" aria-label="Discipline Chapters">
          {/* Chapter 01: Photography */}
          <Link
            to="/work/photography"
            className="discipline-chapter-card"
            aria-label="Explore Photography Archive"
          >
            <div className="chapter-info">
              <span className="chapter-number">Chapter 01 · Stillness</span>
              <h2 className="chapter-name">Photography</h2>
              <p className="chapter-tagline">{disciplinesMap.photography.description}</p>
              <span className="chapter-action">
                Enter Photography Archive ({photoCount} Works) →
              </span>
            </div>
            <div className="chapter-media">
              <img
                src={disciplinesMap.photography.heroImage}
                alt="Photography Chapter"
                className="chapter-img"
                loading="eager"
              />
            </div>
          </Link>

          {/* Chapter 02: Cinematography */}
          <Link
            to="/work/cinematography"
            className="discipline-chapter-card"
            aria-label="Explore Cinematography Archive"
          >
            <div className="chapter-info">
              <span className="chapter-number">Chapter 02 · Motion</span>
              <h2 className="chapter-name">Cinematography</h2>
              <p className="chapter-tagline">{disciplinesMap.cinematography.description}</p>
              <span className="chapter-action">
                Enter Cinematography Archive ({cineCount} Works) →
              </span>
            </div>
            <div className="chapter-media">
              <img
                src={disciplinesMap.cinematography.heroImage}
                alt="Cinematography Chapter"
                className="chapter-img"
                loading="lazy"
              />
            </div>
          </Link>

          {/* Chapter 03: Drone Operations */}
          <Link
            to="/work/drone"
            className="discipline-chapter-card"
            aria-label="Explore Drone Operations Archive"
          >
            <div className="chapter-info">
              <span className="chapter-number">Chapter 03 · Elevation</span>
              <h2 className="chapter-name">Drone Operations</h2>
              <p className="chapter-tagline">{disciplinesMap.drone.description}</p>
              <span className="chapter-action">
                Enter Aerial Archive ({droneCount} Works) →
              </span>
            </div>
            <div className="chapter-media">
              <img
                src={disciplinesMap.drone.heroImage}
                alt="Drone Chapter"
                className="chapter-img"
                loading="lazy"
              />
            </div>
          </Link>
        </section>

        {/* ==================================================================
            Unified Archive Gallery with Filtering
            ================================================================== */}
        <section className="portfolio-gallery-section" aria-label="Complete Curated Works">
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <span className="work-header-meta">Curated Works</span>
            <h2 className="selected-work-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
              Complete Visual Index
            </h2>
          </div>

          {/* Filter Bar */}
          <div className="portfolio-filter-bar">
            {/* Discipline Switcher */}
            <div className="filter-group" role="tablist" aria-label="Discipline filter">
              <button
                type="button"
                className={`filter-btn ${selectedDiscipline === 'all' ? 'active' : ''}`}
                onClick={() => handleSelectDiscipline('all')}
              >
                <span>All Disciplines</span>
                <span className="filter-count">({items.length})</span>
              </button>
              <button
                type="button"
                className={`filter-btn ${selectedDiscipline === 'photography' ? 'active' : ''}`}
                onClick={() => handleSelectDiscipline('photography')}
              >
                <span>Photography</span>
                <span className="filter-count">({photoCount})</span>
              </button>
              <button
                type="button"
                className={`filter-btn ${selectedDiscipline === 'cinematography' ? 'active' : ''}`}
                onClick={() => handleSelectDiscipline('cinematography')}
              >
                <span>Cinematography</span>
                <span className="filter-count">({cineCount})</span>
              </button>
              <button
                type="button"
                className={`filter-btn ${selectedDiscipline === 'drone' ? 'active' : ''}`}
                onClick={() => handleSelectDiscipline('drone')}
              >
                <span>Drone</span>
                <span className="filter-count">({droneCount})</span>
              </button>
            </div>

            {/* Subcategory Filter */}
            <CategoryFilter
              categories={availableCategories}
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              totalCount={
                selectedDiscipline === 'all'
                  ? items.length
                  : items.filter((i) => i.discipline === selectedDiscipline).length
              }
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
              Loading curated works...
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

          {/* Spacious Gallery Grid */}
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
                No works found in this selection.
              </p>
            </div>
          )}
        </section>
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
