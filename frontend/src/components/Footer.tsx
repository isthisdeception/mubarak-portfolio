import React from 'react';
import { siteData } from '../data/site';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <p className="footer-name">{siteData.name}</p>
            <p className="footer-tagline">{siteData.tagline}</p>
          </div>

          <div className="footer-social-col">
            {siteData.socialLinks.map((soc) => (
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
          <p>© {siteData.copyrightYear} {siteData.name}. All visual works reserved.</p>
          <p className="footer-worldwide">{siteData.location}</p>
        </div>
      </div>
    </footer>
  );
};
