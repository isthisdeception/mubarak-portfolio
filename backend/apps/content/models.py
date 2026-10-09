import re
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator


# ------------------------------------------------------------------------------
# Validators
# ------------------------------------------------------------------------------
youtube_id_validator = RegexValidator(
    regex=r'^[A-Za-z0-9_-]{11}$',
    message='Enter a valid 11-character YouTube video ID.'
)


def validate_https_url(value: str):
    """Ensure media/image URLs strictly use secure HTTPS protocol."""
    if value and not value.startswith('https://'):
        raise ValidationError('URL must use the secure HTTPS protocol (e.g. https://...).')


def extract_youtube_id(value: str) -> str:
    """Extract YouTube 11-char ID from raw ID or common YouTube URL formats."""
    if not value:
        return ''
    value = value.strip()
    if re.match(r'^[A-Za-z0-9_-]{11}$', value):
        return value
    # Patterns like https://www.youtube.com/watch?v=XXXXXXXXXXX, youtu.be/XXXXXXXXXXX, /embed/XXXXXXXXXXX, or /shorts/XXXXXXXXXXX
    match = re.search(r'(?:v=|\/embed\/|youtu\.be\/|\/v\/|\/shorts\/)([A-Za-z0-9_-]{11})', value)
    if match:
        return match.group(1)
    return value



# ------------------------------------------------------------------------------
# Disciplines & Categories
# ------------------------------------------------------------------------------
class Discipline(models.Model):
    id = models.CharField(
        max_length=50,
        primary_key=True,
        help_text="Discipline identifier (e.g. photography, cinematography, drone)"
    )
    name = models.CharField(max_length=100)
    tagline = models.CharField(max_length=255)
    description = models.TextField()
    hero_image_url = models.URLField(max_length=500, validators=[validate_https_url])
    hero_image_alt = models.CharField(max_length=255, blank=True, default='')
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = 'Discipline'
        verbose_name_plural = 'Disciplines'

    def __str__(self):
        return self.name


class PortfolioCategory(models.Model):
    discipline = models.ForeignKey(
        Discipline,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'name']
        unique_together = [('discipline', 'name'), ('discipline', 'slug')]
        verbose_name = 'Portfolio Category'
        verbose_name_plural = 'Portfolio Categories'

    def __str__(self):
        return f"{self.discipline.name} - {self.name}"


# ------------------------------------------------------------------------------
# Portfolio Items
# ------------------------------------------------------------------------------
class PortfolioItem(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]

    ASPECT_RATIO_CHOICES = [
        ('landscape', 'Landscape'),
        ('portrait', 'Portrait'),
        ('wide', 'Wide'),
        ('square', 'Square'),
    ]

    slug = models.SlugField(max_length=120, unique=True, db_index=True, help_text="Public ID matching frontend deep link")
    title = models.CharField(max_length=255)
    discipline = models.ForeignKey(
        Discipline,
        on_delete=models.PROTECT,
        related_name='portfolio_items'
    )
    category = models.ForeignKey(
        PortfolioCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='portfolio_items'
    )
    category_name = models.CharField(
        max_length=100,
        blank=True,
        default='',
        help_text="Cached category label matching frontend item.category"
    )
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default='image')
    image_url = models.URLField(max_length=500, validators=[validate_https_url], help_text="Maps to frontend 'src'")
    cloudinary_public_id = models.CharField(max_length=255, blank=True, default='')
    alt = models.CharField(max_length=255)
    aspect_ratio = models.CharField(max_length=20, choices=ASPECT_RATIO_CHOICES, default='landscape')
    year = models.CharField(max_length=20)
    location = models.CharField(max_length=255)
    client_or_context = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')
    is_featured = models.BooleanField(default=False, help_text="Feature this work on the home page")
    featured_order = models.PositiveIntegerField(default=0)
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', '-created_at']
        indexes = [
            models.Index(fields=['discipline', 'is_published']),
            models.Index(fields=['slug']),
            models.Index(fields=['is_featured', 'featured_order']),
        ]
        verbose_name = 'Portfolio Item'
        verbose_name_plural = 'Portfolio Items'

    def save(self, *args, **kwargs):
        if self.category and not self.category_name:
            self.category_name = self.category.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.discipline.name})"


