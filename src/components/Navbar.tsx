import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { siteData } from '../data/site';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
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
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div
        className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
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
            className="mobile-nav-toggle"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
          >
            Close
          </button>
        </div>

        <nav className="mobile-nav-body" aria-label="Mobile navigation links">
          {siteData.navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
              }
              onClick={() => setIsOpen(false)}
            >
              {item.label}
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
    </header>
  );
};
