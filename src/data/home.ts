import heroMobarakImg from '../assets/hero-mobarak.jpg';

export interface SelectedWorkItem {
  id: string;
  title: string;
  discipline: 'Photography' | 'Cinematography' | 'Drone';
  category: string;
  year: string;
  location: string;
  imageUrl: string;
  aspectRatio: 'landscape' | 'portrait' | 'wide';
  linkTarget: string;
}

export interface HomeData {
  displayName: string;
  roleTag: string;
  coordinates: string;
  reelTag: string;
  heroHeadline: string;
  heroIntro: string;
  heroMedia: {
    type: 'image';
    url: string;
    alt: string;
    caption: string;
  };
  ctaLabel: string;
  ctaSubLabel: string;
  ctaTarget: string;
  selectedWorksSection: {
    indexLabel: string;
    title: string;
    description: string;
  };
  selectedWorks: SelectedWorkItem[];
}

export const homeData: HomeData = {
  displayName: 'Mubarak',
  roleTag: 'PHOTOGRAPHER / DRONE PILOT',
  coordinates: '23.8103° N, 90.4125° E — DHAKA',
  reelTag: 'REEL 35MM / 4K',
  heroHeadline: 'Visual Stories Across Light & Motion',
  heroIntro:
    'Dedicated to capturing evocative moments through high-altitude aerial perspectives, intentional 35mm composition, and atmospheric cinematography.',
  heroMedia: {
    type: 'image',
    url: heroMobarakImg,
    alt: 'Mubarak operating DJI drone outdoors in natural landscape',
    caption: 'Field Journal 08 · Aerial Scout · 2025',
  },
  ctaLabel: 'View Work',
  ctaSubLabel: 'Selected Portfolio',
  ctaTarget: '/work',
  selectedWorksSection: {
    indexLabel: '01 · Archive',
    title: 'Selected Works',
    description: 'A curated selection of still photography, motion frames, and aerial drone compositions.',
  },
  selectedWorks: [
    {
      id: 'solitude-in-svalbard',
      title: 'Solitude in Svalbard',
      discipline: 'Photography',
      category: 'Arctic Landscape',
      year: '2025',
      location: 'Svalbard, Norway',
      imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=85',
      aspectRatio: 'wide',
      linkTarget: '/work/photography?item=solitude-in-svalbard',
    },
    {
      id: 'elysian-dunes',
      title: 'Elysian Dunes',
      discipline: 'Drone',
      category: 'Aerial Topography',
      year: '2025',
      location: 'Namib Desert',
      imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
      aspectRatio: 'landscape',
      linkTarget: '/work/drone?item=elysian-dunes',
    },
    {
      id: 'nocturne-in-kyoto',
      title: 'Nocturne in Kyoto',
      discipline: 'Cinematography',
      category: 'Narrative Short',
      year: '2024',
      location: 'Kyoto, Japan',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
      aspectRatio: 'landscape',
      linkTarget: '/work/cinematography?item=nocturne-in-kyoto',
    },
    {
      id: 'tides-of-the-atlantic',
      title: 'Tides of the Atlantic',
      discipline: 'Drone',
      category: 'Coastal Geometry',
      year: '2024',
      location: 'Faroe Islands',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
      aspectRatio: 'wide',
      linkTarget: '/work/drone?item=tides-of-the-atlantic',
    },
    {
      id: 'the-monolith',
      title: 'The Monolith',
      discipline: 'Photography',
      category: 'Architectural Shadow',
      year: '2024',
      location: 'Copenhagen, Denmark',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
      aspectRatio: 'landscape',
      linkTarget: '/work/photography?item=the-monolith',
    },
  ],
};
