from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.core.management import call_command
from apps.content.models import (
    Discipline,
    PortfolioCategory,
    PortfolioItem,
    Reel,
    JournalPost,
    SiteSettings,
    AboutProfile,
    validate_https_url,
)
from apps.content.serializers import ReelSerializer



class ContentModelConstraintTests(TestCase):
    def setUp(self):
        self.discipline = Discipline.objects.create(
            id='photography',
            name='Photography',
            tagline='Still captures',
            description='Test description',
            hero_image_url='https://example.com/hero.jpg'
        )
        self.category = PortfolioCategory.objects.create(
            discipline=self.discipline,
            name='Travel',
            slug='travel'
        )

    def test_portfolio_item_defaults_and_unique_slug(self):
        item1 = PortfolioItem.objects.create(
            slug='arctic-silence',
            title='Arctic Silence',
            discipline=self.discipline,
            category=self.category,
            image_url='https://example.com/arctic.jpg',
            alt='Arctic glacier',
            year='2025',
            location='Svalbard'
        )
        self.assertTrue(item1.is_published)
        self.assertEqual(item1.aspect_ratio, 'landscape')
        self.assertEqual(item1.media_type, 'image')
        self.assertEqual(item1.category_name, 'Travel')

        # Duplicate slug must fail
        with self.assertRaises(IntegrityError):
            PortfolioItem.objects.create(
                slug='arctic-silence',
                title='Another Item with same slug',
                discipline=self.discipline,
                category=self.category,
                image_url='https://example.com/arctic2.jpg',
                alt='Another glacier',
                year='2025',
                location='Svalbard'
            )

    def test_reel_youtube_id_validator_and_clean(self):
        # Valid 11-char ID
        reel = Reel(
            slug='cinematic-reel-1',
            title='Cinematic Reel',
            category='Travel',
            poster_url='https://example.com/poster.jpg',
            youtube_video_id='dQw4w9WgXcQ',
            duration='1:00',
            year='2025',
            location='Italy'
        )
        reel.full_clean()
        reel.save()
        self.assertEqual(reel.youtube_video_id, 'dQw4w9WgXcQ')

        # Clean extracts ID from URL formats
        url_formats = [
            'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
            'https://youtu.be/kJQP7kiw5Fk',
            'https://www.youtube.com/shorts/kJQP7kiw5Fk',
            'https://www.youtube-nocookie.com/embed/kJQP7kiw5Fk',
        ]
        for url in url_formats:
            r = Reel(
                slug='temp-reel',
                title='Temp Reel',
                category='Travel',
                youtube_video_id=url,
                duration='1:00',
                year='2025',
                location='Italy'
            )
            r.clean()
            self.assertEqual(r.youtube_video_id, 'kJQP7kiw5Fk')

        # Published reel without YouTube ID triggers ValidationError
        reel_missing_id = Reel(
            slug='cinematic-reel-missing',
            title='Missing ID Reel',
            category='Travel',
            is_published=True,
            youtube_video_id='',
            duration='1:00',
            year='2025',
            location='Italy'
        )
        with self.assertRaises(ValidationError):
            reel_missing_id.full_clean()

        # Unpublished draft reel allows empty YouTube ID
        reel_draft = Reel(
            slug='cinematic-reel-draft',
            title='Draft Reel',
            category='Travel',
            is_published=False,
            youtube_video_id='',
            duration='1:00',
            year='2025',
            location='Italy'
        )
        reel_draft.full_clean()
        reel_draft.save()
        self.assertEqual(reel_draft.youtube_video_id, '')

        # Invalid ID triggers ValidationError
        for invalid_id in ['too-short', 'waytoolong1234567890', 'invalid!char', 'javascript:alert(1)']:
            reel_invalid = Reel(
                slug='cinematic-reel-invalid',
                title='Invalid Reel',
                category='Travel',
                poster_url='https://example.com/poster.jpg',
                youtube_video_id=invalid_id,
                duration='1:00',
                year='2025',
                location='Italy'
            )
            with self.assertRaises(ValidationError):
                reel_invalid.full_clean()

    def test_https_url_validation(self):
        # Valid HTTPS URL
        validate_https_url('https://images.unsplash.com/photo-123')

        # Insecure or invalid schemes must raise ValidationError
        with self.assertRaises(ValidationError):
            validate_https_url('http://insecure.example.com/photo.jpg')

        with self.assertRaises(ValidationError):
            validate_https_url('javascript:alert(1)')

    def test_reel_serializer_embed_url_and_poster_fallback(self):
        # Reel with explicit poster
        reel_with_poster = Reel.objects.create(
            slug='reel-with-poster',
            title='Reel With Poster',
            category='Travel',
            poster_url='https://example.com/custom-poster.jpg',
            youtube_video_id='dQw4w9WgXcQ',
            duration='1:00',
            year='2025',
            location='Italy'
        )
        data = ReelSerializer(reel_with_poster).data
        self.assertEqual(data['poster'], 'https://example.com/custom-poster.jpg')
        self.assertEqual(data['embedUrl'], 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')

        # Reel with empty poster URL falls back to YouTube HQ thumbnail
        reel_empty_poster = Reel.objects.create(
            slug='reel-no-poster',
            title='Reel No Poster',
            category='Travel',
            poster_url='',
            youtube_video_id='kJQP7kiw5Fk',
            duration='1:00',
            year='2025',
            location='Italy'
        )
        data_empty = ReelSerializer(reel_empty_poster).data
        self.assertEqual(data_empty['poster'], 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg')
        self.assertEqual(data_empty['embedUrl'], 'https://www.youtube-nocookie.com/embed/kJQP7kiw5Fk')


    def test_journal_unique_slug(self):
        JournalPost.objects.create(
            slug='arctic-notes',
            title='Arctic Notes',
            category='Travel Experiences',
            published_date='February 14, 2025',
            read_time='5 min read',
            excerpt='Brief excerpt',
            cover_image_url='https://example.com/cover.jpg',
            cover_alt='Cover Alt',
            intro_paragraph='Intro paragraph...'
        )
        with self.assertRaises(IntegrityError):
            JournalPost.objects.create(
                slug='arctic-notes',
                title='Duplicate Slug Notes',
                category='Field Notes',
                published_date='February 15, 2025',
                read_time='3 min read',
                excerpt='Another excerpt',
                cover_image_url='https://example.com/cover2.jpg',
                cover_alt='Cover Alt 2',
                intro_paragraph='Intro 2...'
            )

    def test_singleton_site_settings(self):
        settings1 = SiteSettings.objects.create(name='Prism Pulse')
        self.assertIsNotNone(settings1.pk)

        # Attempting to create a second instance raises ValidationError
        settings2 = SiteSettings(name='Another Settings')
        with self.assertRaises(ValidationError):
            settings2.save()

    def test_singleton_about_profile(self):
        profile1 = AboutProfile.objects.create(name='Prism Pulse')
        self.assertIsNotNone(profile1.pk)

        # Attempting to create a second instance raises ValidationError
        profile2 = AboutProfile(name='Another Profile')
        with self.assertRaises(ValidationError):
            profile2.save()


class SeedContentCommandTests(TestCase):
    def test_seed_content_is_idempotent(self):
        # Run seed command first time
        call_command('seed_content')
        portfolio_count = PortfolioItem.objects.count()
        reel_count = Reel.objects.count()
        journal_count = JournalPost.objects.count()

        self.assertEqual(portfolio_count, 14)
        self.assertEqual(reel_count, 10)
        self.assertEqual(journal_count, 6)

        # Run seed command a second time
        call_command('seed_content')

        # Counts must remain identical without IntegrityErrors or duplication
        self.assertEqual(PortfolioItem.objects.count(), portfolio_count)
        self.assertEqual(Reel.objects.count(), reel_count)
        self.assertEqual(JournalPost.objects.count(), journal_count)


class AdminIntegrationTests(TestCase):
    def setUp(self):
        from django.contrib.auth.models import User
        self.admin_user = User.objects.create_superuser(
            username='admin_test',
            email='admin@example.com',
            password='testpassword123'
        )
        self.discipline = Discipline.objects.create(
            id='photography',
            name='Photography',
            tagline='Tagline',
            description='Desc',
            hero_image_url='https://example.com/h.jpg'
        )

    def test_admin_portfolio_item_changelist_and_add(self):
        self.client.login(username='admin_test', password='testpassword123')

        # Access admin index
        resp = self.client.get('/admin/')
        self.assertEqual(resp.status_code, 200)

        # Access portfolio items change list
        resp = self.client.get('/admin/content/portfolioitem/')
        self.assertEqual(resp.status_code, 200)

        # Create item via admin POST
        add_url = '/admin/content/portfolioitem/add/'
        post_data = {
            'slug': 'admin-test-item',
            'title': 'Admin Test Item',
            'discipline': self.discipline.pk,
            'category_name': 'Test Category',
            'media_type': 'image',
            'image_url': 'https://example.com/test.jpg',
            'alt': 'Test alt',
            'aspect_ratio': 'landscape',
            'year': '2025',
            'location': 'Test City',
            'featured_order': 0,
            'sort_order': 0,
            'is_published': 'on',
        }
        resp = self.client.post(add_url, data=post_data, follow=True)
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(PortfolioItem.objects.filter(slug='admin-test-item').exists())


class PublicAPITests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_content')

    def test_disciplines_endpoint(self):
        resp = self.client.get('/api/disciplines/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 3)
        item = data[0]
        expected_keys = {'id', 'name', 'tagline', 'description', 'heroImage', 'categories'}
        self.assertTrue(expected_keys.issubset(item.keys()))
        self.assertIsInstance(item['categories'], list)
        self.assertGreater(len(item['categories']), 0)

    def test_portfolio_list_and_filters(self):
        resp = self.client.get('/api/portfolio/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data), 14)
        item = data[0]
        expected_keys = {
            'id', 'title', 'discipline', 'category', 'mediaType',
            'src', 'alt', 'aspectRatio', 'year', 'location',
            'clientOrContext', 'description'
        }
        self.assertTrue(expected_keys.issubset(item.keys()))

        # Filter by discipline
        resp_photo = self.client.get('/api/portfolio/?discipline=photography')
        self.assertEqual(resp_photo.status_code, 200)
        data_photo = resp_photo.json()
        self.assertTrue(all(i['discipline'] == 'photography' for i in data_photo))

        # Filter by category
        resp_cat = self.client.get('/api/portfolio/?category=Portrait')
        self.assertEqual(resp_cat.status_code, 200)
        data_cat = resp_cat.json()
        self.assertTrue(all(i['category'] == 'Portrait' for i in data_cat))

        # Filter by featured
        resp_featured = self.client.get('/api/portfolio/?featured=true')
        self.assertEqual(resp_featured.status_code, 200)
        data_featured = resp_featured.json()
        self.assertEqual(len(data_featured), 5)

    def test_portfolio_detail_and_unpublished(self):
        resp = self.client.get('/api/portfolio/solitude-in-svalbard/')
        self.assertEqual(resp.status_code, 200)
        item = resp.json()
        self.assertEqual(item['id'], 'solitude-in-svalbard')

        # Nonexistent returns 404
        resp_404 = self.client.get('/api/portfolio/nonexistent-item-slug/')
        self.assertEqual(resp_404.status_code, 404)

        # Unpublished item returns 404
        p = PortfolioItem.objects.get(slug='solitude-in-svalbard')
        p.is_published = False
        p.save()
        resp_unpub = self.client.get('/api/portfolio/solitude-in-svalbard/')
        self.assertEqual(resp_unpub.status_code, 404)

        # Unpublished excluded from list
        resp_list = self.client.get('/api/portfolio/')
        slugs = [x['id'] for x in resp_list.json()]
        self.assertNotIn('solitude-in-svalbard', slugs)

    def test_reels_endpoint_and_detail(self):
        resp = self.client.get('/api/reels/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data), 10)
        item = data[0]
        expected_keys = {
            'id', 'title', 'category', 'poster', 'videoSrc',
            'youtubeVideoId', 'embedUrl', 'duration', 'aspectRatio',
            'year', 'location', 'gearOrFormat', 'description'
        }
        self.assertTrue(expected_keys.issubset(item.keys()))
        if item['youtubeVideoId']:
            self.assertIn('https://www.youtube-nocookie.com/embed/', item['embedUrl'])

        # Filter by category
        resp_travel = self.client.get('/api/reels/?category=Travel')
        self.assertEqual(resp_travel.status_code, 200)
        self.assertTrue(all(r['category'] == 'Travel' for r in resp_travel.json()))

        # Detail
        first_slug = item['id']
        resp_detail = self.client.get(f'/api/reels/{first_slug}/')
        self.assertEqual(resp_detail.status_code, 200)
        self.assertEqual(resp_detail.json()['id'], first_slug)

        # 404
        self.assertEqual(self.client.get('/api/reels/unknown-reel/').status_code, 404)

    def test_journal_list_and_detail(self):
        resp = self.client.get('/api/journal/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data), 6)
        item = data[0]
        list_keys = {'slug', 'title', 'category', 'date', 'readTime', 'excerpt', 'coverImage', 'coverAlt', 'location'}
        self.assertTrue(list_keys.issubset(item.keys()))
        # List should NOT contain full content body
        self.assertNotIn('content', item)

        # Detail
        slug = item['slug']
        resp_detail = self.client.get(f'/api/journal/{slug}/')
        self.assertEqual(resp_detail.status_code, 200)
        detail_data = resp_detail.json()
        self.assertIn('content', detail_data)
        self.assertIn('introParagraph', detail_data['content'])
        self.assertIn('bodyParagraphs', detail_data['content'])
        self.assertIsInstance(detail_data['content']['bodyParagraphs'], list)

        # 404
        self.assertEqual(self.client.get('/api/journal/unknown-post/').status_code, 404)

    def test_services_endpoint(self):
        resp = self.client.get('/api/services/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn('meta', data)
        self.assertIn('headline', data)
        self.assertIn('intro', data)
        self.assertIn('engagementModel', data)
        self.assertIn('groups', data)
        self.assertGreaterEqual(len(data['groups']), 3)
        grp = data['groups'][0]
        self.assertIn('services', grp)
        self.assertGreater(len(grp['services']), 0)
        svc = grp['services'][0]
        self.assertIn('id', svc)
        self.assertIn('name', svc)
        self.assertIn('description', svc)

    def test_about_endpoint(self):
        resp = self.client.get('/api/about/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        expected_keys = {
            'name', 'role', 'portrait', 'intro', 'philosophy',
            'skills', 'equipment', 'professionalNotes'
        }
        self.assertTrue(expected_keys.issubset(data.keys()))
        self.assertEqual(data['name'], 'Prism Pulse')
        self.assertIn('src', data['portrait'])
        self.assertIn('paragraphs', data['intro'])
        self.assertIn('tenets', data['philosophy'])
        self.assertIn('list', data['skills'])
        self.assertIn('categories', data['equipment'])

    def test_site_endpoint(self):
        resp = self.client.get('/api/site/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        expected_keys = {
            'name', 'tagline', 'disciplines', 'location',
            'copyrightYear', 'navItems', 'socialLinks',
            'contactEmail', 'contactPhone', 'email', 'phone',
            'representation', 'operatingHours', 'responseNote', 'sideImage'
        }
        self.assertTrue(expected_keys.issubset(data.keys()))
        self.assertEqual(len(data['navItems']), 7)
        self.assertGreaterEqual(len(data['socialLinks']), 3)

    def test_home_endpoint(self):
        resp = self.client.get('/api/home/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        expected_keys = {
            'displayName', 'roleTag', 'coordinates', 'reelTag',
            'heroHeadline', 'heroIntro', 'heroMedia', 'ctaLabel',
            'selectedWorks'
        }
        self.assertTrue(expected_keys.issubset(data.keys()))
        self.assertEqual(len(data['selectedWorks']), 5)
        sw = data['selectedWorks'][0]
        self.assertIn('linkTarget', sw)
        self.assertTrue(sw['linkTarget'].startswith('/work/'))
        self.assertIn('?item=', sw['linkTarget'])
        for item in data['selectedWorks']:
            self.assertIn(item['discipline'], {'Photography', 'Cinematography', 'Drone'})

    def test_all_public_api_image_urls_are_https(self):
        # Portfolio items
        portfolio_items = self.client.get('/api/portfolio/').json()
        for item in portfolio_items:
            self.assertTrue(item['src'].startswith('https://'), f"Insecure src: {item['src']}")

        # Disciplines hero images
        disciplines = self.client.get('/api/disciplines/').json()
        for d in disciplines:
            self.assertTrue(d['heroImage'].startswith('https://'), f"Insecure heroImage: {d['heroImage']}")

        # Reels posters and embed URLs
        reels = self.client.get('/api/reels/').json()
        for r in reels:
            self.assertTrue(r['poster'].startswith('https://'), f"Insecure poster: {r['poster']}")
            self.assertTrue(r['embedUrl'].startswith('https://www.youtube-nocookie.com/embed/'), f"Insecure embedUrl: {r['embedUrl']}")

        # Journal covers
        journal_posts = self.client.get('/api/journal/').json()
        for j in journal_posts:
            self.assertTrue(j['coverImage'].startswith('https://'), f"Insecure coverImage: {j['coverImage']}")

        # Services hero images
        services = self.client.get('/api/services/').json()
        for grp in services['groups']:
            self.assertTrue(grp['heroImage'].startswith('https://'), f"Insecure service hero: {grp['heroImage']}")

        # About portrait
        about = self.client.get('/api/about/').json()
        self.assertTrue(about['portrait']['src'].startswith('https://'))

        # Site side image
        site = self.client.get('/api/site/').json()
        self.assertTrue(site['sideImage']['src'].startswith('https://'))


