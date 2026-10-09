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
)


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

        # Clean extracts ID from URL
        reel_url = Reel(
            slug='cinematic-reel-2',
            title='Cinematic Reel 2',
            category='Travel',
            poster_url='https://example.com/poster.jpg',
            youtube_video_id='https://www.youtube.com/watch?v=kJQP7kiw5Fk',
            duration='1:00',
            year='2025',
            location='Italy'
        )
        reel_url.clean()
        self.assertEqual(reel_url.youtube_video_id, 'kJQP7kiw5Fk')

        # Invalid ID triggers ValidationError
        reel_invalid = Reel(
            slug='cinematic-reel-3',
            title='Invalid Reel',
            category='Travel',
            poster_url='https://example.com/poster.jpg',
            youtube_video_id='too-short',
            duration='1:00',
            year='2025',
            location='Italy'
        )
        with self.assertRaises(ValidationError):
            reel_invalid.full_clean()

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
