import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { siteData } from '../data/site';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Prevent background scrolling when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  const overlayContent = (
    <div
      id="mobile-nav-menu"
      className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className="mobile-nav-inner container">
        <div className="mobile-nav-header">
          <Link
            to="/"
            className="site-brand"
            onClick={() => setIsOpen(false)}
            aria-label={`${siteData.name} - Home`}
          >
            <span className="brand-name">{siteData.name}</span>
            <span className="brand-sub">Visuals</span>
          </Link>
          <button
            type="button"
            className="mobile-nav-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
          >
            <span>Close</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </button>
        </div>

        <nav className="mobile-nav-body" aria-label="Mobile navigation links">
          {siteData.navItems.map((item, idx) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="mobile-nav-index">0{idx + 1}</span>
              <span className="mobile-nav-label">{item.label}</span>
              <span className="mobile-nav-arrow" aria-hidden="true">→</span>
            </NavLink>
          ))}
        </nav>

        <div className="mobile-nav-footer">
          <div className="availability-pill">
            <span className="availability-dot" aria-hidden="true" />
            <span>{siteData.location}</span>
          </div>
          <div className="mobile-socials">
            {siteData.socialLinks.map((soc) => (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {soc.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="site-header" role="banner">
        <div className="container header-container">
          {/* Brand */}
          <Link to="/" className="site-brand" aria-label={`${siteData.name} - Home`}>
            <span className="brand-name">{siteData.name}</span>
            <span className="brand-sub">Visuals</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            {siteData.navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Status / Header Right */}
          <div className="header-actions">
            <div className="availability-pill" title="Current Booking Status">
              <span className="availability-dot" aria-hidden="true" />
              <span>{siteData.location}</span>
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <button
            type="button"
            className="mobile-nav-toggle"
            aria-expanded={isOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span>{isOpen ? 'Close' : 'Menu'}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {isOpen ? (
                <>
                  <line x1="3" y1="3" x2="13" y2="13" />
                  <line x1="13" y1="3" x2="3" y2="13" />
                </>
              ) : (
                <>
                  <line x1="2" y1="5" x2="14" y2="5" />
                  <line x1="2" y1="11" x2="14" y2="11" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Render mobile overlay portal outside header so backdrop-filter cannot constrain it */}
      {typeof document !== 'undefined' ? createPortal(overlayContent, document.body) : null}
    </>
  );
};

