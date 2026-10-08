export type JournalCategory =
  | 'Travel Experiences'
  | 'Gear & Optics'
  | 'Photography Stories'
  | 'Filmmaking Stories'
  | 'Behind the Scenes'
  | 'Field Notes';

export interface JournalPost {
  slug: string;
  title: string;
  category: JournalCategory;
  date: string;
  readTime: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  location?: string;
  content: {
    introParagraph: string;
    quote?: string;
    quoteAuthor?: string;
    bodyParagraphs: string[];
    technicalNote?: string;
    takeaway?: string;
  };
}

export const journalCategories: JournalCategory[] = [
  'Travel Experiences',
  'Gear & Optics',
  'Photography Stories',
  'Filmmaking Stories',
  'Behind the Scenes',
  'Field Notes',
];

export const journalPosts: JournalPost[] = [
  {
    slug: 'arctic-light-svalbard',
    title: 'Chasing Low Horizon Light in the Arctic Circle',
    category: 'Travel Experiences',
    date: 'February 14, 2025',
    readTime: '5 min read',
    location: 'Svalbard, Norway (78°N)',
    coverImage: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1800&q=85',
    coverAlt: 'Iceberg towering over dark arctic waters in Svalbard under pale Nordic light',
    excerpt:
      'When the sun hovers perpetually below the rim of the earth, blue hour stretches for five uninterrupted hours across Svalbard’s frozen fjords.',
    content: {
      introParagraph:
        'At seventy-eight degrees north, time begins to lose its customary grip on daylight. In late winter, the polar dawn arrives not with an abrupt sunrise, but as a deliberate, glacial bloom of lavender, cobalt, and pale amber along the southern rim of the horizon.',
      quote:
        'The arctic does not offer warm welcomes; it offers silence so absolute that you hear the crystallization of your own breath.',
      quoteAuthor: 'Field Notebook 09 · Longyearbyen',
      bodyParagraphs: [
        'Operating in temperatures fluctuating between minus twenty-two and minus thirty-five degrees Celsius demands a renegotiation with every piece of equipment. Mechanical grease in prime focus rings stiffens to molasses. Lithium-ion batteries drop from eighty percent to shutdown in a matter of twenty minutes if not kept inside insulated thermal layers against the body.',
        'Yet this brutal friction forces an intentionality that modern digital photography rarely demands. You do not fire bursts of high-speed frames with frozen thumbs. You scout on snowshoes for two hours, identify the singular structural crease where the glacier meets sea pack, align your tilt-shift axis, and wait for the twilight gradient to balance against the ice.',
        'The resultant medium format frames possess a tactile, crystalline weight that cannot be simulated in post-production. They stand as a testament to the quiet majesty of our planet’s cold frontiers.',
      ],
      technicalNote: 'Shot on Hasselblad 907X 50C with 45P lens · Mechanical shutter @ 1/60s f/8 ISO 100.',
      takeaway: 'Cold weather demands simplicity: one camera body, one prime lens, and total spatial awareness.',
    },
  },
  {
    slug: 'anamorphic-glass-character',
    title: 'Why Imperfect Anamorphic Glass Tells Better Stories',
    category: 'Gear & Optics',
    date: 'January 22, 2025',
    readTime: '4 min read',
    location: 'Studio Notes · Lens Bench',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1800&q=85',
    coverAlt: 'Cinematic silhouette of photographer overlooking misty mountain valley at dawn',
    excerpt:
      'In an era of hyper-sharp digital sensors, vintage cinema glass and deliberate barrel distortion restore the human tactile presence.',
    content: {
      introParagraph:
        'Modern optical engineering has arrived at near-clinical perfection: edge-to-edge sharpness, zero chromatic aberration, zero geometric distortion, and sterile flare suppression. And yet, filmmakers everywhere find themselves reaching backward toward vintage glass.',
      quote:
        'Perfection in optics is technically remarkable, but character in optics is what touches the human heart.',
      quoteAuthor: 'Notes on Cinematic Optics',
      bodyParagraphs: [
        'Anamorphic optical designs introduce a unique set of deliberate imperfections: elliptical out-of-focus highlights, gentle horizontal breathing during focus pulls, warm organic flares that respond to practical lights, and an oval bokeh that draws the eye toward the center of the frame.',
        'When capturing narrative drama or high-end commercial imagery, these optical characteristics strip away the sterile digital barrier between the screen and the viewer. The frame breathes. The human face takes on a dimensional roundness rather than a clinical flat rendering.',
        'By pairing high-resolution large-format cinema sensors with classic 2x squeeze anamorphic primes, we achieve the best of both worlds: modern dynamic range and latitude, enveloped in the rich organic soul of twentieth-century cinema.',
      ],
      technicalNote: 'Atlas Orion Anamorphic 50mm T2.0 paired with ARRI Alexa Mini LF in 4:3 Sensor Mode.',
      takeaway: 'Never choose optical sharpness at the expense of emotional atmosphere and lens soul.',
    },
  },
  {
    slug: 'night-cadence-kyoto',
    title: 'Rain, Reflections, and 35mm Shutter in Kyoto',
    category: 'Photography Stories',
    date: 'December 08, 2024',
    readTime: '6 min read',
    location: 'Kyoto, Japan (Gion & Pontocho)',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1800&q=85',
    coverAlt: 'Gion alleyway wet from evening rain illuminated by red lanterns',
    excerpt:
      'Navigating the wet flagstones of Gion with a single prime lens, learning that darkness is not the absence of light, but its frame.',
    content: {
      introParagraph:
        'Rain in Kyoto transforms the old capital into a reflective mirror. The wet basalt paving stones catch the warm vermilion glow of paper andon lanterns, casting long crimson streaks into the shadows.',
      quote:
        'Shadows in traditional Japanese architecture are not empty voids; they are deliberate spaces designed to hold mystery.',
      quoteAuthor: 'Field Notebook 07 · Kyoto Dusk',
      bodyParagraphs: [
        'Walking through Pontocho during an autumn downpour with a weather-sealed body and an ultra-fast 35mm prime forces a photographer into a quiet observational rhythm. You tuck yourself under timber eves, watching the passing umbrellas and silhouettes against paper shoji screens.',
        'Rather than fighting the darkness by cranking exposures to daylight levels, I allowed the blacks to fall where they naturally lived. The goal was chiaroscuro: isolated pools of lantern light illuminating steam from a noodle shop or the damp hem of a silk kimono.',
        'The final images resonate because they preserve the true sensory memory of being there: the hiss of rain on cedar shingles, the wet chill in the air, and the quiet dignity of a city that has perfected the art of the shadow.',
      ],
      technicalNote: '35mm f/1.4 Prime @ f/1.8 · Exposure bracketed for lantern highlights.',
      takeaway: 'Do not expose the night like the day. Let the shadows do the storytelling.',
    },
  },
  {
    slug: 'aerial-survey-namib',
    title: 'Topographic Geometry from 400 Feet: Sossusvlei',
    category: 'Filmmaking Stories',
    date: 'November 19, 2024',
    readTime: '5 min read',
    location: 'Namib-Naukluft National Park, Namibia',
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1800&q=85',
    coverAlt: 'Geometric razor-sharp shadow casting across deep crimson sand dunes',
    excerpt:
      'Navigating thermal winds and shifting red sands while framing the purest shadow lines in the Southern Hemisphere.',
    content: {
      introParagraph:
        'From ground level, Dune 45 is a monumental mountain of red sand. But lift an aircraft four hundred feet into the desert sky at sunrise, and the landscape dissolves into pure abstract mathematics.',
      quote:
        'At altitude, the Earth reveals geometries that terrestrial walking could never comprehend.',
      quoteAuthor: 'Flight Log 22 · Sossusvlei Air Operations',
      bodyParagraphs: [
        'The dunes of the Namib Desert are among the oldest in the world. Sculpted by millions of years of oceanic wind currents from the Atlantic, their razor-sharp ridgelines divide the world into two distinct halves: brilliant ochre sun on one facet, and velvet black void on the other.',
        'Flying a drone in this environment requires intense discipline. Fine red quartz dust finds its way into motor bearings and sensor seals. The morning thermals rising off the hot sand create unpredictable turbulence. Working with a dual-operator configuration allowed our pilot to navigate wind shear while the gimbal operator maintained geometric precision.',
        'The resulting 8K sequences feel less like documentary footage and more like moving paintings. The lines are so clean that scale dissolves entirely: a ridge could be three miles long or three inches.',
      ],
      technicalNote: 'DJI Inspire 3 · Zenmuse X9-8K Air · DL 24mm F2.8 Cinema Prime.',
      takeaway: 'Aerial cinematography is not about flying higher; it is about finding new spatial relationships.',
    },
  },
  {
    slug: 'soundstage-quiet',
    title: 'The Art of Stillness on a Commercial Set',
    category: 'Behind the Scenes',
    date: 'October 03, 2024',
    readTime: '4 min read',
    location: 'London Production Stage',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=85',
    coverAlt: 'Art gala gathering illuminated by warm ambient gallery spotlights',
    excerpt:
      'How cultivating calm within a 40-person crew creates the conditions for spontaneous documentary intimacy.',
    content: {
      introParagraph:
        'High-budget commercial sets are notoriously noisy ecosystems: walkie-talkies crackling, grip trucks shifting c-stands, client monitors humming, and lighting crews adjusting diffusion overhead.',
      quote:
        'Intimacy on camera cannot be coerced by force. It can only occur when the director creates a sanctuary of stillness.',
      quoteAuthor: 'Director’s Notebook · Commercial Notes',
      bodyParagraphs: [
        'On a recent automotive and lifestyle production, we instituted a simple ritual: three minutes of absolute silence on set before turning the camera over for the hero close-up. No walkie chatter, no adjustments. Just breathing.',
        'The shift in energy was palpable. The talent’s posture relaxed from performative tension into quiet vulnerability. When the director called action with a whisper, the camera operator moved in not as an intruder, but as a confidant.',
        'The client remarked that the final frame felt unlike any standard advertisement they had ever produced. It felt like a private, unscripted moment accidentally discovered. Stillness is not a luxury on set; it is the fundamental soil from which honest performance grows.',
      ],
      technicalNote: 'ARRI Alexa Mini LF on Steadicam · Cooke 40mm Anamorphic Prime.',
      takeaway: 'Quiet on set is the ultimate production value.',
    },
  },
  {
    slug: 'brutalist-shadows',
    title: 'Architectural Monoliths: Composing with Concrete',
    category: 'Field Notes',
    date: 'September 12, 2024',
    readTime: '4 min read',
    location: 'Copenhagen, Denmark',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
    coverAlt: 'Brutalist glass and concrete high-rise angular geometry',
    excerpt:
      'Copenhagen’s contemporary monolithic facades offer a masterclass in negative space, natural light angles, and monumental proportion.',
    content: {
      introParagraph:
        'Brutalist and modernist architecture does not ask for flattering angles. It demands that the photographer confront its scale directly with rigorous perspective control and patience for the shifting sun.',
      quote:
        'Concrete is liquid stone given form by human imagination. To photograph it is to document the dance between weight and sunlight.',
      quoteAuthor: 'Architectural Studies Vol. II',
      bodyParagraphs: [
        'During three days in Copenhagen, I revisited a single concrete civic structure across different times of day. At noon, the harsh downward sun created merciless contrast that flattened the facade. But at 4:30 PM, the low Nordic light carved deep geometric triangles into the recessed balconies.',
        'By utilizing a shift lens, I eliminated keystoning and vertical convergence, allowing the monumental vertical lines of the structure to run parallel to the edges of the frame. This gives the building its architectural integrity while letting negative space dominate the composition.',
        'Architectural photography is fundamentally an exercise in discipline: you cannot move the building. You can only move yourself, and wait for the sun to align with the architect’s original dream.',
      ],
      technicalNote: 'Canon TS-E 24mm f/3.5L II Shift Lens on high-resolution body with geared tripod head.',
      takeaway: 'Perspective control is not a technical trick; it is respect for the architect’s lines.',
    },
  },
];
