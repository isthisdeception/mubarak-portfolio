export type ReelCategory =
  | 'Travel'
  | 'Behind the Scenes'
  | 'Events'
  | 'Cinematic Shorts'
  | 'Creative Projects';

export interface ReelItem {
  id: string;
  title: string;
  category: ReelCategory;
  poster: string;
  videoSrc: string;
  duration: string;
  aspectRatio: 'vertical' | 'cinematic';
  year: string;
  location: string;
  gearOrFormat?: string;
  description: string;
}

export const reelCategories: ReelCategory[] = [
  'Travel',
  'Behind the Scenes',
  'Events',
  'Cinematic Shorts',
  'Creative Projects',
];

export const reelsData: ReelItem[] = [
  {
    id: 'alps-in-cloudbreak',
    title: 'Alps in Cloudbreak',
    category: 'Travel',
    poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    duration: '0:45',
    aspectRatio: 'vertical',
    year: '2025',
    location: 'Dolomites, Italy',
    gearOrFormat: 'Shot on iPhone 16 Pro Max · Apple Log / 4K ProRes',
    description: 'Passing storm fronts parting over the Tre Cime pinnacles during golden hour.',
  },
  {
    id: '35mm-anamorphic-rigging',
    title: '35mm Anamorphic Rigging',
    category: 'Behind the Scenes',
    poster: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    duration: '0:30',
    aspectRatio: 'vertical',
    year: '2025',
    location: 'Tokyo Soundstage',
    gearOrFormat: 'ARRI Alexa Mini LF · Atlas Orion Anamorphic Primes',
    description: 'Precision lens balancing and wireless follow focus calibration before night shooting.',
  },
  {
    id: 'venetian-masquerade',
    title: 'The Venetian Masquerade',
    category: 'Events',
    poster: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    duration: '1:15',
    aspectRatio: 'cinematic',
    year: '2024',
    location: 'Venice, Italy',
    gearOrFormat: 'Sony FX6 · Cooke Anamorphic /i Full Frame Plus',
    description: 'Gala ballroom evening captured under candlelight and historic chandeliers.',
  },
  {
    id: 'rain-echoes-over-gion',
    title: 'Rain Echoes over Gion',
    category: 'Cinematic Shorts',
    poster: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    duration: '1:02',
    aspectRatio: 'cinematic',
    year: '2024',
    location: 'Kyoto, Japan',
    gearOrFormat: 'RED V-Raptor 8K VV · Leica Summilux-C',
    description: 'Atmospheric nocturnal portrait along the stone walkways of historic Kyoto.',
  },
  {
    id: 'sculpting-shadow-and-mineral',
    title: 'Sculpting Shadow & Mineral',
    category: 'Creative Projects',
    poster: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    duration: '0:38',
    aspectRatio: 'vertical',
    year: '2025',
    location: 'Paris Atelier',
    gearOrFormat: 'Hasselblad 907X 50C · Macro Cine 120mm',
    description: 'Macro textural movement capturing raw terracotta and hand-cast bronze vessels.',
  },
  {
    id: 'namibian-twilight-flight',
    title: 'Namibian Twilight Flight',
    category: 'Travel',
    poster: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    duration: '0:52',
    aspectRatio: 'vertical',
    year: '2025',
    location: 'Sossusvlei, Namibia',
    gearOrFormat: 'DJI Inspire 3 · Zenmuse X9-8K Air Gimbal',
    description: 'High-altitude aerodynamic tracking skimming the peaks of crimson sand ridges.',
  },
  {
    id: 'drone-calibration-at-4000m',
    title: 'Drone Calibration at 4,000m',
    category: 'Behind the Scenes',
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    duration: '0:28',
    aspectRatio: 'vertical',
    year: '2024',
    location: 'Swiss Alps',
    gearOrFormat: 'DJI Ronin 4D 8K · Cold Weather Battery Preheaters',
    description: 'Pre-flight propeller de-icing and barometric sensor zeroing at sub-zero peak elevations.',
  },
  {
    id: 'symphony-at-the-arena',
    title: 'Symphony at the Arena',
    category: 'Events',
    poster: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=85',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    duration: '1:20',
    aspectRatio: 'cinematic',
    year: '2024',
    location: 'Verona, Italy',
    gearOrFormat: 'Multi-Cam ARRI Amira Broadcast Package',
    description: 'Live symphonic performance crescendo recorded during late summer dusk.',
  },
  {
    id: 'glacial-solitude',
    title: 'Glacial Solitude',
    category: 'Cinematic Shorts',
    poster: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    duration: '0:58',
    aspectRatio: 'cinematic',
    year: '2025',
    location: 'Svalbard, Norway',
    gearOrFormat: 'Canon Cinema EOS C500 Mark II · Raw Light 6K',
    description: 'Slow meditative drift through drifting pack ice along the 78th parallel north.',
  },
  {
    id: 'brutalist-monochrome',
    title: 'Brutalist Monochrome',
    category: 'Creative Projects',
    poster: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    duration: '0:42',
    aspectRatio: 'vertical',
    year: '2024',
    location: 'Copenhagen, Denmark',
    gearOrFormat: 'Blackmagic Cinema Camera 6K · Zeiss Milvus Primes',
    description: 'Architectural shadows moving across polished concrete surfaces over twelve hours.',
  },
];
