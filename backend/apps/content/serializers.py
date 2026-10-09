import re
from datetime import datetime
from rest_framework import serializers
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
    extract_youtube_id,
)



# ------------------------------------------------------------------------------
# Disciplines
# ------------------------------------------------------------------------------
class DisciplineSerializer(serializers.ModelSerializer):
    heroImage = serializers.CharField(source='hero_image_url')
    categories = serializers.SerializerMethodField()

    class Meta:
        model = Discipline
        fields = [
            'id',
            'name',
            'tagline',
            'description',
            'heroImage',
            'categories',
        ]

    def get_categories(self, obj):
        return list(obj.categories.order_by('sort_order', 'name').values_list('name', flat=True))


# ------------------------------------------------------------------------------
# Portfolio Items
# ------------------------------------------------------------------------------
class PortfolioItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug')
    discipline = serializers.CharField(source='discipline_id')
    category = serializers.SerializerMethodField()
    mediaType = serializers.CharField(source='media_type')
    src = serializers.CharField(source='image_url')
    aspectRatio = serializers.CharField(source='aspect_ratio')
    clientOrContext = serializers.CharField(source='client_or_context', allow_blank=True, required=False)
    description = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = PortfolioItem
        fields = [
            'id',
            'title',
            'discipline',
            'category',
            'mediaType',
            'src',
            'alt',
            'aspectRatio',
            'year',
            'location',
            'clientOrContext',
            'description',
        ]

    def get_category(self, obj):
        if obj.category:
            return obj.category.name
        return obj.category_name or ''


# ------------------------------------------------------------------------------
# Reels
# ------------------------------------------------------------------------------
class ReelSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug')
    poster = serializers.SerializerMethodField()
    videoSrc = serializers.CharField(source='video_src', allow_blank=True, required=False)
    youtubeVideoId = serializers.CharField(source='youtube_video_id', allow_blank=True, required=False)
    embedUrl = serializers.SerializerMethodField()
    aspectRatio = serializers.CharField(source='aspect_ratio')
    gearOrFormat = serializers.CharField(source='gear_or_format', allow_blank=True, required=False)
    description = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = Reel
        fields = [
            'id',
            'title',
            'category',
            'poster',
            'videoSrc',
            'youtubeVideoId',
            'embedUrl',
            'duration',
            'aspectRatio',
            'year',
            'location',
            'gearOrFormat',
            'description',
        ]

    def get_poster(self, obj):
        if obj.poster_url:
            return obj.poster_url
        if obj.youtube_video_id:
            cleaned_id = extract_youtube_id(obj.youtube_video_id)
            if re.match(r'^[A-Za-z0-9_-]{11}$', cleaned_id):
                return f"https://img.youtube.com/vi/{cleaned_id}/hqdefault.jpg"
        return ''

    def get_embedUrl(self, obj):
        if obj.youtube_video_id:
            cleaned_id = extract_youtube_id(obj.youtube_video_id)
            if re.match(r'^[A-Za-z0-9_-]{11}$', cleaned_id):
                return f"https://www.youtube-nocookie.com/embed/{cleaned_id}"
        return ''



# ------------------------------------------------------------------------------
# Journal
# ------------------------------------------------------------------------------
class JournalPostListSerializer(serializers.ModelSerializer):
    date = serializers.CharField(source='published_date')
    readTime = serializers.CharField(source='read_time')
    coverImage = serializers.CharField(source='cover_image_url')
    coverAlt = serializers.CharField(source='cover_alt')

    class Meta:
        model = JournalPost
        fields = [
            'slug',
            'title',
            'category',
            'date',
            'readTime',
            'excerpt',
            'coverImage',
            'coverAlt',
            'location',
        ]


class JournalPostDetailSerializer(serializers.ModelSerializer):
    date = serializers.CharField(source='published_date')
    readTime = serializers.CharField(source='read_time')
    coverImage = serializers.CharField(source='cover_image_url')
    coverAlt = serializers.CharField(source='cover_alt')
    content = serializers.SerializerMethodField()

    class Meta:
        model = JournalPost
        fields = [
            'slug',
            'title',
            'category',
            'date',
            'readTime',
            'excerpt',
            'coverImage',
            'coverAlt',
            'location',
            'content',
        ]

    def get_content(self, obj):
        content_dict = {
            'introParagraph': obj.intro_paragraph,
            'bodyParagraphs': obj.body_paragraphs or [],
        }
        if obj.quote:
            content_dict['quote'] = obj.quote
        if obj.quote_author:
            content_dict['quoteAuthor'] = obj.quote_author
        if obj.technical_note:
            content_dict['technicalNote'] = obj.technical_note
        if obj.takeaway:
            content_dict['takeaway'] = obj.takeaway
        return content_dict


# ------------------------------------------------------------------------------
# Services
# ------------------------------------------------------------------------------
class ServiceOfferingSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug')

    class Meta:
        model = ServiceOffering
        fields = ['id', 'name', 'description', 'deliverables']


