from django.contrib import admin
from .models import ContactInquiry


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'service', 'project_date', 'status', 'created_at')
    list_filter = ('status', 'service', 'created_at')
    search_fields = ('name', 'email', 'location', 'message')
    list_editable = ('status',)
    readonly_fields = (
        'name',
        'email',
        'phone',
        'service',
        'project_date',
        'location',
        'message',
        'ip_address',
        'user_agent',
        'created_at',
        'updated_at',
    )

    def has_add_permission(self, request):
        return False
