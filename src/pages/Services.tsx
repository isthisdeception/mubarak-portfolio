import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/services';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Services: React.FC = () => {
  useDocumentTitle('Services & Production Commissions');
  const { meta, headline, intro, groups, engagementModel } = servicesData;

  return (
    <div className="services-page reveal-fade">
      <div className="container">
        {/* Header */}
        <header className="services-header reveal-slide-up">
          <span className="services-meta">{meta}</span>
          <h1 className="services-title">{headline}</h1>
          <p className="services-desc">{intro}</p>
        </header>

        {/* ==================================================================
            Three Major Discipline Service Sections (Split Layout)
            ================================================================== */}
        <div className="services-group-list">
          {groups.map((group) => (
            <section
              key={group.id}
              className="service-discipline-section"
              aria-labelledby={`discipline-heading-${group.id}`}
            >
              <div className="service-discipline-grid">
                {/* Left Column: Chapter Metadata & Large Image */}
                <div className="discipline-identity-col">
                  <div>
                    <span className="discipline-number">
                      Offering {group.number} · {group.discipline}
                    </span>
                    <h2
                      id={`discipline-heading-${group.id}`}
                      className="discipline-heading"
                    >
                      {group.discipline}
                    </h2>
                  </div>

                  <p className="discipline-statement">{group.description}</p>

                  <div className="discipline-image-frame">
                    <img
                      src={group.heroImage}
                      alt={group.imageAlt}
                      className="discipline-image"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <Link
                      to={`/work/${group.id}`}
                      className="btn btn-ghost btn-sm"
                      style={{ paddingLeft: 0, color: 'var(--color-accent)' }}
                    >
                      Explore {group.discipline} Archive Works →
                    </Link>
                  </div>
                </div>

                {/* Right Column: Typographic Services List */}
                <div className="discipline-services-list">
                  {group.services.map((service) => (
                    <article key={service.id} className="service-item-row">
                      <div className="service-item-header">
                        <h3 className="service-item-title">{service.name}</h3>
                      </div>
                      <p className="service-item-desc">{service.description}</p>
                      {service.deliverables && (
                        <div className="service-item-deliverable">
                          <span>Deliverables</span>
                          <span>— {service.deliverables}</span>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* ==================================================================
            Engagement Model (Bespoke Proposals)
            ================================================================== */}
        <section
          className="services-engagement-section"
          aria-label="Commissioning Approach"
        >
          <div className="engagement-container">
            <div>
              <span className="services-meta" style={{ marginBottom: 'var(--space-2)' }}>
                Production Protocol
              </span>
              <h2 className="engagement-title">{engagementModel.title}</h2>
              <p className="engagement-desc">{engagementModel.description}</p>
            </div>

            <ul className="engagement-notes-list">
              {engagementModel.notes.map((note, idx) => (
                <li key={idx} className="engagement-note-item">
                  <span className="engagement-note-dash" aria-hidden="true">—</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ==================================================================
            Bottom CTA Block -> /contact
            ================================================================== */}
        <section className="services-bottom-cta" aria-label="Initiate Inquiry">
          <h2 className="services-bottom-title">
            Have a project, expedition, or campaign in development?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-sm)',
              maxWidth: '540px',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            Direct consultations are scheduled without obligation. Tell us about your vision,
            locations, and anticipated timeline.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link to="/contact" className="btn btn-primary btn-md">
              Start a Project Dialogue →
            </Link>
            <Link to="/work" className="btn btn-secondary btn-md">
              Review Archive
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
