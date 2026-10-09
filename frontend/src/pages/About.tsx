import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { aboutData as initialAboutData } from '../data/about';
import type { AboutData } from '../data/about';
import { aboutApi } from '../api/client';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const About: React.FC = () => {
  useDocumentTitle('About & Creative Philosophy');
  const [data, setData] = useState<AboutData>(initialAboutData);

  const loadData = useCallback(async () => {
    try {
      const fetched = await aboutApi.getAbout();
      setData(fetched);
    } catch (err) {
      console.warn('API unavailable; using bundled about profile:', err);
      // Keep initialAboutData as fallback
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const { portrait, intro, philosophy, skills, equipment, professionalNotes } = data;

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
                <h1 className="about-name">{data.name}</h1>
                <span className="about-role-sub">{data.role}</span>
              </div>

              <h2 className="about-headline">{intro.headline}</h2>

              <div className="about-body-text">
                {intro.paragraphs?.map((p, idx) => (
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
          <div className="about-philosophy-header">
            <span className="about-meta">Manifesto</span>
            <h2 className="about-section-title">{philosophy.title}</h2>
            <p className="about-philosophy-statement">“{philosophy.statement}”</p>
          </div>

          <div className="philosophy-tenets-grid">
            {philosophy.tenets?.map((tenet) => (
              <div key={tenet.number} className="philosophy-tenet-card">
                <span className="tenet-number">{tenet.number}</span>
                <h3 className="tenet-title">{tenet.title}</h3>
                <p className="tenet-desc">{tenet.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            Section 3: Skills & Disciplines List
            ================================================================== */}
        <section className="about-skills-section" aria-label="Disciplines and Technical Skills">
          <div className="about-skills-inner">
            <div className="skills-header">
              <span className="about-meta">Craft</span>
              <h2 className="about-section-title">{skills.title}</h2>
            </div>

            <div className="skills-tags-grid">
              {skills.list?.map((skill, idx) => (
                <div key={idx} className="skill-pill">
                  <span className="skill-dot" aria-hidden="true" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            Section 4: Equipment & Optics Inventory
            ================================================================== */}
        <section className="about-equipment-section" aria-label="Selected Equipment">
          <div className="about-equipment-header">
            <span className="about-meta">Inventory</span>
            <h2 className="about-section-title">{equipment.title}</h2>
            <p className="about-equipment-desc">{equipment.description}</p>
          </div>

          <div className="equipment-categories-grid">
            {equipment.categories?.map((cat) => (
              <div key={cat.group} className="equipment-group-card">
                <h3 className="equipment-group-title">{cat.group}</h3>
                <ul className="equipment-item-list">
                  {cat.items?.map((item, i) => (
                    <li key={i} className="equipment-item">
                      <span className="equipment-bullet" aria-hidden="true">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            Section 5: Professional Notes & Operations
            ================================================================== */}
        <section className="about-notes-section" aria-label="Professional Notes">
          <div className="notes-grid">
            {professionalNotes?.map((note) => (
              <div key={note.label} className="note-card">
                <span className="note-label">{note.label}</span>
                <p className="note-value">{note.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
