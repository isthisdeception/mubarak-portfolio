from django.contrib import admin
from .models import (
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


# ------------------------------------------------------------------------------
# Disciplines & Categories
# ------------------------------------------------------------------------------
class PortfolioCategoryInline(admin.TabularInline):
    model = PortfolioCategory
    extra = 1
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Discipline)
class DisciplineAdmin(admin.ModelAdmin):
    list_display = ('name', 'id', 'sort_order', 'is_published')
    list_editable = ('sort_order', 'is_published')
    inlines = [PortfolioCategoryInline]


@admin.register(PortfolioCategory)
class PortfolioCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'discipline', 'sort_order')
    list_filter = ('discipline',)
    prepopulated_fields = {'slug': ('name',)}


# ------------------------------------------------------------------------------
# Portfolio Items
# ------------------------------------------------------------------------------
@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'slug',
        'discipline',
        'category_name',
        'media_type',
        'is_featured',
        'featured_order',
        'is_published',
    )
    list_filter = ('discipline', 'media_type', 'is_featured', 'is_published')
    search_fields = ('title', 'slug', 'location', 'client_or_context', 'description')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_featured', 'featured_order', 'is_published')
    readonly_fields = ('created_at', 'updated_at')


# ------------------------------------------------------------------------------
# Reels
# ------------------------------------------------------------------------------
@admin.register(Reel)
class ReelAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'slug',
        'category',
        'aspect_ratio',
        'duration',
        'youtube_video_id',
        'is_published',
    )
    list_filter = ('category', 'aspect_ratio', 'is_published')
    search_fields = ('title', 'slug', 'location', 'gear_or_format', 'description')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_published',)
    readonly_fields = ('created_at', 'updated_at')


# ------------------------------------------------------------------------------
# Journal
# ------------------------------------------------------------------------------
@admin.register(JournalPost)
class JournalPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'category', 'published_date', 'read_time', 'is_published')
    list_filter = ('category', 'is_published')
    search_fields = ('title', 'slug', 'excerpt', 'location')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_published',)
    readonly_fields = ('created_at', 'updated_at')


# ------------------------------------------------------------------------------
# Services
# ------------------------------------------------------------------------------
class ServiceOfferingInline(admin.StackedInline):
    model = ServiceOffering
    extra = 1


@admin.register(ServiceGroup)
class ServiceGroupAdmin(admin.ModelAdmin):
    list_display = ('number', 'discipline', 'id', 'sort_order', 'is_published')
    list_editable = ('sort_order', 'is_published')
    inlines = [ServiceOfferingInline]


# ------------------------------------------------------------------------------
# Site Settings (Singleton)
# ------------------------------------------------------------------------------
class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    extra = 1


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    inlines = [SocialLinkInline]

    def has_add_permission(self, request):
        if SiteSettings.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False


# ------------------------------------------------------------------------------
# About Profile (Singleton)
# ------------------------------------------------------------------------------
class PhilosophyTenetInline(admin.TabularInline):
    model = PhilosophyTenet
    extra = 1


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1


class EquipmentCategoryInline(admin.StackedInline):
    model = EquipmentCategory
    extra = 1


class ProfessionalNoteInline(admin.TabularInline):
    model = ProfessionalNote
    extra = 1


@admin.register(AboutProfile)
class AboutProfileAdmin(admin.ModelAdmin):
    inlines = [
        PhilosophyTenetInline,
        SkillInline,
        EquipmentCategoryInline,
        ProfessionalNoteInline,
    ]

    def has_add_permission(self, request):
        if AboutProfile.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False
