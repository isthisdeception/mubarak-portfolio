import React, { createContext, useContext, useState, useEffect } from 'react';
import { siteData } from '../data/site';
import type { SiteMetadata } from '../data/site';
import { contactData } from '../data/contact';
import type { ContactData } from '../data/contact';
import { siteApi } from '../api/client';

export interface SiteContextValue {
  site: SiteMetadata;
  contact: ContactData;
  isLoading: boolean;
}

const SiteContext = createContext<SiteContextValue>({
  site: siteData,
  contact: contactData,
  isLoading: false,
});

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [site, setSite] = useState<SiteMetadata>(siteData);
  const [contact, setContact] = useState<ContactData>(contactData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    siteApi
      .getSite()
      .then((data) => {
        if (!isMounted) return;
        setSite({
          name: data.name || siteData.name,
          tagline: data.tagline || siteData.tagline,
          disciplines: data.disciplines || siteData.disciplines,
          location: data.location || siteData.location,
          copyrightYear: data.copyrightYear || siteData.copyrightYear,
          navItems: data.navItems || siteData.navItems,
          socialLinks: data.socialLinks || siteData.socialLinks,
        });
        const raw = data as Record<string, any>;
        setContact((prev) => ({
          ...prev,
          email: data.email || raw.contactEmail || prev.email,
          phone: data.phone || raw.contactPhone || prev.phone,
          representation: data.representation || prev.representation,
          operatingHours: data.operatingHours || prev.operatingHours,
          responseNote: data.responseNote || prev.responseNote,
          sideImage: data.sideImage || prev.sideImage,
        }));
      })
      .catch((err) => {
        console.warn('Site API unavailable; using bundled defaults:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SiteContext.Provider value={{ site, contact, isLoading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
