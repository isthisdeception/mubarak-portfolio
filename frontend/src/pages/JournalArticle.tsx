import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { JournalPost } from '../data/journal';
import { journalApi } from '../api/client';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const JournalArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<JournalPost | null>(null);
  const [allPosts, setAllPosts] = useState<JournalPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useDocumentTitle(post ? post.title : isNotFound ? 'Entry Not Found' : 'Journal');

  const loadArticle = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    setIsNotFound(false);
    try {
      const [articleData, listData] = await Promise.all([
        journalApi.getItemBySlug(slug),
        journalApi.getItems(),
      ]);
      setPost(articleData);
      setAllPosts(listData);
    } catch (err: unknown) {
      const apiErr = err as { status?: number };
      if (apiErr?.status === 404) {
        setIsNotFound(true);
      } else {
        console.error('Failed to load article:', err);
        setError('Unable to load article content from the server. Please verify your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  // Previous & Next posts for footer navigation
  const { prevPost, nextPost } = useMemo(() => {
    const currentIndex = allPosts.findIndex((p) => p.slug === slug);
    return {
      prevPost: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
      nextPost:
        currentIndex !== -1 && currentIndex < allPosts.length - 1
          ? allPosts[currentIndex + 1]
          : null,
    };
  }, [allPosts, slug]);

  // Loading State
  if (isLoading) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-24)', textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--font-accent)',
            fontSize: 'var(--text-sm)',
            letterSpacing: 'var(--tracking-widest)',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
          }}
        >
          Retrieving journal entry...
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-24)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          {error}
        </p>
        <button type="button" className="filter-btn active" onClick={loadArticle}>
          Retry
        </button>
      </div>
    );
  }

  // 404 Not Found State
  if (isNotFound || !post) {
    return (
      <div className="container page-placeholder">
        <div className="page-placeholder-inner">
          <span className="page-placeholder-meta">404 · Unrecorded</span>
          <h1 className="page-placeholder-title">Entry Not Found</h1>
          <p className="page-placeholder-desc">
            The journal entry you are looking for has not been written or has been relocated.
          </p>
          <div style={{ marginTop: 'var(--space-8)' }}>
            <Link to="/journal" className="btn btn-secondary btn-md">
              ← Return to Journal Archive
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { content } = post;

  return (
    <article className="article-page reveal-fade">
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <Link to="/journal" className="discipline-back-link">
            <span aria-hidden="true">←</span>
            <span>Return to Journal Archive</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="article-header reveal-slide-up">
          <span className="journal-category-tag" style={{ fontSize: '0.75rem' }}>
            {post.category} · {post.readTime}
          </span>
          <h1 className="article-title">{post.title}</h1>
          <div className="article-meta-row">
            <span>{post.date}</span>
            {post.location && (
              <>
                <span>·</span>
                <span>{post.location}</span>
              </>
            )}
          </div>
        </header>

        {/* Hero Cover Frame */}
        <div className="article-cover-frame">
          <img
            src={post.coverImage}
            alt={post.coverAlt}
            className="article-cover-img"
            loading="eager"
          />
        </div>

        {/* Long-Form Reading Container (~70ch) */}
        <div className="article-content-container">
          <p className="article-lead">{content.introParagraph}</p>

          {content.quote && (
            <blockquote className="article-blockquote">
              <p className="article-quote-text">“{content.quote}”</p>
              {content.quoteAuthor && (
                <cite className="article-quote-author">
                  — {content.quoteAuthor}
                </cite>
              )}
            </blockquote>
          )}

          {content.bodyParagraphs?.map((para, idx) => (
            <p key={idx} className="article-body-p">
              {para}
            </p>
          ))}

          {/* Technical Note Accent Callout */}
          {content.technicalNote && (
            <div className="article-tech-note">
              <span className="article-tech-label">Technical Observation</span>
              <p className="article-tech-text">{content.technicalNote}</p>
            </div>
          )}

          {/* Philosophical Takeaway Footer */}
          {content.takeaway && (
            <div className="article-takeaway">
              <span className="article-takeaway-label">Field Reflection</span>
              <p className="article-takeaway-text">{content.takeaway}</p>
            </div>
          )}
        </div>

        {/* Previous / Next Entry Navigation Bar */}
        <nav className="article-footer-nav" aria-label="Adjacent journal entries">
          {prevPost ? (
            <Link
              to={`/journal/${prevPost.slug}`}
              className="article-nav-card article-nav-prev"
            >
              <span className="article-nav-direction">← Previous Entry</span>
              <span className="article-nav-title">{prevPost.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextPost && (
            <Link
              to={`/journal/${nextPost.slug}`}
              className="article-nav-card article-nav-next"
            >
              <span className="article-nav-direction">Next Entry →</span>
              <span className="article-nav-title">{nextPost.title}</span>
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
};
