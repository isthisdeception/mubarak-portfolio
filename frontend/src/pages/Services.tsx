import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { servicesData as initialServicesData } from '../data/services';
import type { ServicesPageData } from '../data/services';
import { servicesApi } from '../api/client';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Services: React.FC = () => {
  useDocumentTitle('Services & Production Commissions');
  const [data, setData] = useState<ServicesPageData>(initialServicesData);

  const loadData = useCallback(async () => {
    try {
      const fetched = await servicesApi.getServices();
      setData(fetched);
    } catch (err) {
      console.warn('API unavailable; using bundled services data:', err);
      // Keep initialServicesData as fallback
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const { meta, headline, intro, groups, engagementModel } = data;

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
          {groups?.map((group) => (
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
                      className="discipline-hero-img"
                      loading="lazy"
                    />
                  </div>

                  <div style={{ marginTop: 'var(--space-6)' }}>
                    <Link
                      to="/contact"
                      className="btn btn-secondary btn-sm"
                      style={{ width: 'fit-content' }}
                    >
                      Inquire for {group.discipline} →
                    </Link>
                  </div>
                </div>

                {/* Right Column: Tailored Offerings List */}
                <div className="service-items-col">
                  {group.services?.map((svc) => (
                    <article key={svc.id} className="service-card">
                      <div className="service-card-header">
                        <h3 className="service-card-name">{svc.name}</h3>
                      </div>
                      <p className="service-card-desc">{svc.description}</p>
                      {svc.deliverables && (
                        <div className="service-deliverables">
                          <span className="deliverables-label">Deliverables</span>
                          <span className="deliverables-value">{svc.deliverables}</span>
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
            Bottom: Engagement Model & Terms of Production
            ================================================================== */}
        {engagementModel && (
          <section className="engagement-model-section" aria-label="Engagement Model">
            <div className="engagement-model-card">
              <span className="engagement-meta">Production Protocols</span>
              <h2 className="engagement-title">{engagementModel.title}</h2>
              <p className="engagement-desc">{engagementModel.description}</p>

              <div className="engagement-notes-grid">
                {engagementModel.notes?.map((note, idx) => (
                  <div key={idx} className="engagement-note-item">
                    <span className="engagement-check" aria-hidden="true">✓</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
                <Link to="/contact" className="btn btn-primary btn-md">
                  Initiate Booking Dialogue →
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
