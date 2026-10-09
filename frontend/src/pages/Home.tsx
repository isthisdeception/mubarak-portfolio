import React from 'react';
import { Link } from 'react-router-dom';
import { homeData } from '../data/home';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Home: React.FC = () => {
  useDocumentTitle();
  const { heroMedia, selectedWorks, selectedWorksSection } = homeData;

  // Split selected works for asymmetric editorial presentation
  const featuredFirst = selectedWorks[0];
  const pairItems = [selectedWorks[1], selectedWorks[2]];
  const wideItem = selectedWorks[3];
  const singleItem = selectedWorks[4];

  return (
    <div className="home-page reveal-fade">
      {/* ====================================================================
          Cinematic Hero Section (Full-Bleed Atmospheric Canvas)
          ==================================================================== */}
      <section className="home-hero-cinematic" aria-label="Introduction & Hero">
        {/* Full-bleed atmospheric background image */}
        <div className="hero-backdrop-media">
          <img
            src={heroMedia.url}
            alt={heroMedia.alt}
            className="hero-backdrop-img"
            loading="eager"
          />
          <div className="hero-vignette-overlay" aria-hidden="true" />
        </div>

        {/* Floating cinematic content overlay */}
        <div className="container hero-cinematic-content">
          {/* Top Row: Coordinates on Left, Reel Tag on Right */}
          <div className="hero-top-row reveal-fade">
            <span className="hero-coordinates">{homeData.coordinates}</span>
            <Link to="/reels" className="hero-reel-badge" aria-label="Explore Reels">
              <span className="hero-reel-dot" aria-hidden="true" />
              <span>{homeData.reelTag}</span>
            </Link>
          </div>

          {/* Bottom Row: Identity on Left, View Work on Right */}
          <div className="hero-bottom-row reveal-slide-up">
            <div className="hero-title-group">
              <span className="hero-role-tag">{homeData.roleTag}</span>
              <h1 className="hero-main-name">{homeData.displayName}</h1>
            </div>

            <div className="hero-view-work-group">
              <Link to={homeData.ctaTarget} className="hero-view-work-link">
                <span>{homeData.ctaLabel}</span>
                <span aria-hidden="true">→</span>
              </Link>
              <span className="hero-portfolio-sub">{homeData.ctaSubLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          Selected Work Section (Spacious Editorial Flow)
          ==================================================================== */}
      <section className="home-selected-work" aria-label="Selected Works">
        <div className="container">
          {/* Section Header */}
          <div className="selected-work-header">
            <div className="selected-work-meta-title">
              <span className="selected-work-index">
                {selectedWorksSection.indexLabel}
              </span>
              <h2 className="selected-work-title">
                {selectedWorksSection.title}
              </h2>
              <p className="selected-work-desc">
                {selectedWorksSection.description}
              </p>
            </div>

            <Link to="/work" className="selected-work-view-all">
              <span>View Full Archive</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Asymmetric Editorial Flow */}
          <div className="editorial-flow">
            {/* 1. Large Heroic Piece */}
            {featuredFirst && (
              <Link
                to={featuredFirst.linkTarget}
                className="editorial-item-heroic"
                aria-label={`View ${featuredFirst.title} in portfolio`}
              >
                <div className="work-image-frame">
                  <img
                    src={featuredFirst.imageUrl}
                    alt={featuredFirst.title}
                    className="work-item-img"
                    loading="lazy"
                  />
                </div>
                <div className="work-item-caption">
                  <div className="work-item-caption-header">
                    <h3 className="work-item-title">{featuredFirst.title}</h3>
                    <span className="work-item-year">{featuredFirst.year}</span>
                  </div>
                  <div className="work-item-meta">
                    <span className="work-item-discipline">
                      {featuredFirst.discipline} · {featuredFirst.category}
                    </span>
                    <span>{featuredFirst.location}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* 2 & 3. Asymmetric 2-Column Pair */}
            {pairItems.length === 2 && (
              <div className="editorial-pair-grid">
                {/* Left Item */}
                <Link
                  to={pairItems[0].linkTarget}
                  className="editorial-item-standard"
                  aria-label={`View ${pairItems[0].title} in portfolio`}
                >
                  <div className="work-image-frame">
                    <img
                      src={pairItems[0].imageUrl}
                      alt={pairItems[0].title}
                      className="work-item-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="work-item-caption">
                    <div className="work-item-caption-header">
                      <h3 className="work-item-title">{pairItems[0].title}</h3>
                      <span className="work-item-year">{pairItems[0].year}</span>
                    </div>
                    <div className="work-item-meta">
                      <span className="work-item-discipline">
                        {pairItems[0].discipline} · {pairItems[0].category}
                      </span>
                      <span>{pairItems[0].location}</span>
                    </div>
                  </div>
                </Link>

                {/* Right Item (Offset down) */}
                <Link
                  to={pairItems[1].linkTarget}
                  className="editorial-item-standard editorial-pair-offset"
                  aria-label={`View ${pairItems[1].title} in portfolio`}
                >
                  <div className="work-image-frame">
                    <img
                      src={pairItems[1].imageUrl}
                      alt={pairItems[1].title}
                      className="work-item-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="work-item-caption">
                    <div className="work-item-caption-header">
                      <h3 className="work-item-title">{pairItems[1].title}</h3>
                      <span className="work-item-year">{pairItems[1].year}</span>
                    </div>
                    <div className="work-item-meta">
                      <span className="work-item-discipline">
                        {pairItems[1].discipline} · {pairItems[1].category}
                      </span>
                      <span>{pairItems[1].location}</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* 4. Wide Panoramic Frame */}
            {wideItem && (
              <Link
                to={wideItem.linkTarget}
                className="editorial-item-heroic"
                aria-label={`View ${wideItem.title} in portfolio`}
              >
                <div className="work-image-frame" style={{ height: 'clamp(320px, 50vh, 560px)' }}>
                  <img
                    src={wideItem.imageUrl}
                    alt={wideItem.title}
                    className="work-item-img"
                    loading="lazy"
                  />
                </div>
                <div className="work-item-caption">
                  <div className="work-item-caption-header">
                    <h3 className="work-item-title">{wideItem.title}</h3>
                    <span className="work-item-year">{wideItem.year}</span>
                  </div>
                  <div className="work-item-meta">
                    <span className="work-item-discipline">
                      {wideItem.discipline} · {wideItem.category}
                    </span>
                    <span>{wideItem.location}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* 5. Asymmetric Architectural Frame */}
            {singleItem && (
              <div className="editorial-asymmetric-single">
                <div style={{ maxWidth: '420px' }}>
                  <span className="selected-work-index" style={{ marginBottom: 'var(--space-3)' }}>
                    Perspective
                  </span>
                  <h3 className="work-item-title" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', marginBottom: 'var(--space-3)' }}>
                    {singleItem.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                    Capturing monolithic geometry and architectural contrast through natural shadows and spatial rhythm.
                  </p>
                  <Link to="/work" className="btn btn-secondary btn-sm">
                    Explore Discipline →
                  </Link>
                </div>

                <Link
                  to={singleItem.linkTarget}
                  className="editorial-item-standard"
                  aria-label={`View ${singleItem.title} in portfolio`}
                >
                  <div className="work-image-frame">
                    <img
                      src={singleItem.imageUrl}
                      alt={singleItem.title}
                      className="work-item-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="work-item-caption">
                    <div className="work-item-meta">
                      <span className="work-item-discipline">
                        {singleItem.discipline} · {singleItem.category}
                      </span>
                      <span>{singleItem.location} · {singleItem.year}</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Quiet Section Footer */}
          <div className="selected-work-footer">
            <p className="selected-work-footer-text">
              Visual narratives available for worldwide commission across photography, cinematography, and drone operations.
            </p>
            <div className="selected-work-footer-actions">
              <Link to="/work" className="btn btn-primary btn-md">
                Browse Full Portfolio
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-md">
                Initiate Project Dialogue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
