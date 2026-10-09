export type DisciplineId = 'photography' | 'cinematography' | 'drone';

export interface PortfolioItem {
  id: string;
  title: string;
  discipline: DisciplineId;
  category: string;
  mediaType: 'image' | 'video';
  src: string;
  alt: string;
  aspectRatio: 'landscape' | 'portrait' | 'wide' | 'square';
  year: string;
  location: string;
  clientOrContext?: string;
  description?: string;
}

export interface DisciplineMeta {
  id: DisciplineId;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  categories: string[];
}

export const disciplinesData: Record<DisciplineId, DisciplineMeta> = {
  photography: {
    id: 'photography',
    name: 'Photography',
    tagline: 'Medium format & 35mm intentional still captures',
    description:
      'Editorial, fine art, and commercial still photography characterized by chiaroscuro lighting, tactile texture, and natural intimacy.',
    heroImage:
      'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1800&q=85',
    categories: [
      'Portrait',
      'Event',
      'Wedding',
      'Travel',
      'Street',
      'Product',
      'Corporate',
    ],
  },
  cinematography: {
    id: 'cinematography',
    name: 'Cinematography',
    tagline: 'Anamorphic motion & documentary storytelling',
    description:
      'Motion pictures crafted with deliberate pacing, rich color science, and cinematic framing for narrative films, commercial campaigns, and cultural events.',
    heroImage:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1800&q=85',
    categories: ['Event Videos', 'Commercial Projects', 'Documentary'],
  },
  drone: {
    id: 'drone',
    name: 'Drone Operations',
    tagline: 'Licensed high-altitude aerial perspectives & topological cinema',
    description:
      'Certified sub-meter precision aerial cinematography and fine art aerial stills, capturing Earth’s geometries and expansive architectural footprints.',
    heroImage:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1800&q=85',
    categories: [
      'Aerial Photography',
      'Aerial Cinematic Videos',
      'Real Estate Aerial Coverage',
    ],
  },
};

