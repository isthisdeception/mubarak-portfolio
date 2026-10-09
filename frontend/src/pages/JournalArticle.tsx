import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { journalPosts } from '../data/journal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const JournalArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const currentPostIndex = useMemo(() => {
    return journalPosts.findIndex((p) => p.slug === slug);
  }, [slug]);

  const post = currentPostIndex !== -1 ? journalPosts[currentPostIndex] : null;

  useDocumentTitle(post ? post.title : 'Entry Not Found');

  // Previous & Next posts for footer navigation
  const prevPost = currentPostIndex > 0 ? journalPosts[currentPostIndex - 1] : null;
  const nextPost =
    currentPostIndex !== -1 && currentPostIndex < journalPosts.length - 1
      ? journalPosts[currentPostIndex + 1]
      : null;

  if (!post) {
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

          {content.bodyParagraphs.map((para, idx) => (
            <p key={idx} className="article-body-p">
              {para}
            </p>
          ))}

          {content.technicalNote && (
            <aside className="article-technical-box" aria-label="Technical note">
              <span className="technical-box-header">Field Optics & Exposure</span>
              <p className="technical-box-text">{content.technicalNote}</p>
            </aside>
          )}

          {content.takeaway && (
            <div
              style={{
                marginTop: 'var(--space-4)',
                paddingTop: 'var(--space-6)',
                borderTop: '1px solid var(--color-border-subtle)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-accent)',
                  fontSize: '0.7rem',
                  letterSpacing: 'var(--tracking-widest)',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                }}
              >
                Core Observation
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  color: 'var(--color-text-primary)',
                  marginTop: 'var(--space-2)',
                  fontStyle: 'italic',
                }}
              >
                {content.takeaway}
              </p>
            </div>
          )}
        </div>

        {/* Footer Article Navigation */}
        <nav className="article-footer-nav" aria-label="Adjacent articles">
          <div>
            {prevPost ? (
              <Link
                to={`/journal/${prevPost.slug}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <span style={{ fontFamily: 'var(--font-accent)', fontSize: '0.68rem', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  ← Previous Entry
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>

          <div>
            {nextPost && (
              <Link
                to={`/journal/${nextPost.slug}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}
              >
                <span style={{ fontFamily: 'var(--font-accent)', fontSize: '0.68rem', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  Next Entry →
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
                  {nextPost.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </article>
  );
};
