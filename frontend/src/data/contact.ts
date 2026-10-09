import { servicesData } from './services';

export interface ServiceOptionGroup {
  discipline: string;
  services: string[];
}

export interface ContactData {
  meta: string;
  headline: string;
  intro: string;
  email: string;
  phone: string;
  representation: string;
  operatingHours: string;
  responseNote: string;
  sideImage: {
    src: string;
    alt: string;
    caption: string;
  };
  serviceOptionGroups: ServiceOptionGroup[];
}

export const contactData: ContactData = {
  meta: '06 · Dialogue & Inquiries',
  headline: 'Initiate a Project Dialogue',
  intro:
    'Every production begins with a conversation about light, place, and purpose. Please share the details of your upcoming commission, event, or expedition.',
  email: 'commissions@prismpulse-visuals.com',
  phone: '+1 (415) 890-4421',
  representation: 'Direct Artist Representation · Available Worldwide',
  operatingHours: 'Studio Office: Monday – Friday · 09:00 – 18:00 CET',
  responseNote:
    'All inquiries are personally reviewed within 24 to 48 hours. Confidential project NDAs supported upon request.',
  sideImage: {
    src: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=85',
    alt: 'Sunlight filtering through forest canopy into deep atmospheric shadows',
    caption: 'Field Production Notes · Light & Environmental Scouting · 2025',
  },
  serviceOptionGroups: servicesData.groups.map((group) => ({
    discipline: group.discipline,
    services: group.services.map((s) => s.name),
  })),
};