export const portfolioItems: PortfolioItem[] = [
  // --- PHOTOGRAPHY ---
  {
    id: 'solitude-in-svalbard',
    title: 'Solitude in Svalbard',
    discipline: 'photography',
    category: 'Travel',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1800&q=85',
    alt: 'Iceberg towering over dark arctic waters in Svalbard under pale Nordic light',
    aspectRatio: 'wide',
    year: '2025',
    location: 'Svalbard, Norway',
    clientOrContext: 'Independent Fine Art Series',
    description:
      'A quiet study of retreating glacial structures under late arctic winter illumination, shot on medium format digital.',
  },
  {
    id: 'seraphina-nocturne',
    title: 'Seraphina in Shadow',
    discipline: 'photography',
    category: 'Portrait',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85',
    alt: 'Editorial portrait of woman with chiaroscuro rim lighting',
    aspectRatio: 'portrait',
    year: '2025',
    location: 'Milan, Italy',
    clientOrContext: 'Vogue Italia Editorial Submission',
    description:
      'Exploration of high-contrast natural window illumination and sculptural human form.',
  },
  {
    id: 'the-monolith',
    title: 'The Monolith Pavilion',
    discipline: 'photography',
    category: 'Corporate',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    alt: 'Brutalist glass and concrete high-rise angular geometry',
    aspectRatio: 'landscape',
    year: '2024',
    location: 'Copenhagen, Denmark',
    clientOrContext: 'Nordic Architecture Biennale',
    description:
      'Geometric interplay of raw structural facades and rhythmic glass reflections.',
  },
  {
    id: 'rain-over-shinjuku',
    title: 'Rain Over Shinjuku',
    discipline: 'photography',
    category: 'Street',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=85',
    alt: 'Tokyo pedestrian intersection with reflections in rain puddles',
    aspectRatio: 'landscape',
    year: '2024',
    location: 'Tokyo, Japan',
    clientOrContext: 'Street Chronicles Vol. IV',
    description:
      'Candid urban cadence captured during typhoon twilight on 35mm f/1.4 lens.',
  },
  {
    id: 'aethelgard-estate',
    title: 'The Solitary Vow',
    discipline: 'photography',
    category: 'Wedding',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    alt: 'Intimate editorial wedding couple silhouetted against historic stone cloister',
    aspectRatio: 'portrait',
    year: '2024',
    location: 'Lake Como, Italy',
    clientOrContext: 'Private Commission',
    description:
      'Documentary wedding coverage focusing on unprompted intimacy and architectural heritage.',
  },
  {
    id: 'atelier-botanica',
    title: 'Vessel & Petal',
    discipline: 'photography',
    category: 'Product',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=85',
    alt: 'Minimal ceramic perfume bottle on travertine stone surface with botanical stem',
    aspectRatio: 'square',
    year: '2025',
    location: 'Paris, France',
    clientOrContext: 'Maison Éthérée Campaign',
    description:
      'Tactile luxury fragrance still life balancing organic geometry and muted earthy minerals.',
  },
  {
    id: 'venice-biennale-vernissage',
    title: 'Vernissage Nocturne',
    discipline: 'photography',
    category: 'Event',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=85',
    alt: 'Art gala gathering illuminated by warm ambient gallery spotlights',
    aspectRatio: 'landscape',
    year: '2024',
    location: 'Venice, Italy',
    clientOrContext: 'La Biennale di Venezia',
    description:
      'Quiet observation of patrons and collectors encountering contemporary light installations.',
  },

  // --- CINEMATOGRAPHY ---
  {
    id: 'nocturne-in-kyoto',
    title: 'Nocturne in Kyoto',
    discipline: 'cinematography',
    category: 'Documentary',
    mediaType: 'video',
    src: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
    alt: 'Gion alleyway wet from evening rain illuminated by red lanterns',
    aspectRatio: 'wide',
    year: '2024',
    location: 'Kyoto, Japan',
    clientOrContext: 'NHK World Documentary Feature',
    description:
      'Short cinematic portrait documenting third-generation tea masters in Kyoto’s historic preservation district.',
  },
  {
    id: 'chroma-velocity',
    title: 'Chroma Velocity',
    discipline: 'cinematography',
    category: 'Commercial Projects',
    mediaType: 'video',
    src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    alt: 'Sleek luxury coupe drifting along wet mountain hairpin curve at dusk',
    aspectRatio: 'landscape',
    year: '2025',
    location: 'Grossglockner Pass, Austria',
    clientOrContext: 'Porsche Design Global Digital',
    description:
      'High-speed automotive commercial filmed with anamorphic primes and Russian arm tracking system.',
  },
  {
    id: 'symphony-at-dusk',
    title: 'Philharmonic at Open Air',
    discipline: 'cinematography',
    category: 'Event Videos',
    mediaType: 'video',
    src: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=85',
    alt: 'Conductor directing orchestral players under twilight amphitheater dome',
    aspectRatio: 'landscape',
    year: '2024',
    location: 'Verona, Italy',
    clientOrContext: 'Arena di Verona Opera Festival',
    description:
      'Multi-camera cinematic concert capture recorded in 24fps high dynamic range.',
  },

  // --- DRONE ---
  {
    id: 'elysian-dunes',
    title: 'Elysian Dunes',
    discipline: 'drone',
    category: 'Aerial Photography',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
    alt: 'Geometric razor-sharp shadow casting across deep crimson sand dunes',
    aspectRatio: 'landscape',
    year: '2025',
    location: 'Sossusvlei, Namibia',
    clientOrContext: 'National Geographic Traveler',
    description:
      'Top-down 400ft vertical capture showing mathematical ridges sculpted by southwest Atlantic winds.',
  },
  {
    id: 'tides-of-the-atlantic',
    title: 'Tides of the Atlantic',
    discipline: 'drone',
    category: 'Aerial Cinematic Videos',
    mediaType: 'video',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
    alt: 'Dramatic coastal cliffs battered by emerald waves from a high drone vantage',
    aspectRatio: 'wide',
    year: '2024',
    location: 'Faroe Islands',
    clientOrContext: 'Atlantic Motion Studies',
    description:
      'High wind cinematic tracking sequence following sea spray against 300-meter basalt cliffs.',
  },
  {
    id: 'solvalla-residence',
    title: 'Villa Solvalla Waterfront',
    discipline: 'drone',
    category: 'Real Estate Aerial Coverage',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    alt: 'Architectural modernist waterfront villa seamlessly integrated into pine cliff edge',
    aspectRatio: 'landscape',
    year: '2025',
    location: 'Stockholm Archipelago, Sweden',
    clientOrContext: 'Sotheby’s International Realty',
    description:
      'Comprehensive dawn-to-dusk topological survey showcasing architectural harmony with natural shoreline.',
  },
  {
    id: 'icelandic-veins',
    title: 'Glacial Braids & Volcanic Veins',
    discipline: 'drone',
    category: 'Aerial Photography',
    mediaType: 'image',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    alt: 'Top-down aerial view of braided glacial river crossing black volcanic sand',
    aspectRatio: 'portrait',
    year: '2024',
    location: 'South Coast, Iceland',
    clientOrContext: 'Nordic Geological Archive',
    description:
      'Orthogonal fine art perspective of sediment ribbons weaving across black basalt sands.',
  },
];
