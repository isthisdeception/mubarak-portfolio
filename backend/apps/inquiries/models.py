from django.db import models


class ContactInquiry(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('archived', 'Archived'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    phone = models.CharField(max_length=50, blank=True, default='')
    service = models.CharField(max_length=255)
    project_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True, default='')
    message = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=500, blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
        ]
        verbose_name = 'Contact Inquiry'
        verbose_name_plural = 'Contact Inquiries'

    def __str__(self):
        date_str = self.created_at.strftime('%Y-%m-%d') if self.created_at else ''
        return f"{self.name} - {self.service} ({date_str})"
