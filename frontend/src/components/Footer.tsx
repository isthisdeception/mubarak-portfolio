import React from 'react';
import { useSite } from '../context/SiteContext';

export const Footer: React.FC = () => {
  const { site } = useSite();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <p className="footer-name">{site.name}</p>
            <p className="footer-tagline">{site.tagline}</p>
          </div>

          <div className="footer-social-col">
            {site.socialLinks.map((soc) => (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={`${soc.platform} (opens in new tab)`}
              >
                <span>{soc.platform}</span>
                <span aria-hidden="true" style={{ fontSize: '0.65rem' }}>↗</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {site.copyrightYear} {site.name}. All visual works reserved.</p>
          <p className="footer-worldwide">{site.location}</p>
        </div>
      </div>
    </footer>
  );
};
