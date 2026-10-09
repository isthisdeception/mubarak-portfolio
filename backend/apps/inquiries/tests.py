from django.test import TestCase
from apps.inquiries.models import ContactInquiry


class ContactInquiryModelTests(TestCase):
    def test_create_contact_inquiry(self):
        inquiry = ContactInquiry.objects.create(
            name='Elena Rostova',
            email='elena@example.com',
            phone='+39 02 1234567',
            service='Documentary Production',
            location='Venice, Italy',
            message='We would like to discuss a documentary commission.'
        )
        self.assertEqual(inquiry.status, 'new')
        self.assertIsNotNone(inquiry.created_at)
        self.assertIn('Elena Rostova', str(inquiry))
        self.assertIn('Documentary Production', str(inquiry))
