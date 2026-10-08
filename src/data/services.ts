export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  deliverables?: string;
}

export interface ServiceGroup {
  id: 'photography' | 'cinematography' | 'drone';
  number: string;
  discipline: string;
  tagline: string;
  description: string;
  heroImage: string;
  imageAlt: string;
  services: ServiceItem[];
}

export interface ServicesPageData {
  meta: string;
  headline: string;
  intro: string;
  engagementModel: {
    title: string;
    description: string;
    notes: string[];
  };
  groups: ServiceGroup[];
}

export const servicesData: ServicesPageData = {
  meta: '04 · Offerings & Commissions',
  headline: 'Commissions & Production Craft',
  intro:
    'Tailored visual productions spanning editorial still photography, narrative cinematography, and licensed high-altitude drone operations. Each engagement is treated as a bespoke partnership.',
  engagementModel: {
    title: 'Bespoke Engagement & Delivery',
    description:
      'We do not offer generic tiered packages. Every commission is quoted individually based on geographic location, production complexity, licensing parameters, and delivery timeline.',
    notes: [
      'Worldwide travel & co-production availability',
      'Dual-operator cinema drone crew configuration',
      'Full ACES color managed post-production pipeline',
      'Direct director-to-client creative dialogue',
    ],
  },
  groups: [
    {
      id: 'photography',
      number: '01',
      discipline: 'Photography',
      tagline: 'Medium format & 35mm intentional still captures',
      description:
        'Tactile, chiaroscuro still imagery focusing on architectural balance, candid emotion, and raw environmental atmosphere.',
      heroImage:
        'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=85',
      imageAlt: 'Fine art monochrome still photography study of glacial ridges',
      services: [
        {
          id: 'photo-event',
          name: 'Event Photography',
          description:
            'Unobtrusive, documentary coverage of high-profile galas, private gatherings, cultural exhibitions, and artistic vernissages.',
          deliverables: 'Curated high-res editorial archive, same-day press selects',
        },
        {
          id: 'photo-wedding',
          name: 'Wedding Photography',
          description:
            'Intimate, cinematic documentation capturing authentic moments, architectural backdrops, and timeless human connection.',
          deliverables: 'Full-resolution master digital archive & archival fine art print selects',
        },
        {
          id: 'photo-portrait',
          name: 'Portrait Sessions',
          description:
            'Editorial portraits for artists, directors, founders, and cultural publications using natural directional window illumination.',
          deliverables: 'Retouched medium format master captures with bespoke color grading',
        },
        {
          id: 'photo-corporate',
          name: 'Corporate & Architecture',
          description:
            'Geometric architectural surveys and refined executive imagery capturing structural rhythm, materials, and enterprise culture.',
          deliverables: 'Architectural corrected masters for print monographs and annual reports',
        },
        {
          id: 'photo-product',
          name: 'Product & Still Life',
          description:
            'Tactile luxury fragrance, horology, and artisanal object studies emphasizing organic textures, travertine stone, and shadow.',
          deliverables: 'Macro high-resolution commercial campaign masters',
        },
      ],
    },
    {
      id: 'cinematography',
      number: '02',
      discipline: 'Cinematography',
      tagline: 'Anamorphic motion pictures & documentary narratives',
      description:
        'Narrative films and brand stories directed with cinematic restraint, optical anamorphic flares, and deliberate camera motion.',
      heroImage:
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
      imageAlt: 'Cinematic rain-slicked Tokyo street under red lantern illumination',
      services: [
        {
          id: 'cine-event-coverage',
          name: 'Event Video Coverage',
          description:
            'Multi-camera cinematic documentation of cultural galas, symposiums, and live orchestral performances in pristine 24fps.',
          deliverables: 'Cinematic highlight film & multicam documentary master cut',
        },
        {
          id: 'cine-documentary',
          name: 'Documentary Production',
          description:
            'In-depth non-fiction short films and cultural portraits exploring craftsmanship, historical legacies, and human journeys.',
          deliverables: 'Festival-ready master deliverables with 5.1 surround sound design',
        },
        {
          id: 'cine-promotional',
          name: 'Promotional Video',
          description:
            'Evocative visual anthems for luxury maisons, design studios, and hospitality destinations that immerse the viewer.',
          deliverables: '4K ProRes master cuts & optimized social cuts',
        },
        {
          id: 'cine-commercial',
          name: 'Commercial Films',
          description:
            'Full-scale commercial campaign production with precision camera movement, gimbal rigs, and broadcast-compliant color grading.',
          deliverables: 'Directors cut, broadcast masters, and multilingual localized delivery',
        },
        {
          id: 'cine-social-content',
          name: 'Social Media Content',
          description:
            'Vertical 9:16 cinematic micro-narratives tailored for luxury audience engagement without sacrificing photographic integrity.',
          deliverables: 'Batch vertical 4K HDR cuts with integrated sound design',
        },
      ],
    },
    {
      id: 'drone',
      number: '03',
      discipline: 'Drone Operations',
      tagline: 'Licensed aerial cinema & high-altitude surveying',
      description:
        'Sub-meter precision aerial cinematography using dual-operator flight platforms to capture expansive topographies and architectural forms.',
      heroImage:
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
      imageAlt: 'Aerial top-down view of sharp crimson sand ridges in Namibia',
      services: [
        {
          id: 'drone-aerial-photo',
          name: 'Aerial Photography',
          description:
            'Large-format top-down and oblique fine art aerial stills showcasing mathematical geological formations and natural coastlines.',
          deliverables: '8K RAW aerial still masters suitable for gallery scale printing',
        },
        {
          id: 'drone-real-estate',
          name: 'Real Estate Drone Video',
          description:
            'Smooth low-altitude sweeping approaches and topological estate overviews highlighting architectural luxury and land boundaries.',
          deliverables: 'Cinematic 4K property showcase with boundary overlays',
        },
        {
          id: 'drone-event-coverage',
          name: 'Event Drone Coverage',
          description:
            'Permitted, safety-compliant aerial coverage capturing scale, crowd movement, and panoramic evening venue environments.',
          deliverables: 'Live broadcast feed integration & edited cinematic recap footage',
        },
        {
          id: 'drone-travel',
          name: 'Travel Drone Shots',
          description:
            'Expeditionary aerial surveys traversing remote peaks, fjords, and deserts to provide sweeping establishing vistas.',
          deliverables: 'Comprehensive scenic stock archive & sequence delivery',
        },
        {
          id: 'drone-cinematic-footage',
          name: 'Cinematic Aerial Footage',
          description:
            'Dynamic high-speed tracking sequences following vehicles, boats, and subjects with synchronized camera tilt and yaw.',
          deliverables: 'Cinema DNG / Apple ProRes 8K master footage log recordings',
        },
      ],
    },
  ],
};
