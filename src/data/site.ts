export interface NavItem {
  label: string;
  path: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  handle?: string;
}

export interface SiteMetadata {
  name: string;
  tagline: string;
  disciplines: string[];
  location: string;
  copyrightYear: number;
  navItems: NavItem[];
  socialLinks: SocialLink[];
}

export const siteData: SiteMetadata = {
  name: 'Prism Pulse',
  tagline: 'Photographer · Cinematographer · Drone Operator',
  disciplines: ['Photography', 'Cinematography', 'Drone'],
  location: 'Available Worldwide',
  copyrightYear: new Date().getFullYear(),
  navItems: [
    { label: 'Home', path: '/' },
    { label: 'Work', path: '/work' },
    { label: 'Reels', path: '/reels' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Journal', path: '/journal' },
    { label: 'Contact', path: '/contact' },
  ],
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com', handle: '@prismpulse.visuals' },
    { platform: 'Vimeo', url: 'https://vimeo.com', handle: 'prismpulsefilms' },
    { platform: 'YouTube', url: 'https://youtube.com', handle: '@prismpulsecinema' },
  ],
};
