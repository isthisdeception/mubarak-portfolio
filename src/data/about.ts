export interface EquipmentCategory {
  group: string;
  items: string[];
}

export interface AboutData {
  name: string;
  role: string;
  portrait: {
    src: string;
    alt: string;
    caption: string;
  };
  intro: {
    headline: string;
    paragraphs: string[];
  };
  philosophy: {
    title: string;
    statement: string;
    tenets: {
      number: string;
      title: string;
      description: string;
    }[];
  };
  skills: {
    title: string;
    list: string[];
  };
  equipment: {
    title: string;
    description: string;
    categories: EquipmentCategory[];
  };
  professionalNotes: {
    label: string;
    value: string;
  }[];
}

export const aboutData: AboutData = {
  name: 'Mubarak',
  role: 'Photographer · Cinematographer · Drone Operator',
  portrait: {
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1600&q=85',
    alt: 'Studio portrait of Mubarak in warm chiaroscuro ambient light',
    caption: 'Studio Archive · Portrait by Natural Window Light · 2025',
  },
  intro: {
    headline: 'Finding permanence in fleeting light, deliberate motion, and vast horizons.',
    paragraphs: [
      'I am an independent visual artist working across still photography, narrative cinematography, and licensed aerial drone operations. Based globally, my practice centers on organic composition and atmospheric depth.',
      'Whether recording Arctic glaciers from sub-zero elevations or capturing an intimate portrait in 35mm chiaroscuro, my intention remains singular: to strip away visual noise until only the authentic weight of the frame remains.',
    ],
  },
  philosophy: {
    title: 'Creative Philosophy',
    statement:
      'We do not manufacture cinema; we cultivate patience until reality reveals its own poetry.',
    tenets: [
      {
        number: '01',
        title: 'Intentional Restraint',
        description:
          'Every camera movement, focal length choice, and shutter release must serve the emotional cadence of the narrative. Empty space is as vital as the subject.',
      },
      {
        number: '02',
        title: 'Textural Authenticity',
        description:
          'Honoring raw grain, uncorrected natural light falloff, and tactile imperfection over sterile synthetic digital perfection.',
      },
      {
        number: '03',
        title: 'Spatial Perspective',
        description:
          'Combining ground-level human intimacy with high-altitude aerial geometry to place human emotion within the planetary scale.',
      },
    ],
  },
  skills: {
    title: 'Disciplines & Craft',
    list: [
      'Photography (Editorial, Portrait, Architectural)',
      'Cinematography & Anamorphic Direction',
      'Certified Drone Operations (Sub-meter Flight)',
      'Motion Picture Video Editing',
      'Master Color Grading (ACES & DaVinci Resolve)',
      'Visual Storytelling & Script Development',
      'Creative & Photographic Direction',
      'High-Resolution Post Production & Retouching',
    ],
  },
  equipment: {
    title: 'Camera & Production Craft',
    description:
      'A deliberate curation of medium format digital backs, anamorphic glass, cinema camera rigs, and high-wind aerial platforms.',
    categories: [
      {
        group: 'Cinema & Still Bodies',
        items: [
          'ARRI Alexa Mini LF Cinema System',
          'Sony FX6 Full-Frame Cinema Line',
          'Hasselblad 907X 50C Medium Format',
          'Canon Cinema EOS C500 Mark II',
        ],
      },
      {
        group: 'Optics & Prime Glass',
        items: [
          'Atlas Orion Anamorphic Primes (32mm, 50mm, 80mm)',
          'Leica Summilux-C High-Speed Cinema Lenses',
          'Zeiss Supreme Primes T1.5 Full-Frame Set',
          'Hasselblad XCD Primes (45P, 90V)',
        ],
      },
      {
        group: 'Aerial & Stabilization',
        items: [
          'DJI Inspire 3 with Zenmuse X9-8K Air Gimbal',
          'DJI Mavic 3 Pro Cine (ProRes 422 HQ)',
          'DJI Ronin 4D 8K 4-Axis Handheld Gimbal',
          'Wireless Teradek Bolt 4K Zero-Delay Video Link',
        ],
      },
      {
        group: 'Post Production Suite',
        items: [
          'DaVinci Resolve Studio (Advanced Color Grading)',
          'ACES Color Managed Production Pipeline',
          'EIZO ColorEdge Pro Reference Displays',
          'Final Cut Pro & Premiere Pro Master Suites',
        ],
      },
    ],
  },
  professionalNotes: [
    { label: 'FAA & EASA Status', value: 'Part 107 Commercial Remote Pilot · Open A1/A3 Licensed' },
    { label: 'Base of Operation', value: 'Available Worldwide for Commissions & Co-Productions' },
    { label: 'Studio Specialization', value: 'Editorial, Luxury Architecture, Narrative Documentaries' },
    { label: 'Language Fluency', value: 'English (Fluent), French (Conversational)' },
  ],
};
