from django.db.models import Q
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apps.content.models import (
    Discipline,
    PortfolioItem,
    Reel,
    JournalPost,
    ServiceGroup,
    SiteSettings,
    AboutProfile,
)
from apps.content.serializers import (
    DisciplineSerializer,
    PortfolioItemSerializer,
    ReelSerializer,
    JournalPostListSerializer,
    JournalPostDetailSerializer,
    ServiceGroupSerializer,
    SiteSettingsSerializer,
    AboutDataSerializer,
    SelectedWorkItemSerializer,
)


class DisciplineListView(generics.ListAPIView):
    """
    GET /api/disciplines/
    Returns published disciplines with nested ordered categories.
    """
    permission_classes = [AllowAny]
    serializer_class = DisciplineSerializer

    def get_queryset(self):
        return Discipline.objects.filter(is_published=True).prefetch_related('categories').order_by('sort_order', 'name')


class PortfolioListView(generics.ListAPIView):
    """
    GET /api/portfolio/
    Returns published portfolio items with optional filters: discipline, category, featured.
    """
    permission_classes = [AllowAny]
    serializer_class = PortfolioItemSerializer

    def get_queryset(self):
        queryset = PortfolioItem.objects.filter(is_published=True).select_related('discipline', 'category')

        discipline = self.request.query_params.get('discipline')
        if discipline:
            queryset = queryset.filter(discipline__id__iexact=discipline.strip())

        category = self.request.query_params.get('category')
        if category:
            cat = category.strip()
            queryset = queryset.filter(
                Q(category__name__iexact=cat) |
                Q(category__slug__iexact=cat) |
                Q(category_name__iexact=cat)
            )

        featured = self.request.query_params.get('featured')
        if featured and featured.strip().lower() in ['true', '1']:
            queryset = queryset.filter(is_featured=True).order_by('featured_order', 'sort_order')
        else:
            queryset = queryset.order_by('sort_order', '-created_at')

        return queryset


class PortfolioDetailView(generics.RetrieveAPIView):
    """
    GET /api/portfolio/{slug}/
    Returns a single published portfolio item or 404.
    """
    permission_classes = [AllowAny]
    serializer_class = PortfolioItemSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return PortfolioItem.objects.filter(is_published=True).select_related('discipline', 'category')


class ReelListView(generics.ListAPIView):
    """
    GET /api/reels/
    Returns published reels with optional category filter.
    """
    permission_classes = [AllowAny]
    serializer_class = ReelSerializer

    def get_queryset(self):
        queryset = Reel.objects.filter(is_published=True)

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category.strip())

        return queryset.order_by('sort_order', '-created_at')


class ReelDetailView(generics.RetrieveAPIView):
    """
    GET /api/reels/{slug}/
    Returns a single published reel or 404.
    """
    permission_classes = [AllowAny]
    serializer_class = ReelSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Reel.objects.filter(is_published=True)


class JournalListView(generics.ListAPIView):
    """
    GET /api/journal/
    Returns published journal post cards (excluding heavy content body) with optional category filter.
    """
    permission_classes = [AllowAny]
    serializer_class = JournalPostListSerializer

    def get_queryset(self):
        queryset = JournalPost.objects.filter(is_published=True)

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category.strip())

        return queryset.order_by('sort_order', '-created_at')


class JournalDetailView(generics.RetrieveAPIView):
    """
    GET /api/journal/{slug}/
    Returns full published journal article including content body or 404.
    """
    permission_classes = [AllowAny]
    serializer_class = JournalPostDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return JournalPost.objects.filter(is_published=True)


class ServicesView(APIView):
    """
    GET /api/services/
    Returns services page payload with discipline groups and service offerings.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        groups = ServiceGroup.objects.filter(is_published=True).prefetch_related('services').order_by('sort_order', 'number')
        payload = {
            'meta': '04 · Offerings & Commissions',
            'headline': 'Commissions & Production Craft',
            'intro': (
                'Tailored visual productions spanning editorial still photography, '
                'narrative cinematography, and licensed high-altitude drone operations. '
                'Each engagement is treated as a bespoke partnership.'
            ),
            'engagementModel': {
                'title': 'Bespoke Engagement & Delivery',
                'description': (
                    'We do not offer generic tiered packages. Every commission is quoted '
                    'individually based on geographic location, production complexity, '
                    'licensing parameters, and delivery timeline.'
                ),
                'notes': [
                    'Worldwide travel & co-production availability',
                    'Dual-operator cinema drone crew configuration',
                    'Full ACES color managed post-production pipeline',
                    'Direct director-to-client creative dialogue',
                ],
            },
            'groups': ServiceGroupSerializer(groups, many=True).data,
        }
        return Response(payload)


class AboutView(APIView):
    """
    GET /api/about/
    Returns about page profile payload.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        profile = AboutProfile.get_instance()
        return Response(AboutDataSerializer(profile).data)


class SiteView(APIView):
    """
    GET /api/site/
    Returns site chrome metadata, nav items, social links, and studio contact fields.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        settings = SiteSettings.get_instance()
        return Response(SiteSettingsSerializer(settings).data)


class HomeView(APIView):
    """
    GET /api/home/
    Returns home page payload with hero info and selected featured works.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        settings = SiteSettings.get_instance()
        featured_items = (
            PortfolioItem.objects.filter(is_published=True, is_featured=True)
            .select_related('discipline', 'category')
            .order_by('featured_order', 'sort_order')
        )
        payload = {
            'displayName': settings.home_display_name,
            'roleTag': settings.home_role_tag,
            'coordinates': settings.home_coordinates,
            'reelTag': settings.home_reel_tag,
            'heroHeadline': settings.home_hero_headline,
            'heroIntro': settings.home_hero_intro,
            'heroMedia': {
                'type': 'image',
                'url': settings.home_hero_image_url,
                'alt': settings.home_hero_image_alt,
                'caption': settings.home_hero_caption,
            },
            'ctaLabel': 'View Work',
            'ctaSubLabel': 'Selected Portfolio',
            'ctaTarget': '/work',
            'selectedWorksSection': {
                'indexLabel': '01 · Archive',
                'title': 'Selected Works',
                'description': 'A curated selection of still photography, motion frames, and aerial drone compositions.',
            },
            'selectedWorks': SelectedWorkItemSerializer(featured_items, many=True).data,
        }
        return Response(payload)
