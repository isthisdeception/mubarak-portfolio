import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { journalCategories } from '../data/journal';
import type { JournalPost } from '../data/journal';
import { journalApi } from '../api/client';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Journal: React.FC = () => {
  useDocumentTitle('Field Journal & Notes');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await journalApi.getItems();
      setPosts(items);
    } catch (err) {
      console.error('Failed to load journal posts:', err);
      setError(
        'Unable to load journal entries from the server. Please ensure the backend is running and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory, posts]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      counts[post.category] = (counts[post.category] || 0) + 1;
    }
    return counts;
  }, [posts]);

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
            <span className="filter-count">({posts.length})</span>
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
            Loading journal entries...
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

        {/* Editorial Journal Flow */}
        {!isLoading && !error && (
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

            {/* Secondary 2-Column Grid */}
            {secondaryPosts.length > 0 && (
              <div className="journal-grid-secondary">
                {secondaryPosts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/journal/${post.slug}`}
                    className="journal-card-standard"
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

                    <div className="journal-standard-content">
                      <div className="journal-tag-row">
                        <span className="journal-category-tag">{post.category}</span>
                        <span>·</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="journal-standard-title">{post.title}</h3>
                      <p className="journal-standard-excerpt">{post.excerpt}</p>

                      <div className="journal-date-row">
                        <span>{post.date}</span>
                        <span className="journal-read-link">Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {filteredPosts.length === 0 && (
              <div style={{ paddingBlock: 'var(--space-16)', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  No field notes recorded in this category yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