# ------------------------------------------------------------------------------
# Reels
# ------------------------------------------------------------------------------
class Reel(models.Model):
    REEL_CATEGORY_CHOICES = [
        ('Travel', 'Travel'),
        ('Behind the Scenes', 'Behind the Scenes'),
        ('Events', 'Events'),
        ('Cinematic Shorts', 'Cinematic Shorts'),
        ('Creative Projects', 'Creative Projects'),
    ]

    ASPECT_RATIO_CHOICES = [
        ('vertical', 'Vertical'),
        ('cinematic', 'Cinematic'),
    ]

    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=REEL_CATEGORY_CHOICES)
    poster_url = models.URLField(
        max_length=500,
        blank=True,
        default='',
        validators=[validate_https_url],
        help_text="Custom poster image URL (HTTPS). If left blank, defaults to YouTube HQ thumbnail."
    )
    youtube_video_id = models.CharField(
        max_length=20,
        blank=True,
        default='',
        validators=[youtube_id_validator],
        help_text="11-character YouTube video ID (e.g. dQw4w9WgXcQ)"
    )
    video_src = models.URLField(
        max_length=500,
        blank=True,
        default='',
        help_text="Direct MP4 video URL for legacy/HTML5 fallback"
    )
    duration = models.CharField(max_length=20, help_text="e.g. 0:45")
    aspect_ratio = models.CharField(max_length=20, choices=ASPECT_RATIO_CHOICES, default='vertical')
    year = models.CharField(max_length=20)
    location = models.CharField(max_length=255)
    gear_or_format = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', '-created_at']
        indexes = [
            models.Index(fields=['category', 'is_published']),
            models.Index(fields=['slug']),
        ]
        verbose_name = 'Reel'
        verbose_name_plural = 'Reels'

    def clean(self):
        super().clean()
        if self.is_published and not self.youtube_video_id:
            raise ValidationError({'youtube_video_id': 'A YouTube video ID is required for published reels.'})
        if self.youtube_video_id:
            cleaned_id = extract_youtube_id(self.youtube_video_id)
            if not re.match(r'^[A-Za-z0-9_-]{11}$', cleaned_id):
                raise ValidationError({'youtube_video_id': 'Enter a valid 11-character YouTube video ID.'})
            self.youtube_video_id = cleaned_id

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.category})"


# ------------------------------------------------------------------------------
# Journal
# ------------------------------------------------------------------------------
class JournalPost(models.Model):
    JOURNAL_CATEGORY_CHOICES = [
        ('Travel Experiences', 'Travel Experiences'),
        ('Gear & Optics', 'Gear & Optics'),
        ('Photography Stories', 'Photography Stories'),
        ('Filmmaking Stories', 'Filmmaking Stories'),
        ('Behind the Scenes', 'Behind the Scenes'),
        ('Field Notes', 'Field Notes'),
    ]

    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=JOURNAL_CATEGORY_CHOICES)
    published_date = models.CharField(max_length=50, help_text="Formatted date string matching UI, e.g. February 14, 2025")
    read_time = models.CharField(max_length=50, help_text="e.g. 5 min read")
    excerpt = models.TextField()
    cover_image_url = models.URLField(max_length=500, validators=[validate_https_url])
    cover_alt = models.CharField(max_length=255)
    cloudinary_public_id = models.CharField(max_length=255, blank=True, default='')
    location = models.CharField(max_length=255, blank=True, default='')

    # Article content fields
    intro_paragraph = models.TextField()
    quote = models.TextField(blank=True, default='')
    quote_author = models.CharField(max_length=255, blank=True, default='')
    body_paragraphs = models.JSONField(default=list, help_text="List of article body paragraphs as strings")
    technical_note = models.TextField(blank=True, default='')
    takeaway = models.TextField(blank=True, default='')

    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', '-created_at']
        indexes = [
            models.Index(fields=['category', 'is_published']),
            models.Index(fields=['slug']),
        ]
        verbose_name = 'Journal Post'
        verbose_name_plural = 'Journal Posts'

    def __str__(self):
        return self.title


