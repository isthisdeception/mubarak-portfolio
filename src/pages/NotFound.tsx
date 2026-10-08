import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const NotFound: React.FC = () => {
  useDocumentTitle('Page Not Found');
  return (
    <div className="container page-placeholder reveal-fade">
      <div className="page-placeholder-inner">
        <span className="page-placeholder-meta">404 · Uncharted</span>
        <h1 className="page-placeholder-title">Page Not Found</h1>
        <p className="page-placeholder-desc">
          The requested frame or narrative does not exist or has been relocated.
        </p>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <Link to="/" className="btn btn-secondary btn-md">
            Return to Index →
          </Link>
        </div>
      </div>
    </div>
  );
};