class ServiceGroupSerializer(serializers.ModelSerializer):
    heroImage = serializers.CharField(source='hero_image_url')
    imageAlt = serializers.CharField(source='image_alt')
    services = serializers.SerializerMethodField()

    class Meta:
        model = ServiceGroup
        fields = [
            'id',
            'number',
            'discipline',
            'tagline',
            'description',
            'heroImage',
            'imageAlt',
            'services',
        ]

    def get_services(self, obj):
        services = obj.services.filter(is_published=True).order_by('sort_order', 'name')
        return ServiceOfferingSerializer(services, many=True).data


# ------------------------------------------------------------------------------
# Site Settings & Social Links
# ------------------------------------------------------------------------------
class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['platform', 'url', 'handle']


class SiteSettingsSerializer(serializers.ModelSerializer):
    copyrightYear = serializers.SerializerMethodField()
    navItems = serializers.SerializerMethodField()
    socialLinks = serializers.SerializerMethodField()
    contactEmail = serializers.CharField(source='contact_email')
    contactPhone = serializers.CharField(source='contact_phone')
    email = serializers.CharField(source='contact_email')
    phone = serializers.CharField(source='contact_phone')
    operatingHours = serializers.CharField(source='operating_hours')
    responseNote = serializers.CharField(source='response_note')
    sideImage = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            'name',
            'tagline',
            'disciplines',
            'location',
            'copyrightYear',
            'navItems',
            'socialLinks',
            'contactEmail',
            'contactPhone',
            'email',
            'phone',
            'representation',
            'operatingHours',
            'responseNote',
            'sideImage',
        ]

    def get_copyrightYear(self, obj):
        return datetime.now().year

    def get_navItems(self, obj):
        return [
            {'label': 'Home', 'path': '/'},
            {'label': 'Work', 'path': '/work'},
            {'label': 'Reels', 'path': '/reels'},
            {'label': 'About', 'path': '/about'},
            {'label': 'Services', 'path': '/services'},
            {'label': 'Journal', 'path': '/journal'},
            {'label': 'Contact', 'path': '/contact'},
        ]

    def get_socialLinks(self, obj):
        links = obj.social_links.order_by('sort_order', 'platform')
        return SocialLinkSerializer(links, many=True).data

    def get_sideImage(self, obj):
        return {
            'src': obj.contact_side_image_url,
            'alt': obj.contact_side_image_alt,
            'caption': obj.contact_side_image_caption,
        }


# ------------------------------------------------------------------------------
# About Page
# ------------------------------------------------------------------------------
class PhilosophyTenetSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhilosophyTenet
        fields = ['number', 'title', 'description']


class EquipmentCategorySerializer(serializers.ModelSerializer):
    group = serializers.CharField(source='group_name')

    class Meta:
        model = EquipmentCategory
        fields = ['group', 'items']


class ProfessionalNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalNote
        fields = ['label', 'value']


class AboutDataSerializer(serializers.ModelSerializer):
    portrait = serializers.SerializerMethodField()
    intro = serializers.SerializerMethodField()
    philosophy = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()
    equipment = serializers.SerializerMethodField()
    professionalNotes = serializers.SerializerMethodField()

    class Meta:
        model = AboutProfile
        fields = [
            'name',
            'role',
            'portrait',
            'intro',
            'philosophy',
            'skills',
            'equipment',
            'professionalNotes',
        ]

    def get_portrait(self, obj):
        return {
            'src': obj.portrait_src,
            'alt': obj.portrait_alt,
            'caption': obj.portrait_caption,
        }

    def get_intro(self, obj):
        return {
            'headline': obj.intro_headline,
            'paragraphs': obj.intro_paragraphs or [],
        }

    def get_philosophy(self, obj):
        tenets = obj.tenets.order_by('sort_order', 'number')
        return {
            'title': obj.philosophy_title,
            'statement': obj.philosophy_statement,
            'tenets': PhilosophyTenetSerializer(tenets, many=True).data,
        }

    def get_skills(self, obj):
        skills = list(obj.skills.order_by('sort_order', 'label').values_list('label', flat=True))
        return {
            'title': obj.skills_title,
            'list': skills,
        }

    def get_equipment(self, obj):
        categories = obj.equipment_categories.order_by('sort_order', 'group_name')
        return {
            'title': obj.equipment_title,
            'description': obj.equipment_description,
            'categories': EquipmentCategorySerializer(categories, many=True).data,
        }

    def get_professionalNotes(self, obj):
        notes = obj.professional_notes.order_by('sort_order', 'label')
        return ProfessionalNoteSerializer(notes, many=True).data


# ------------------------------------------------------------------------------
# Home Page
# ------------------------------------------------------------------------------
class SelectedWorkItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug')
    discipline = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    imageUrl = serializers.CharField(source='image_url')
    aspectRatio = serializers.CharField(source='aspect_ratio')
    linkTarget = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioItem
        fields = [
            'id',
            'title',
            'discipline',
            'category',
            'year',
            'location',
            'imageUrl',
            'aspectRatio',
            'linkTarget',
        ]

    def get_discipline(self, obj):
        if obj.discipline_id == 'drone':
            return 'Drone'
        return obj.discipline.name

    def get_category(self, obj):
        if obj.category:
            return obj.category.name
        return obj.category_name or ''

    def get_linkTarget(self, obj):
        return f"/work/{obj.discipline_id}?item={obj.slug}"
