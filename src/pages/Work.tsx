import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  portfolioItems,
  disciplinesData,
} from '../data/portfolio';
import type {
  DisciplineId,
  PortfolioItem,
} from '../data/portfolio';
import { PortfolioItemCard } from '../components/portfolio/PortfolioItemCard';
import { CategoryFilter } from '../components/portfolio/CategoryFilter';
import { Lightbox } from '../components/portfolio/Lightbox';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Work: React.FC = () => {
  useDocumentTitle('Archive & Selected Works');
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Derive active lightbox item directly from URL query param
  const activeItemId = searchParams.get('item');
  const activeLightboxItem = useMemo(() => {
    if (!activeItemId) return null;
    return portfolioItems.find((item) => item.id === activeItemId) || null;
  }, [activeItemId]);

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
    return portfolioItems.filter((item) => {
      const matchDiscipline =
        selectedDiscipline === 'all' || item.discipline === selectedDiscipline;
      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      return matchDiscipline && matchCategory;
    });
  }, [selectedDiscipline, selectedCategory]);

  // Extract available categories based on selected discipline
  const availableCategories = useMemo(() => {
    if (selectedDiscipline === 'all') {
      return Array.from(new Set(portfolioItems.map((i) => i.category)));
    }
    const meta = disciplinesData[selectedDiscipline as DisciplineId];
    return meta ? meta.categories : [];
  }, [selectedDiscipline]);

  const handleSelectDiscipline = (disc: string) => {
    setSelectedDiscipline(disc);
    setSelectedCategory('all');
  };

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
              <p className="chapter-tagline">{disciplinesData.photography.description}</p>
              <span className="chapter-action">
                Enter Photography Archive ({portfolioItems.filter((i) => i.discipline === 'photography').length} Works) →
              </span>
            </div>
            <div className="chapter-media">
              <img
                src={disciplinesData.photography.heroImage}
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
              <p className="chapter-tagline">{disciplinesData.cinematography.description}</p>
              <span className="chapter-action">
                Enter Cinematography Archive ({portfolioItems.filter((i) => i.discipline === 'cinematography').length} Works) →
              </span>
            </div>
            <div className="chapter-media">
              <img
                src={disciplinesData.cinematography.heroImage}
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
              <p className="chapter-tagline">{disciplinesData.drone.description}</p>
              <span className="chapter-action">
                Enter Aerial Archive ({portfolioItems.filter((i) => i.discipline === 'drone').length} Works) →
              </span>
            </div>
            <div className="chapter-media">
              <img
                src={disciplinesData.drone.heroImage}
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
                <span className="filter-count">({portfolioItems.length})</span>
              </button>
              <button
                type="button"
                className={`filter-btn ${selectedDiscipline === 'photography' ? 'active' : ''}`}
                onClick={() => handleSelectDiscipline('photography')}
              >
                <span>Photography</span>
                <span className="filter-count">
                  ({portfolioItems.filter((i) => i.discipline === 'photography').length})
                </span>
              </button>
              <button
                type="button"
                className={`filter-btn ${selectedDiscipline === 'cinematography' ? 'active' : ''}`}
                onClick={() => handleSelectDiscipline('cinematography')}
              >
                <span>Cinematography</span>
                <span className="filter-count">
                  ({portfolioItems.filter((i) => i.discipline === 'cinematography').length})
                </span>
              </button>
              <button
                type="button"
                className={`filter-btn ${selectedDiscipline === 'drone' ? 'active' : ''}`}
                onClick={() => handleSelectDiscipline('drone')}
              >
                <span>Drone</span>
                <span className="filter-count">
                  ({portfolioItems.filter((i) => i.discipline === 'drone').length})
                </span>
              </button>
            </div>

            {/* Subcategory Filter */}
            <CategoryFilter
              categories={availableCategories}
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              totalCount={
                selectedDiscipline === 'all'
                  ? portfolioItems.length
                  : portfolioItems.filter((i) => i.discipline === selectedDiscipline).length
              }
            />
          </div>

          {/* Spacious Gallery Grid */}
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
