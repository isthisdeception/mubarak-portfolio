import React from 'react';
import { Link } from 'react-router-dom';
import { aboutData } from '../data/about';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const About: React.FC = () => {
  useDocumentTitle('About & Creative Philosophy');
  const { portrait, intro, philosophy, skills, equipment, professionalNotes } = aboutData;

  return (
    <div className="about-page reveal-fade">
      <div className="container">
        {/* ==================================================================
            Section 1: Editorial Profile & Visual Anchor
            ================================================================== */}
        <section className="about-hero-section reveal-slide-up" aria-label="Profile and Introduction">
          <div className="about-profile-grid">
            {/* Left: Introduction & Headline */}
            <div className="about-intro-col">
              <div>
                <span className="about-meta">03 · Biography & Profile</span>
                <h1 className="about-name">{aboutData.name}</h1>
                <span className="about-role-sub">{aboutData.role}</span>
              </div>

              <h2 className="about-headline">{intro.headline}</h2>

              <div className="about-body-text">
                {intro.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary btn-md">
                  Inquire for Booking →
                </Link>
                <Link to="/work" className="btn btn-secondary btn-md">
                  Browse Works
                </Link>
              </div>
            </div>

            {/* Right: Large Portrait Visual Anchor */}
            <div className="about-portrait-col">
              <div className="about-portrait-frame">
                <img
                  src={portrait.src}
                  alt={portrait.alt}
                  className="about-portrait-img"
                  loading="eager"
                />
              </div>
              <p className="about-portrait-caption">{portrait.caption}</p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            Section 2: Creative Philosophy (Tenets)
            ================================================================== */}
        <section className="about-philosophy-section" aria-label="Creative Philosophy">
          <div className="philosophy-header">
            <span className="philosophy-title">{philosophy.title}</span>
            <blockquote className="philosophy-statement">
              “{philosophy.statement}”
            </blockquote>
          </div>

          <div className="philosophy-tenets-grid">
            {philosophy.tenets.map((tenet) => (
              <div key={tenet.number} className="tenet-card">
                <span className="tenet-number">Principle {tenet.number}</span>
                <h3 className="tenet-title">{tenet.title}</h3>
                <p className="tenet-desc">{tenet.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            Section 3: Disciplines & Craft (Typography-First, No Pills)
            ================================================================== */}
        <section className="about-skills-section" aria-label="Disciplines and Craft">
          <div className="skills-header">
            <span className="philosophy-title">Mastery & Capabilities</span>
            <h2 className="selected-work-title" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              {skills.title}
            </h2>
          </div>

          <div className="skills-grid">
            {skills.list.map((skill, idx) => (
              <div key={idx} className="skill-row">
                <span>{skill}</span>
                <span className="skill-bullet" aria-hidden="true">✦</span>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            Section 4: Production Craft & Camera Equipment
            ================================================================== */}
        <section className="about-equipment-section" aria-label="Camera and Production Equipment">
          <div className="equipment-header">
            <span className="philosophy-title">Technical Inventory</span>
            <h2 className="selected-work-title" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              {equipment.title}
            </h2>
            <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', marginTop: 'var(--space-2)' }}>
              {equipment.description}
            </p>
          </div>

          <div className="equipment-grid">
            {equipment.categories.map((cat, idx) => (
              <div key={idx} className="equipment-group">
                <h3 className="equipment-group-title">{cat.group}</h3>
                <ul className="equipment-list">
                  {cat.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="equipment-item">
                      — {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            Section 5: Professional Notes & Collaboration CTA
            ================================================================== */}
        <section className="about-notes-section" aria-label="Professional Details">
          <div className="notes-grid">
            {professionalNotes.map((note, idx) => (
              <div key={idx} className="note-item">
                <span className="note-label">{note.label}</span>
                <span className="note-value">{note.value}</span>
              </div>
            ))}
          </div>

          <div className="about-footer-cta">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 300, color: 'var(--color-text-primary)' }}>
              Ready to create something deliberate?
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', maxWidth: '520px', lineHeight: 'var(--leading-relaxed)' }}>
              Accepting editorial commissions, cinema projects, and aerial surveying globally.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/contact" className="btn btn-primary btn-md">
                Start a Conversation →
              </Link>
              <Link to="/services" className="btn btn-secondary btn-md">
                Explore Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
