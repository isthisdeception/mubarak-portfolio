import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { journalPosts, journalCategories } from '../data/journal';
import type { JournalPost } from '../data/journal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Journal: React.FC = () => {
  useDocumentTitle('Field Journal & Notes');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return journalPosts;
    return journalPosts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of journalPosts) {
      counts[post.category] = (counts[post.category] || 0) + 1;
    }
    return counts;
  }, []);

  const featuredPost: JournalPost | undefined = filteredPosts[0];
  const secondaryPosts: JournalPost[] = filteredPosts.slice(1);

  return (
    <div className="journal-page reveal-fade">
      <div className="container">
        {/* Header */}
        <header className="journal-header reveal-slide-up">
          <span className="journal-meta">05 · Field Journal & Notes</span>
          <h1 className="journal-title">The Journal</h1>
          <p className="journal-desc">
            Field notes on optical character, location scout chronicles, and reflections
            on the philosophy of the cinematic frame.
          </p>
        </header>

        {/* Category Filter Bar */}
        <nav className="journal-filter-bar" aria-label="Journal category filter">
          <button
            type="button"
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <span>All Entries</span>
            <span className="filter-count">({journalPosts.length})</span>
          </button>

          {journalCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
              {categoryCounts[cat] !== undefined && (
                <span className="filter-count">({categoryCounts[cat]})</span>
              )}
            </button>
          ))}
        </nav>

        {/* Editorial Journal Flow */}
        <div className="journal-flow">
          {/* Featured Post */}
          {featuredPost && (
            <Link
              to={`/journal/${featuredPost.slug}`}
              className="journal-item-featured"
              aria-label={`Read ${featuredPost.title}`}
            >
              <div className="journal-featured-media">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.coverAlt}
                  className="journal-card-img"
                  loading="eager"
                />
              </div>

              <div className="journal-featured-content">
                <div className="journal-tag-row">
                  <span className="journal-category-tag">{featuredPost.category}</span>
                  <span>·</span>
                  <span>{featuredPost.readTime}</span>
                  <span>·</span>
                  <span>{featuredPost.date}</span>
                </div>

                <h2 className="journal-card-title">{featuredPost.title}</h2>
                <p className="journal-card-excerpt">{featuredPost.excerpt}</p>

                <span className="journal-read-link">
                  Read Journal Entry <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          )}

          {/* Secondary Posts Grid */}
          {secondaryPosts.length > 0 && (
            <div className="journal-grid-secondary">
              {secondaryPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/journal/${post.slug}`}
                  className="journal-item-standard"
                  aria-label={`Read ${post.title}`}
                >
                  <div className="journal-standard-media">
                    <img
                      src={post.coverImage}
                      alt={post.coverAlt}
                      className="journal-card-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="journal-tag-row">
                    <span className="journal-category-tag">{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="journal-card-title" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.95rem)' }}>
                    {post.title}
                  </h3>

                  <p className="journal-card-excerpt">{post.excerpt}</p>

                  <span className="journal-read-link">
                    Read Entry <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          {filteredPosts.length === 0 && (
            <div style={{ paddingBlock: 'var(--space-16)', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                No journal entries found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