# ------------------------------------------------------------------------------
# Services
# ------------------------------------------------------------------------------
class ServiceGroup(models.Model):
    id = models.CharField(
        max_length=50,
        primary_key=True,
        help_text="Discipline slug (e.g. photography, cinematography, drone)"
    )
    number = models.CharField(max_length=10, help_text="Display number, e.g. 01")
    discipline = models.CharField(max_length=100, help_text="Discipline title, e.g. Photography")
    tagline = models.CharField(max_length=255)
    description = models.TextField()
    hero_image_url = models.URLField(max_length=500, validators=[validate_https_url])
    image_alt = models.CharField(max_length=255)
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['sort_order', 'number']
        verbose_name = 'Service Group'
        verbose_name_plural = 'Service Groups'

    def __str__(self):
        return f"{self.number} · {self.discipline}"


class ServiceOffering(models.Model):
    group = models.ForeignKey(
        ServiceGroup,
        on_delete=models.CASCADE,
        related_name='services'
    )
    slug = models.SlugField(max_length=100, help_text="Offering id, e.g. photo-event")
    name = models.CharField(max_length=255)
    description = models.TextField()
    deliverables = models.CharField(max_length=255, blank=True, default='')
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['sort_order', 'name']
        unique_together = [('group', 'slug')]
        verbose_name = 'Service Offering'
        verbose_name_plural = 'Service Offerings'

    def __str__(self):
        return f"{self.group.discipline} - {self.name}"


# ------------------------------------------------------------------------------
# Site Chrome & Studio Settings (Singleton)
# ------------------------------------------------------------------------------
class SiteSettings(models.Model):
    name = models.CharField(max_length=100, default='Prism Pulse')
    tagline = models.CharField(max_length=255, default='Photographer · Cinematographer · Drone Operator')
    disciplines = models.JSONField(default=list)
    location = models.CharField(max_length=255, default='Available Worldwide')

    # Studio & Contact Details
    contact_email = models.EmailField(default='commissions@prismpulse-visuals.com')
    contact_phone = models.CharField(max_length=50, default='+1 (415) 890-4421')
    representation = models.CharField(max_length=255, default='Direct Artist Representation · Available Worldwide')
    operating_hours = models.CharField(max_length=255, default='Studio Office: Monday – Friday · 09:00 – 18:00 CET')
    response_note = models.TextField(
        default='All inquiries are personally reviewed within 24 to 48 hours. Confidential project NDAs supported upon request.'
    )
    contact_side_image_url = models.URLField(
        max_length=500,
        blank=True,
        default='https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=85',
        validators=[validate_https_url]
    )
    contact_side_image_alt = models.CharField(
        max_length=255,
        blank=True,
        default='Sunlight filtering through forest canopy into deep atmospheric shadows'
    )
    contact_side_image_caption = models.CharField(
        max_length=255,
        blank=True,
        default='Field Production Notes · Light & Environmental Scouting · 2025'
    )

    # Home Page Fields
    home_display_name = models.CharField(max_length=100, default='Prism Pulse')
    home_role_tag = models.CharField(max_length=100, default='PHOTOGRAPHER / DRONE PILOT')
    home_coordinates = models.CharField(max_length=100, default='23.8103° N, 90.4125° E — DHAKA')
    home_reel_tag = models.CharField(max_length=100, default='REEL 35MM / 4K')
    home_hero_headline = models.CharField(max_length=255, default='Visual Stories Across Light & Motion')
    home_hero_intro = models.TextField(
        default='Dedicated to capturing evocative moments through high-altitude aerial perspectives, intentional 35mm composition, and atmospheric cinematography.'
    )
    home_hero_image_url = models.URLField(max_length=500, blank=True, default='')
    home_hero_image_alt = models.CharField(max_length=255, default='Prism Pulse operating drone outdoors in natural landscape')
    home_hero_caption = models.CharField(max_length=255, default='Field Journal 08 · Aerial Scout · 2025')

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def clean(self):
        if not self.pk and SiteSettings.objects.exists():
            raise ValidationError('Only one instance of SiteSettings can be created.')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @classmethod
    def get_instance(cls):
        instance, _ = cls.objects.get_or_create(id=1)
        return instance

    def __str__(self):
        return f"{self.name} Settings"


