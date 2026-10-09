from django.core.management.base import BaseCommand
from apps.content.models import (
    Discipline,
    PortfolioCategory,
    PortfolioItem,
    Reel,
    JournalPost,
    ServiceGroup,
    ServiceOffering,
    SiteSettings,
    SocialLink,
    AboutProfile,
    PhilosophyTenet,
    Skill,
    EquipmentCategory,
    ProfessionalNote,
)


class Command(BaseCommand):
    help = "Seed database with initial content from audited portfolio mock data (idempotent)."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding content..."))

        # ----------------------------------------------------------------------
        # 1. Disciplines & Categories
        # ----------------------------------------------------------------------
        disciplines_info = {
            'photography': {
                'name': 'Photography',
                'tagline': 'Medium format & 35mm intentional still captures',
                'description': (
                    'Editorial, fine art, and commercial still photography characterized '
                    'by chiaroscuro lighting, tactile texture, and natural intimacy.'
                ),
                'hero_image_url': 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1800&q=85',
                'hero_image_alt': 'Fine art still study of glacial ridges',
                'sort_order': 1,
                'categories': [
                    'Portrait',
                    'Event',
                    'Wedding',
                    'Travel',
                    'Street',
                    'Product',
                    'Corporate',
                ],
            },
            'cinematography': {
                'name': 'Cinematography',
                'tagline': 'Anamorphic motion & documentary storytelling',
                'description': (
                    'Motion pictures crafted with deliberate pacing, rich color science, '
                    'and cinematic framing for narrative films, commercial campaigns, and cultural events.'
                ),
                'hero_image_url': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1800&q=85',
                'hero_image_alt': 'Tokyo night street scene in rain',
                'sort_order': 2,
                'categories': ['Event Videos', 'Commercial Projects', 'Documentary'],
            },
            'drone': {
                'name': 'Drone Operations',
                'tagline': 'Licensed high-altitude aerial perspectives & topological cinema',
                'description': (
                    'Certified sub-meter precision aerial cinematography and fine art aerial stills, '
                    'capturing Earth’s geometries and expansive architectural footprints.'
                ),
                'hero_image_url': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1800&q=85',
                'hero_image_alt': 'Topographical aerial photography of Namibian sand ridges',
                'sort_order': 3,
                'categories': [
                    'Aerial Photography',
                    'Aerial Cinematic Videos',
                    'Real Estate Aerial Coverage',
                ],
            },
        }

        cat_lookup = {}
        for disc_id, data in disciplines_info.items():
            categories = data.pop('categories')
            disc_obj, _ = Discipline.objects.update_or_create(
                id=disc_id,
                defaults=data
            )
            for idx, cat_name in enumerate(categories, start=1):
                cat_slug = cat_name.lower().replace(' ', '-')
                cat_obj, _ = PortfolioCategory.objects.update_or_create(
                    discipline=disc_obj,
                    name=cat_name,
                    defaults={'slug': cat_slug, 'sort_order': idx}
                )
                cat_lookup[(disc_id, cat_name)] = cat_obj

        self.stdout.write(self.style.SUCCESS("  [OK] Disciplines and categories seeded."))

        # ----------------------------------------------------------------------
        # 2. Portfolio Items
        # ----------------------------------------------------------------------
        portfolio_items_data = [
            # PHOTOGRAPHY
            {
                'slug': 'solitude-in-svalbard',
                'title': 'Solitude in Svalbard',
                'discipline_id': 'photography',
                'category_name': 'Travel',
                'media_type': 'image',
                'image_url': 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1800&q=85',
                'alt': 'Iceberg towering over dark arctic waters in Svalbard under pale Nordic light',
                'aspect_ratio': 'wide',
                'year': '2025',
                'location': 'Svalbard, Norway',
                'client_or_context': 'Independent Fine Art Series',
                'description': 'A quiet study of retreating glacial structures under late arctic winter illumination, shot on medium format digital.',
                'is_featured': True,
                'featured_order': 1,
                'sort_order': 1,
            },
            {
                'slug': 'seraphina-nocturne',
                'title': 'Seraphina in Shadow',
                'discipline_id': 'photography',
                'category_name': 'Portrait',
                'media_type': 'image',
                'image_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85',
                'alt': 'Editorial portrait of woman with chiaroscuro rim lighting',
                'aspect_ratio': 'portrait',
                'year': '2025',
                'location': 'Milan, Italy',
                'client_or_context': 'Vogue Italia Editorial Submission',
                'description': 'Exploration of high-contrast natural window illumination and sculptural human form.',
                'is_featured': False,
                'featured_order': 0,
                'sort_order': 2,
            },
            {
                'slug': 'the-monolith',
                'title': 'The Monolith Pavilion',
                'discipline_id': 'photography',
                'category_name': 'Corporate',
                'media_type': 'image',
                'image_url': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Brutalist glass and concrete high-rise angular geometry',
                'aspect_ratio': 'landscape',
                'year': '2024',
                'location': 'Copenhagen, Denmark',
                'client_or_context': 'Nordic Architecture Biennale',
                'description': 'Geometric interplay of raw structural facades and rhythmic glass reflections.',
                'is_featured': True,
                'featured_order': 5,
                'sort_order': 3,
            },
            {
                'slug': 'rain-over-shinjuku',
                'title': 'Rain Over Shinjuku',
                'discipline_id': 'photography',
                'category_name': 'Street',
                'media_type': 'image',
                'image_url': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Tokyo pedestrian intersection with reflections in rain puddles',
                'aspect_ratio': 'landscape',
                'year': '2024',
                'location': 'Tokyo, Japan',
                'client_or_context': 'Street Chronicles Vol. IV',
                'description': 'Candid urban cadence captured during typhoon twilight on 35mm f/1.4 lens.',
                'is_featured': False,
                'featured_order': 0,
                'sort_order': 4,
            },
            {
                'slug': 'aethelgard-estate',
                'title': 'The Solitary Vow',
                'discipline_id': 'photography',
                'category_name': 'Wedding',
                'media_type': 'image',
                'image_url': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Intimate editorial wedding couple silhouetted against historic stone cloister',
                'aspect_ratio': 'portrait',
                'year': '2024',
                'location': 'Lake Como, Italy',
                'client_or_context': 'Private Commission',
                'description': 'Documentary wedding coverage focusing on unprompted intimacy and architectural heritage.',
                'is_featured': False,
                'featured_order': 0,
                'sort_order': 5,
            },
            {
                'slug': 'atelier-botanica',
                'title': 'Vessel & Petal',
                'discipline_id': 'photography',
                'category_name': 'Product',
                'media_type': 'image',
                'image_url': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Minimal ceramic perfume bottle on travertine stone surface with botanical stem',
                'aspect_ratio': 'square',
                'year': '2025',
                'location': 'Paris, France',
                'client_or_context': 'Maison Éthérée Campaign',
                'description': 'Tactile luxury fragrance still life balancing organic geometry and muted earthy minerals.',
                'is_featured': False,
                'featured_order': 0,
                'sort_order': 6,
            },
            {
                'slug': 'venice-biennale-vernissage',
                'title': 'Vernissage Nocturne',
                'discipline_id': 'photography',
                'category_name': 'Event',
                'media_type': 'image',
                'image_url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Art gala gathering illuminated by warm ambient gallery spotlights',
                'aspect_ratio': 'landscape',
                'year': '2024',
                'location': 'Venice, Italy',
                'client_or_context': 'La Biennale di Venezia',
                'description': 'Quiet observation of patrons and collectors encountering contemporary light installations.',
                'is_featured': False,
                'featured_order': 0,
                'sort_order': 7,
            },
            # CINEMATOGRAPHY
            {
                'slug': 'nocturne-in-kyoto',
                'title': 'Nocturne in Kyoto',
                'discipline_id': 'cinematography',
                'category_name': 'Documentary',
                'media_type': 'video',
                'image_url': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Gion alleyway wet from evening rain illuminated by red lanterns',
                'aspect_ratio': 'wide',
                'year': '2024',
                'location': 'Kyoto, Japan',
                'client_or_context': 'NHK World Documentary Feature',
                'description': 'Short cinematic portrait documenting third-generation tea masters in Kyoto’s historic preservation district.',
                'is_featured': True,
                'featured_order': 3,
                'sort_order': 8,
            },
            {
                'slug': 'chroma-velocity',
                'title': 'Chroma Velocity',
                'discipline_id': 'cinematography',
                'category_name': 'Commercial Projects',
                'media_type': 'video',
                'image_url': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Sleek luxury coupe drifting along wet mountain hairpin curve at dusk',
                'aspect_ratio': 'landscape',
                'year': '2025',
                'location': 'Grossglockner Pass, Austria',
                'client_or_context': 'Porsche Design Global Digital',
                'description': 'High-speed automotive commercial filmed with anamorphic primes and Russian arm tracking system.',
                'is_featured': False,
                'featured_order': 0,
                'sort_order': 9,
            },
            {
                'slug': 'symphony-at-dusk',
                'title': 'Philharmonic at Open Air',
                'discipline_id': 'cinematography',
                'category_name': 'Event Videos',
                'media_type': 'video',
                'image_url': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Conductor directing orchestral players under twilight amphitheater dome',
                'aspect_ratio': 'landscape',
                'year': '2024',
                'location': 'Verona, Italy',
                'client_or_context': 'Arena di Verona Opera Festival',
                'description': 'Multi-camera cinematic concert capture recorded in 24fps high dynamic range.',
                'is_featured': False,
                'featured_order': 0,
                'sort_order': 10,
            },
            # DRONE
            {
                'slug': 'elysian-dunes',
                'title': 'Elysian Dunes',
                'discipline_id': 'drone',
                'category_name': 'Aerial Photography',
                'media_type': 'image',
                'image_url': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Geometric razor-sharp shadow casting across deep crimson sand dunes',
                'aspect_ratio': 'landscape',
                'year': '2025',
                'location': 'Sossusvlei, Namibia',
                'client_or_context': 'National Geographic Traveler',
                'description': 'Top-down 400ft vertical capture showing mathematical ridges sculpted by southwest Atlantic winds.',
                'is_featured': True,
                'featured_order': 2,
                'sort_order': 11,
            },
            {
                'slug': 'tides-of-the-atlantic',
                'title': 'Tides of the Atlantic',
                'discipline_id': 'drone',
                'category_name': 'Aerial Cinematic Videos',
                'media_type': 'video',
                'image_url': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Dramatic coastal cliffs battered by emerald waves from a high drone vantage',
                'aspect_ratio': 'wide',
                'year': '2024',
                'location': 'Faroe Islands',
                'client_or_context': 'Atlantic Motion Studies',
                'description': 'High wind cinematic tracking sequence following sea spray against 300-meter basalt cliffs.',
                'is_featured': True,
                'featured_order': 4,
                'sort_order': 12,
            },
            {
                'slug': 'solvalla-residence',
                'title': 'Villa Solvalla Waterfront',
                'discipline_id': 'drone',
                'category_name': 'Real Estate Aerial Coverage',
                'media_type': 'image',
                'image_url': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Architectural modernist waterfront villa seamlessly integrated into pine cliff edge',
                'aspect_ratio': 'landscape',
                'year': '2025',
                'location': 'Stockholm Archipelago, Sweden',
                'client_or_context': 'Sotheby’s International Realty',
                'description': 'Comprehensive dawn-to-dusk topological survey showcasing architectural harmony with natural shoreline.',
                'is_featured': False,
                'featured_order': 0,
                'sort_order': 13,
            },
            {
                'slug': 'icelandic-veins',
                'title': 'Glacial Braids & Volcanic Veins',
                'discipline_id': 'drone',
                'category_name': 'Aerial Photography',
                'media_type': 'image',
                'image_url': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
                'alt': 'Top-down aerial view of braided glacial river crossing black volcanic sand',
                'aspect_ratio': 'portrait',
                'year': '2024',
                'location': 'South Coast, Iceland',
                'client_or_context': 'Nordic Geological Archive',
                'description': 'Orthogonal fine art perspective of sediment ribbons weaving across black basalt sands.',
                'is_featured': False,
                'featured_order': 0,
                'sort_order': 14,
            },
        ]

        for item in portfolio_items_data:
            disc_id = item.pop('discipline_id')
            cat_name = item.pop('category_name')
            category_obj = cat_lookup.get((disc_id, cat_name))

            PortfolioItem.objects.update_or_create(
                slug=item['slug'],
                defaults={
                    **item,
                    'discipline_id': disc_id,
                    'category': category_obj,
                    'category_name': cat_name,
                }
            )

        self.stdout.write(self.style.SUCCESS(f"  [OK] {len(portfolio_items_data)} portfolio items seeded."))

        # ----------------------------------------------------------------------
        # 3. Reels
        # ----------------------------------------------------------------------
        reels_data = [
            {
                'slug': 'alps-in-cloudbreak',
                'title': 'Alps in Cloudbreak',
                'category': 'Travel',
                'poster_url': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
                'video_src': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                'youtube_video_id': 'dQw4w9WgXcQ',
                'duration': '0:45',
                'aspect_ratio': 'vertical',
                'year': '2025',
                'location': 'Dolomites, Italy',
                'gear_or_format': 'Shot on iPhone 16 Pro Max · Apple Log / 4K ProRes',
                'description': 'Passing storm fronts parting over the Tre Cime pinnacles during golden hour.',
                'sort_order': 1,
            },
            {
                'slug': '35mm-anamorphic-rigging',
                'title': '35mm Anamorphic Rigging',
                'category': 'Behind the Scenes',
                'poster_url': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85',
                'video_src': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
                'youtube_video_id': 'kJQP7kiw5Fk',
                'duration': '0:30',
                'aspect_ratio': 'vertical',
                'year': '2025',
                'location': 'Tokyo Soundstage',
                'gear_or_format': 'ARRI Alexa Mini LF · Atlas Orion Anamorphic Primes',
                'description': 'Precision lens balancing and wireless follow focus calibration before night shooting.',
                'sort_order': 2,
            },
            {
                'slug': 'venetian-masquerade',
                'title': 'The Venetian Masquerade',
                'category': 'Events',
                'poster_url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
                'video_src': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                'youtube_video_id': '9bZkp7q19f0',
                'duration': '1:15',
                'aspect_ratio': 'cinematic',
                'year': '2024',
                'location': 'Venice, Italy',
                'gear_or_format': 'Sony FX6 · Cooke Anamorphic /i Full Frame Plus',
                'description': 'Gala ballroom evening captured under candlelight and historic chandeliers.',
                'sort_order': 3,
            },
            {
                'slug': 'rain-echoes-over-gion',
                'title': 'Rain Echoes over Gion',
                'category': 'Cinematic Shorts',
                'poster_url': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85',
                'video_src': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
                'youtube_video_id': '3JZ_D3ELwOQ',
                'duration': '1:02',
                'aspect_ratio': 'cinematic',
                'year': '2024',
                'location': 'Kyoto, Japan',
                'gear_or_format': 'RED V-Raptor 8K VV · Leica Summilux-C',
                'description': 'Atmospheric nocturnal portrait along the stone walkways of historic Kyoto.',
                'sort_order': 4,
            },
            {
                'slug': 'sculpting-shadow-and-mineral',
                'title': 'Sculpting Shadow & Mineral',
                'category': 'Creative Projects',
                'poster_url': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
                'video_src': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                'youtube_video_id': '2Vv-BfVoq4g',
                'duration': '0:38',
                'aspect_ratio': 'vertical',
                'year': '2025',
                'location': 'Paris Atelier',
                'gear_or_format': 'Hasselblad 907X 50C · Macro Cine 120mm',
                'description': 'Macro textural movement capturing raw terracotta and hand-cast bronze vessels.',
                'sort_order': 5,
            },
            {
                'slug': 'namibian-twilight-flight',
                'title': 'Namibian Twilight Flight',
                'category': 'Travel',
                'poster_url': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85',
                'video_src': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
                'youtube_video_id': 'fJ9rUzIMcZQ',
                'duration': '0:52',
                'aspect_ratio': 'vertical',
                'year': '2025',
                'location': 'Sossusvlei, Namibia',
                'gear_or_format': 'DJI Inspire 3 · Zenmuse X9-8K Air Gimbal',
                'description': 'High-altitude aerodynamic tracking skimming the peaks of crimson sand ridges.',
                'sort_order': 6,
            },
            {
                'slug': 'drone-calibration-at-4000m',
                'title': 'Drone Calibration at 4,000m',
                'category': 'Behind the Scenes',
                'poster_url': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
                'video_src': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                'youtube_video_id': 'L_LUpnjgPso',
                'duration': '0:28',
                'aspect_ratio': 'vertical',
                'year': '2024',
                'location': 'Swiss Alps',
                'gear_or_format': 'DJI Ronin 4D 8K · Cold Weather Battery Preheaters',
                'description': 'Pre-flight propeller de-icing and barometric sensor zeroing at sub-zero peak elevations.',
                'sort_order': 7,
            },
            {
                'slug': 'symphony-at-the-arena',
                'title': 'Symphony at the Arena',
                'category': 'Events',
                'poster_url': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=85',
                'video_src': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
                'youtube_video_id': 'kffacxfA7G4',
                'duration': '1:20',
                'aspect_ratio': 'cinematic',
                'year': '2024',
                'location': 'Verona, Italy',
                'gear_or_format': 'Multi-Cam ARRI Amira Broadcast Package',
                'description': 'Live symphonic performance crescendo recorded during late summer dusk.',
                'sort_order': 8,
            },
            {
                'slug': 'glacial-solitude',
                'title': 'Glacial Solitude',
                'category': 'Cinematic Shorts',
                'poster_url': 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85',
                'video_src': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
                'youtube_video_id': 'M7lc1UVf-VE',
                'duration': '0:58',
                'aspect_ratio': 'cinematic',
                'year': '2025',
                'location': 'Svalbard, Norway',
                'gear_or_format': 'Canon Cinema EOS C500 Mark II · Raw Light 6K',
                'description': 'Slow meditative drift through drifting pack ice along the 78th parallel north.',
                'sort_order': 9,
            },
            {
                'slug': 'brutalist-monochrome',
                'title': 'Brutalist Monochrome',
                'category': 'Creative Projects',
                'poster_url': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
                'video_src': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
                'youtube_video_id': 'OPf0YbXqDm0',
                'duration': '0:42',
                'aspect_ratio': 'vertical',
                'year': '2024',
                'location': 'Copenhagen, Denmark',
                'gear_or_format': 'Blackmagic Cinema Camera 6K · Zeiss Milvus Primes',
                'description': 'Architectural shadows moving across polished concrete surfaces over twelve hours.',
                'sort_order': 10,
            },
        ]

        for reel in reels_data:
            Reel.objects.update_or_create(
                slug=reel['slug'],
                defaults=reel
            )

        self.stdout.write(self.style.SUCCESS(f"  [OK] {len(reels_data)} reels seeded."))

        # ----------------------------------------------------------------------
        # 4. Journal Posts
        # ----------------------------------------------------------------------
        journal_posts_data = [
            {
                'slug': 'arctic-light-svalbard',
                'title': 'Chasing Low Horizon Light in the Arctic Circle',
                'category': 'Travel Experiences',
                'published_date': 'February 14, 2025',
                'read_time': '5 min read',
                'location': 'Svalbard, Norway (78°N)',
                'cover_image_url': 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1800&q=85',
                'cover_alt': 'Iceberg towering over dark arctic waters in Svalbard under pale Nordic light',
                'excerpt': 'When the sun hovers perpetually below the rim of the earth, blue hour stretches for five uninterrupted hours across Svalbard’s frozen fjords.',
                'intro_paragraph': 'At seventy-eight degrees north, time begins to lose its customary grip on daylight. In late winter, the polar dawn arrives not with an abrupt sunrise, but as a deliberate, glacial bloom of lavender, cobalt, and pale amber along the southern rim of the horizon.',
                'quote': 'The arctic does not offer warm welcomes; it offers silence so absolute that you hear the crystallization of your own breath.',
                'quote_author': 'Field Notebook 09 · Longyearbyen',
                'body_paragraphs': [
                    'Operating in temperatures fluctuating between minus twenty-two and minus thirty-five degrees Celsius demands a renegotiation with every piece of equipment. Mechanical grease in prime focus rings stiffens to molasses. Lithium-ion batteries drop from eighty percent to shutdown in a matter of twenty minutes if not kept inside insulated thermal layers against the body.',
                    'Yet this brutal friction forces an intentionality that modern digital photography rarely demands. You do not fire bursts of high-speed frames with frozen thumbs. You scout on snowshoes for two hours, identify the singular structural crease where the glacier meets sea pack, align your tilt-shift axis, and wait for the twilight gradient to balance against the ice.',
                    'The resultant medium format frames possess a tactile, crystalline weight that cannot be simulated in post-production. They stand as a testament to the quiet majesty of our planet’s cold frontiers.',
                ],
                'technical_note': 'Shot on Hasselblad 907X 50C with 45P lens · Mechanical shutter @ 1/60s f/8 ISO 100.',
                'takeaway': 'Cold weather demands simplicity: one camera body, one prime lens, and total spatial awareness.',
                'sort_order': 1,
            },
            {
                'slug': 'anamorphic-glass-character',
                'title': 'Why Imperfect Anamorphic Glass Tells Better Stories',
                'category': 'Gear & Optics',
                'published_date': 'January 22, 2025',
                'read_time': '4 min read',
                'location': 'Studio Notes · Lens Bench',
                'cover_image_url': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1800&q=85',
                'cover_alt': 'Cinematic silhouette of photographer overlooking misty mountain valley at dawn',
                'excerpt': 'In an era of hyper-sharp digital sensors, vintage cinema glass and deliberate barrel distortion restore the human tactile presence.',
                'intro_paragraph': 'Modern optical engineering has arrived at near-clinical perfection: edge-to-edge sharpness, zero chromatic aberration, zero geometric distortion, and sterile flare suppression. And yet, filmmakers everywhere find themselves reaching backward toward vintage glass.',
                'quote': 'Perfection in optics is technically remarkable, but character in optics is what touches the human heart.',
                'quote_author': 'Notes on Cinematic Optics',
                'body_paragraphs': [
                    'Anamorphic optical designs introduce a unique set of deliberate imperfections: elliptical out-of-focus highlights, gentle horizontal breathing during focus pulls, warm organic flares that respond to practical lights, and an oval bokeh that draws the eye toward the center of the frame.',
                    'When capturing narrative drama or high-end commercial imagery, these optical characteristics strip away the sterile digital barrier between the screen and the viewer. The frame breathes. The human face takes on a dimensional roundness rather than a clinical flat rendering.',
                    'By pairing high-resolution large-format cinema sensors with classic 2x squeeze anamorphic primes, we achieve the best of both worlds: modern dynamic range and latitude, enveloped in the rich organic soul of twentieth-century cinema.',
                ],
                'technical_note': 'Atlas Orion Anamorphic 50mm T2.0 paired with ARRI Alexa Mini LF in 4:3 Sensor Mode.',
                'takeaway': 'Never choose optical sharpness at the expense of emotional atmosphere and lens soul.',
                'sort_order': 2,
            },
            {
                'slug': 'night-cadence-kyoto',
                'title': 'Rain, Reflections, and 35mm Shutter in Kyoto',
                'category': 'Photography Stories',
                'published_date': 'December 08, 2024',
                'read_time': '6 min read',
                'location': 'Kyoto, Japan (Gion & Pontocho)',
                'cover_image_url': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1800&q=85',
                'cover_alt': 'Gion alleyway wet from evening rain illuminated by red lanterns',
                'excerpt': 'Navigating the wet flagstones of Gion with a single prime lens, learning that darkness is not the absence of light, but its frame.',
                'intro_paragraph': 'Rain in Kyoto transforms the old capital into a reflective mirror. The wet basalt paving stones catch the warm vermilion glow of paper andon lanterns, casting long crimson streaks into the shadows.',
                'quote': 'Shadows in traditional Japanese architecture are not empty voids; they are deliberate spaces designed to hold mystery.',
                'quote_author': 'Field Notebook 07 · Kyoto Dusk',
                'body_paragraphs': [
                    'Walking through Pontocho during an autumn downpour with a weather-sealed body and an ultra-fast 35mm prime forces a photographer into a quiet observational rhythm. You tuck yourself under timber eves, watching the passing umbrellas and silhouettes against paper shoji screens.',
                    'Rather than fighting the darkness by cranking exposures to daylight levels, I allowed the blacks to fall where they naturally lived. The goal was chiaroscuro: isolated pools of lantern light illuminating steam from a noodle shop or the damp hem of a silk kimono.',
                    'The final images resonate because they preserve the true sensory memory of being there: the hiss of rain on cedar shingles, the wet chill in the air, and the quiet dignity of a city that has perfected the art of the shadow.',
                ],
                'technical_note': '35mm f/1.4 Prime @ f/1.8 · Exposure bracketed for lantern highlights.',
                'takeaway': 'Do not expose the night like the day. Let the shadows do the storytelling.',
                'sort_order': 3,
            },
            {
                'slug': 'aerial-survey-namib',
                'title': 'Topographic Geometry from 400 Feet: Sossusvlei',
                'category': 'Filmmaking Stories',
                'published_date': 'November 19, 2024',
                'read_time': '5 min read',
                'location': 'Namib-Naukluft National Park, Namibia',
                'cover_image_url': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1800&q=85',
                'cover_alt': 'Geometric razor-sharp shadow casting across deep crimson sand dunes',
                'excerpt': 'Navigating thermal winds and shifting red sands while framing the purest shadow lines in the Southern Hemisphere.',
                'intro_paragraph': 'From ground level, Dune 45 is a monumental mountain of red sand. But lift an aircraft four hundred feet into the desert sky at sunrise, and the landscape dissolves into pure abstract mathematics.',
                'quote': 'At altitude, the Earth reveals geometries that terrestrial walking could never comprehend.',
                'quote_author': 'Flight Log 22 · Sossusvlei Air Operations',
                'body_paragraphs': [
                    'The dunes of the Namib Desert are among the oldest in the world. Sculpted by millions of years of oceanic wind currents from the Atlantic, their razor-sharp ridgelines divide the world into two distinct halves: brilliant ochre sun on one facet, and velvet black void on the other.',
                    'Flying a drone in this environment requires intense discipline. Fine red quartz dust finds its way into motor bearings and sensor seals. The morning thermals rising off the hot sand create unpredictable turbulence. Working with a dual-operator configuration allowed our pilot to navigate wind shear while the gimbal operator maintained geometric precision.',
                    'The resulting 8K sequences feel less like documentary footage and more like moving paintings. The lines are so clean that scale dissolves entirely: a ridge could be three miles long or three inches.',
                ],
                'technical_note': 'DJI Inspire 3 · Zenmuse X9-8K Air · DL 24mm F2.8 Cinema Prime.',
                'takeaway': 'Aerial cinematography is not about flying higher; it is about finding new spatial relationships.',
                'sort_order': 4,
            },
            {
                'slug': 'soundstage-quiet',
                'title': 'The Art of Stillness on a Commercial Set',
                'category': 'Behind the Scenes',
                'published_date': 'October 03, 2024',
                'read_time': '4 min read',
                'location': 'London Production Stage',
                'cover_image_url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=85',
                'cover_alt': 'Art gala gathering illuminated by warm ambient gallery spotlights',
                'excerpt': 'How cultivating calm within a 40-person crew creates the conditions for spontaneous documentary intimacy.',
                'intro_paragraph': 'High-budget commercial sets are notoriously noisy ecosystems: walkie-talkies crackling, grip trucks shifting c-stands, client monitors humming, and lighting crews adjusting diffusion overhead.',
                'quote': 'Intimacy on camera cannot be coerced by force. It can only occur when the director creates a sanctuary of stillness.',
                'quote_author': 'Director’s Notebook · Commercial Notes',
                'body_paragraphs': [
                    'On a recent automotive and lifestyle production, we instituted a simple ritual: three minutes of absolute silence on set before turning the camera over for the hero close-up. No walkie chatter, no adjustments. Just breathing.',
                    'The shift in energy was palpable. The talent’s posture relaxed from performative tension into quiet vulnerability. When the director called action with a whisper, the camera operator moved in not as an intruder, but as a confidant.',
                    'The client remarked that the final frame felt unlike any standard advertisement they had ever produced. It felt like a private, unscripted moment accidentally discovered. Stillness is not a luxury on set; it is the fundamental soil from which honest performance grows.',
                ],
                'technical_note': 'ARRI Alexa Mini LF on Steadicam · Cooke 40mm Anamorphic Prime.',
                'takeaway': 'Quiet on set is the ultimate production value.',
                'sort_order': 5,
            },
            {
                'slug': 'brutalist-shadows',
                'title': 'Architectural Monoliths: Composing with Concrete',
                'category': 'Field Notes',
                'published_date': 'September 12, 2024',
                'read_time': '4 min read',
                'location': 'Copenhagen, Denmark',
                'cover_image_url': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
                'cover_alt': 'Brutalist glass and concrete high-rise angular geometry',
                'excerpt': 'Copenhagen’s contemporary monolithic facades offer a masterclass in negative space, natural light angles, and monumental proportion.',
                'intro_paragraph': 'Brutalist and modernist architecture does not ask for flattering angles. It demands that the photographer confront its scale directly with rigorous perspective control and patience for the shifting sun.',
                'quote': 'Concrete is liquid stone given form by human imagination. To photograph it is to document the dance between weight and sunlight.',
                'quote_author': 'Architectural Studies Vol. II',
                'body_paragraphs': [
                    'During three days in Copenhagen, I revisited a single concrete civic structure across different times of day. At noon, the harsh downward sun created merciless contrast that flattened the facade. But at 4:30 PM, the low Nordic light carved deep geometric triangles into the recessed balconies.',
                    'By utilizing a shift lens, I eliminated keystoning and vertical convergence, allowing the monumental vertical lines of the structure to run parallel to the edges of the frame. This gives the building its architectural integrity while letting negative space dominate the composition.',
                    'Architectural photography is fundamentally an exercise in discipline: you cannot move the building. You can only move yourself, and wait for the sun to align with the architect’s original dream.',
                ],
                'technical_note': 'Canon TS-E 24mm f/3.5L II Shift Lens on high-resolution body with geared tripod head.',
                'takeaway': 'Perspective control is not a technical trick; it is respect for the architect’s lines.',
                'sort_order': 6,
            },
        ]

        for post in journal_posts_data:
            JournalPost.objects.update_or_create(
                slug=post['slug'],
                defaults=post
            )

        self.stdout.write(self.style.SUCCESS(f"  [OK] {len(journal_posts_data)} journal posts seeded."))

        # ----------------------------------------------------------------------
        # 5. Services
        # ----------------------------------------------------------------------
        services_groups_data = [
            {
                'id': 'photography',
                'number': '01',
                'discipline': 'Photography',
                'tagline': 'Medium format & 35mm intentional still captures',
                'description': 'Tactile, chiaroscuro still imagery focusing on architectural balance, candid emotion, and raw environmental atmosphere.',
                'hero_image_url': 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=85',
                'image_alt': 'Fine art monochrome still photography study of glacial ridges',
                'sort_order': 1,
                'services': [
                    {
                        'slug': 'photo-event',
                        'name': 'Event Photography',
                        'description': 'Unobtrusive, documentary coverage of high-profile galas, private gatherings, cultural exhibitions, and artistic vernissages.',
                        'deliverables': 'Curated high-res editorial archive, same-day press selects',
                        'sort_order': 1,
                    },
                    {
                        'slug': 'photo-wedding',
                        'name': 'Wedding Photography',
                        'description': 'Intimate, cinematic documentation capturing authentic moments, architectural backdrops, and timeless human connection.',
                        'deliverables': 'Full-resolution master digital archive & archival fine art print selects',
                        'sort_order': 2,
                    },
                    {
                        'slug': 'photo-portrait',
                        'name': 'Portrait Sessions',
                        'description': 'Editorial portraits for artists, directors, founders, and cultural publications using natural directional window illumination.',
                        'deliverables': 'Retouched medium format master captures with bespoke color grading',
                        'sort_order': 3,
                    },
                    {
                        'slug': 'photo-corporate',
                        'name': 'Corporate & Architecture',
                        'description': 'Geometric architectural surveys and refined executive imagery capturing structural rhythm, materials, and enterprise culture.',
                        'deliverables': 'Architectural corrected masters for print monographs and annual reports',
                        'sort_order': 4,
                    },
                    {
                        'slug': 'photo-product',
                        'name': 'Product & Still Life',
                        'description': 'Tactile luxury fragrance, horology, and artisanal object studies emphasizing organic textures, travertine stone, and shadow.',
                        'deliverables': 'Macro high-resolution commercial campaign masters',
                        'sort_order': 5,
                    },
                ],
            },
            {
                'id': 'cinematography',
                'number': '02',
                'discipline': 'Cinematography',
                'tagline': 'Anamorphic motion pictures & documentary narratives',
                'description': 'Narrative films and brand stories directed with cinematic restraint, optical anamorphic flares, and deliberate camera motion.',
                'hero_image_url': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
                'image_alt': 'Cinematic rain-slicked Tokyo street under red lantern illumination',
                'sort_order': 2,
                'services': [
                    {
                        'slug': 'cine-event-coverage',
                        'name': 'Event Video Coverage',
                        'description': 'Multi-camera cinematic documentation of cultural galas, symposiums, and live orchestral performances in pristine 24fps.',
                        'deliverables': 'Cinematic highlight film & multicam documentary master cut',
                        'sort_order': 1,
                    },
                    {
                        'slug': 'cine-documentary',
                        'name': 'Documentary Production',
                        'description': 'In-depth non-fiction short films and cultural portraits exploring craftsmanship, historical legacies, and human journeys.',
                        'deliverables': 'Festival-ready master deliverables with 5.1 surround sound design',
                        'sort_order': 2,
                    },
                    {
                        'slug': 'cine-promotional',
                        'name': 'Promotional Video',
                        'description': 'Evocative visual anthems for luxury maisons, design studios, and hospitality destinations that immerse the viewer.',
                        'deliverables': '4K ProRes master cuts & optimized social cuts',
                        'sort_order': 3,
                    },
                    {
                        'slug': 'cine-commercial',
                        'name': 'Commercial Films',
                        'description': 'Full-scale commercial campaign production with precision camera movement, gimbal rigs, and broadcast-compliant color grading.',
                        'deliverables': 'Directors cut, broadcast masters, and multilingual localized delivery',
                        'sort_order': 4,
                    },
                    {
                        'slug': 'cine-social-content',
                        'name': 'Social Media Content',
                        'description': 'Vertical 9:16 cinematic micro-narratives tailored for luxury audience engagement without sacrificing photographic integrity.',
                        'deliverables': 'Batch vertical 4K HDR cuts with integrated sound design',
                        'sort_order': 5,
                    },
                ],
            },
            {
                'id': 'drone',
                'number': '03',
                'discipline': 'Drone Operations',
                'tagline': 'Licensed aerial cinema & high-altitude surveying',
                'description': 'Sub-meter precision aerial cinematography using dual-operator flight platforms to capture expansive topographies and architectural forms.',
                'hero_image_url': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
                'image_alt': 'Aerial top-down view of sharp crimson sand ridges in Namibia',
                'sort_order': 3,
                'services': [
                    {
                        'slug': 'drone-aerial-photo',
                        'name': 'Aerial Photography',
                        'description': 'Large-format top-down and oblique fine art aerial stills showcasing mathematical geological formations and natural coastlines.',
                        'deliverables': '8K RAW aerial still masters suitable for gallery scale printing',
                        'sort_order': 1,
                    },
                    {
                        'slug': 'drone-real-estate',
                        'name': 'Real Estate Drone Video',
                        'description': 'Smooth low-altitude sweeping approaches and topological estate overviews highlighting architectural luxury and land boundaries.',
                        'deliverables': 'Cinematic 4K property showcase with boundary overlays',
                        'sort_order': 2,
                    },
                    {
                        'slug': 'drone-event-coverage',
                        'name': 'Event Drone Coverage',
                        'description': 'Permitted, safety-compliant aerial coverage capturing scale, crowd movement, and panoramic evening venue environments.',
                        'deliverables': 'Live broadcast feed integration & edited cinematic recap footage',
                        'sort_order': 3,
                    },
                    {
                        'slug': 'drone-travel',
                        'name': 'Travel Drone Shots',
                        'description': 'Expeditionary aerial surveys traversing remote peaks, fjords, and deserts to provide sweeping establishing vistas.',
                        'deliverables': 'Comprehensive scenic stock archive & sequence delivery',
                        'sort_order': 4,
                    },
                    {
                        'slug': 'drone-cinematic-footage',
                        'name': 'Cinematic Aerial Footage',
                        'description': 'Dynamic high-speed tracking sequences following vehicles, boats, and subjects with synchronized camera tilt and yaw.',
                        'deliverables': 'Cinema DNG / Apple ProRes 8K master footage log recordings',
                        'sort_order': 5,
                    },
                ],
            },
        ]

        for grp in services_groups_data:
            services = grp.pop('services')
            grp_obj, _ = ServiceGroup.objects.update_or_create(
                id=grp['id'],
                defaults=grp
            )
            for s in services:
                ServiceOffering.objects.update_or_create(
                    group=grp_obj,
                    slug=s['slug'],
                    defaults=s
                )

        self.stdout.write(self.style.SUCCESS("  [OK] Services seeded."))

        # ----------------------------------------------------------------------
        # 6. Site Settings & Social Links (Singleton)
        # ----------------------------------------------------------------------
        site_settings, _ = SiteSettings.objects.update_or_create(
            id=1,
            defaults={
                'name': 'Prism Pulse',
                'tagline': 'Photographer · Cinematographer · Drone Operator',
                'disciplines': ['Photography', 'Cinematography', 'Drone'],
                'location': 'Available Worldwide',
                'contact_email': 'commissions@prismpulse-visuals.com',
                'contact_phone': '+1 (415) 890-4421',
                'representation': 'Direct Artist Representation · Available Worldwide',
                'operating_hours': 'Studio Office: Monday – Friday · 09:00 – 18:00 CET',
                'response_note': 'All inquiries are personally reviewed within 24 to 48 hours. Confidential project NDAs supported upon request.',
                'contact_side_image_url': 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=85',
                'contact_side_image_alt': 'Sunlight filtering through forest canopy into deep atmospheric shadows',
                'contact_side_image_caption': 'Field Production Notes · Light & Environmental Scouting · 2025',
                'home_display_name': 'Prism Pulse',
                'home_role_tag': 'PHOTOGRAPHER / DRONE PILOT',
                'home_coordinates': '23.8103° N, 90.4125° E — DHAKA',
                'home_reel_tag': 'REEL 35MM / 4K',
                'home_hero_headline': 'Visual Stories Across Light & Motion',
                'home_hero_intro': 'Dedicated to capturing evocative moments through high-altitude aerial perspectives, intentional 35mm composition, and atmospheric cinematography.',
                'home_hero_image_url': '',
                'home_hero_image_alt': 'Prism Pulse operating drone outdoors in natural landscape',
                'home_hero_caption': 'Field Journal 08 · Aerial Scout · 2025',
            }
        )

        social_data = [
            {'platform': 'Instagram', 'url': 'https://instagram.com', 'handle': '@prismpulse.visuals', 'sort_order': 1},
            {'platform': 'Vimeo', 'url': 'https://vimeo.com', 'handle': 'prismpulsefilms', 'sort_order': 2},
            {'platform': 'YouTube', 'url': 'https://youtube.com', 'handle': '@prismpulsecinema', 'sort_order': 3},
        ]

        for s in social_data:
            SocialLink.objects.update_or_create(
                settings=site_settings,
                platform=s['platform'],
                defaults=s
            )

        self.stdout.write(self.style.SUCCESS("  [OK] Site Settings & Social Links seeded."))

        # ----------------------------------------------------------------------
        # 7. About Profile (Singleton)
        # ----------------------------------------------------------------------
        about_profile, _ = AboutProfile.objects.update_or_create(
            id=1,
            defaults={
                'name': 'Prism Pulse',
                'role': 'Photographer · Cinematographer · Drone Operator',
                'portrait_src': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1600&q=85',
                'portrait_alt': 'Studio portrait of Prism Pulse visual director in warm chiaroscuro ambient light',
                'portrait_caption': 'Studio Archive · Portrait by Natural Window Light · 2025',
                'intro_headline': 'Finding permanence in fleeting light, deliberate motion, and vast horizons.',
                'intro_paragraphs': [
                    'I am an independent visual artist working across still photography, narrative cinematography, and licensed aerial drone operations. Based globally, my practice centers on organic composition and atmospheric depth.',
                    'Whether recording Arctic glaciers from sub-zero elevations or capturing an intimate portrait in 35mm chiaroscuro, my intention remains singular: to strip away visual noise until only the authentic weight of the frame remains.',
                ],
                'philosophy_title': 'Creative Philosophy',
                'philosophy_statement': 'We do not manufacture cinema; we cultivate patience until reality reveals its own poetry.',
                'skills_title': 'Core Disciplines & Technical Craft',
                'equipment_title': 'Selected Production Equipment',
                'equipment_description': 'A dedicated inventory of cinema optics, medium format sensor platforms, and commercial drone systems.',
            }
        )

        tenets_data = [
            {
                'number': '01',
                'title': 'Intentional Restraint',
                'description': 'Every camera movement, focal length choice, and shutter release must serve the emotional cadence of the narrative. Empty space is as vital as the subject.',
                'sort_order': 1,
            },
            {
                'number': '02',
                'title': 'Textural Authenticity',
                'description': 'Honoring raw grain, uncorrected natural light falloff, and tactile imperfection over sterile synthetic digital perfection.',
                'sort_order': 2,
            },
            {
                'number': '03',
                'title': 'Spatial Perspective',
                'description': 'Combining ground-level human intimacy with high-altitude aerial geometry to place human emotion within the planetary scale.',
                'sort_order': 3,
            },
        ]
        for t in tenets_data:
            PhilosophyTenet.objects.update_or_create(
                profile=about_profile,
                number=t['number'],
                defaults=t
            )

        skills_list = [
            'Photography (Editorial, Portrait, Architectural)',
            'Cinematography & Anamorphic Direction',
            'Certified Drone Operations (Sub-meter Flight)',
            'Motion Picture Video Editing',
            'Master Color Grading (ACES & DaVinci Resolve)',
            'Visual Storytelling & Script Development',
            'Creative & Photographic Direction',
            'High-Resolution Post Production & Retouching',
        ]
        for idx, skill_label in enumerate(skills_list, start=1):
            Skill.objects.update_or_create(
                profile=about_profile,
                label=skill_label,
                defaults={'sort_order': idx}
            )

        equipment_data = [
            {
                'group_name': 'Cinema & Still Bodies',
                'items': [
                    'ARRI Alexa Mini LF Cinema System',
                    'Sony FX6 Full-Frame Cinema Line',
                    'Hasselblad 907X 50C Medium Format',
                    'Canon Cinema EOS C500 Mark II',
                ],
                'sort_order': 1,
            },
            {
                'group_name': 'Optics & Prime Glass',
                'items': [
                    'Atlas Orion Anamorphic Primes (32mm, 50mm, 80mm)',
                    'Leica Summilux-C High-Speed Cinema Lenses',
                    'Zeiss Supreme Primes T1.5 Full-Frame Set',
                    'Hasselblad XCD Primes (45P, 90V)',
                ],
                'sort_order': 2,
            },
            {
                'group_name': 'Aerial & Stabilization',
                'items': [
                    'DJI Inspire 3 with Zenmuse X9-8K Air Gimbal',
                    'DJI Mavic 3 Pro Cine (ProRes 422 HQ)',
                    'DJI Ronin 4D 8K 4-Axis Handheld Gimbal',
                    'Wireless Teradek Bolt 4K Zero-Delay Video Link',
                ],
                'sort_order': 3,
            },
            {
                'group_name': 'Post Production Suite',
                'items': [
                    'DaVinci Resolve Studio (Advanced Color Grading)',
                    'ACES Color Managed Production Pipeline',
                    'EIZO ColorEdge Pro Reference Displays',
                    'Final Cut Pro & Premiere Pro Master Suites',
                ],
                'sort_order': 4,
            },
        ]
        for eq in equipment_data:
            EquipmentCategory.objects.update_or_create(
                profile=about_profile,
                group_name=eq['group_name'],
                defaults=eq
            )

        notes_data = [
            {'label': 'FAA & EASA Status', 'value': 'Part 107 Commercial Remote Pilot · Open A1/A3 Licensed', 'sort_order': 1},
            {'label': 'Base of Operation', 'value': 'Available Worldwide for Commissions & Co-Productions', 'sort_order': 2},
            {'label': 'Studio Specialization', 'value': 'Editorial, Luxury Architecture, Narrative Documentaries', 'sort_order': 3},
            {'label': 'Language Fluency', 'value': 'English (Fluent), French (Conversational)', 'sort_order': 4},
        ]
        for note in notes_data:
            ProfessionalNote.objects.update_or_create(
                profile=about_profile,
                label=note['label'],
                defaults=note
            )

        self.stdout.write(self.style.SUCCESS("  [OK] About Profile & Sub-records seeded."))
        self.stdout.write(self.style.SUCCESS("All seed content successfully processed!"))
