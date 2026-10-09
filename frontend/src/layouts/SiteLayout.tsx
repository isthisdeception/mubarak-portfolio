import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SiteProvider } from '../context/SiteContext';

export const SiteLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <SiteProvider>
      <div className="site-shell">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Navbar />
        <main className="site-main" id="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SiteProvider>
  );
};