class SocialLink(models.Model):
    settings = models.ForeignKey(
        SiteSettings,
        on_delete=models.CASCADE,
        related_name='social_links',
        null=True,
        blank=True
    )
    platform = models.CharField(max_length=50)
    url = models.URLField(max_length=500)
    handle = models.CharField(max_length=100, blank=True, default='')
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'platform']
        verbose_name = 'Social Link'
        verbose_name_plural = 'Social Links'

    def __str__(self):
        return f"{self.platform} ({self.handle})"


# ------------------------------------------------------------------------------
# About Page (Singleton)
# ------------------------------------------------------------------------------
class AboutProfile(models.Model):
    name = models.CharField(max_length=100, default='Prism Pulse')
    role = models.CharField(max_length=255, default='Photographer · Cinematographer · Drone Operator')
    portrait_src = models.URLField(
        max_length=500,
        default='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1600&q=85',
        validators=[validate_https_url]
    )
    portrait_alt = models.CharField(
        max_length=255,
        default='Studio portrait of Prism Pulse visual director in warm chiaroscuro ambient light'
    )
    portrait_caption = models.CharField(
        max_length=255,
        default='Studio Archive · Portrait by Natural Window Light · 2025'
    )
    intro_headline = models.CharField(
        max_length=255,
        default='Finding permanence in fleeting light, deliberate motion, and vast horizons.'
    )
    intro_paragraphs = models.JSONField(
        default=list,
        help_text="List of intro paragraphs as strings"
    )
    philosophy_title = models.CharField(max_length=100, default='Creative Philosophy')
    philosophy_statement = models.TextField(
        default='We do not manufacture cinema; we cultivate patience until reality reveals its own poetry.'
    )
    skills_title = models.CharField(max_length=100, default='Core Disciplines & Technical Craft')
    equipment_title = models.CharField(max_length=100, default='Selected Production Equipment')
    equipment_description = models.TextField(
        default='A dedicated inventory of cinema optics, medium format sensor platforms, and commercial drone systems.'
    )

    class Meta:
        verbose_name = 'About Profile'
        verbose_name_plural = 'About Profiles'

    def clean(self):
        if not self.pk and AboutProfile.objects.exists():
            raise ValidationError('Only one instance of AboutProfile can be created.')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @classmethod
    def get_instance(cls):
        instance, _ = cls.objects.get_or_create(id=1)
        return instance

    def __str__(self):
        return f"{self.name} Profile"


class PhilosophyTenet(models.Model):
    profile = models.ForeignKey(
        AboutProfile,
        on_delete=models.CASCADE,
        related_name='tenets'
    )
    number = models.CharField(max_length=10)
    title = models.CharField(max_length=255)
    description = models.TextField()
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'number']
        verbose_name = 'Philosophy Tenet'
        verbose_name_plural = 'Philosophy Tenets'

    def __str__(self):
        return f"{self.number} · {self.title}"


class Skill(models.Model):
    profile = models.ForeignKey(
        AboutProfile,
        on_delete=models.CASCADE,
        related_name='skills'
    )
    label = models.CharField(max_length=255)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'label']
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'

    def __str__(self):
        return self.label


class EquipmentCategory(models.Model):
    profile = models.ForeignKey(
        AboutProfile,
        on_delete=models.CASCADE,
        related_name='equipment_categories'
    )
    group_name = models.CharField(max_length=100)
    items = models.JSONField(default=list, help_text="List of equipment gear items as strings")
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'group_name']
        verbose_name = 'Equipment Category'
        verbose_name_plural = 'Equipment Categories'

    def __str__(self):
        return self.group_name


class ProfessionalNote(models.Model):
    profile = models.ForeignKey(
        AboutProfile,
        on_delete=models.CASCADE,
        related_name='professional_notes'
    )
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'label']
        verbose_name = 'Professional Note'
        verbose_name_plural = 'Professional Notes'

    def __str__(self):
        return f"{self.label}: {self.value}"
