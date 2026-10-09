import datetime
from django.test import TestCase, override_settings
from django.core.cache import cache
from django.contrib.auth.models import User
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


class ContactInquiryAPITests(TestCase):
    def setUp(self):
        cache.clear()

    def tearDown(self):
        cache.clear()

    def test_valid_contact_submission(self):
        payload = {
            'name': 'Marcus Vance',
            'email': 'marcus@vancecreative.com',
            'phone': '+1 555-0199',
            'service': 'Cinematography: Commercial Brand Film',
            'date': '2025-09-15',
            'location': 'Reykjavik, Iceland',
            'message': 'We are planning a winter visual campaign and would love to partner.'
        }
        response = self.client.post(
            '/api/contact/',
            data=payload,
            content_type='application/json',
            HTTP_USER_AGENT='TestAgent/1.0',
            REMOTE_ADDR='198.51.100.42'
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertTrue(data.get('ok'))
        self.assertIn('id', data)

        # Verify database record
        inquiry = ContactInquiry.objects.get(id=data['id'])
        self.assertEqual(inquiry.name, 'Marcus Vance')
        self.assertEqual(inquiry.email, 'marcus@vancecreative.com')
        self.assertEqual(inquiry.phone, '+1 555-0199')
        self.assertEqual(inquiry.service, 'Cinematography: Commercial Brand Film')
        self.assertEqual(inquiry.project_date, datetime.date(2025, 9, 15))
        self.assertEqual(inquiry.location, 'Reykjavik, Iceland')
        self.assertEqual(inquiry.message, 'We are planning a winter visual campaign and would love to partner.')
        self.assertEqual(inquiry.status, 'new')
        self.assertEqual(inquiry.ip_address, '198.51.100.42')
        self.assertEqual(inquiry.user_agent, 'TestAgent/1.0')

    def test_valid_submission_with_minimal_optional_fields(self):
        payload = {
            'name': 'Sarah Connor',
            'email': 'sarah@example.com',
            'service': 'Drone: Landscape Survey',
            'message': 'Need high altitude aerial imagery for a conservation initiative.'
        }
        response = self.client.post(
            '/api/contact/',
            data=payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertTrue(data.get('ok'))

        inquiry = ContactInquiry.objects.get(id=data['id'])
        self.assertEqual(inquiry.name, 'Sarah Connor')
        self.assertIsNone(inquiry.project_date)
        self.assertEqual(inquiry.phone, '')
        self.assertEqual(inquiry.location, '')

    def test_valid_submission_with_empty_date_string(self):
        payload = {
            'name': 'David Kim',
            'email': 'david@example.com',
            'phone': '',
            'service': 'Photography: Portrait Sessions',
            'date': '',
            'location': '',
            'message': 'Inquiring about executive portraits in November.'
        }
        response = self.client.post(
            '/api/contact/',
            data=payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        inquiry = ContactInquiry.objects.get(id=response.json()['id'])
        self.assertIsNone(inquiry.project_date)

    def test_x_forwarded_for_ip_capture(self):
        payload = {
            'name': 'Proxy Client',
            'email': 'proxy@example.com',
            'service': 'Photography',
            'message': 'Testing proxy headers capture in view.'
        }
        response = self.client.post(
            '/api/contact/',
            data=payload,
            content_type='application/json',
            HTTP_X_FORWARDED_FOR='203.0.113.195, 10.0.0.1'
        )
        self.assertEqual(response.status_code, 201)
        inquiry = ContactInquiry.objects.get(id=response.json()['id'])
        self.assertEqual(inquiry.ip_address, '203.0.113.195')

    def test_validation_errors_for_missing_required_fields(self):
        response = self.client.post(
            '/api/contact/',
            data={},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        errors = response.json()
        self.assertIn('name', errors)
        self.assertIn('email', errors)
        self.assertIn('service', errors)
        self.assertIn('message', errors)

    def test_validation_error_for_invalid_email(self):
        payload = {
            'name': 'Alex',
            'email': 'not-an-email',
            'service': 'Drone',
            'message': 'Valid message exceeding minimum required length.'
        }
        response = self.client.post(
            '/api/contact/',
            data=payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        errors = response.json()
        self.assertIn('email', errors)

    def test_validation_error_for_short_message(self):
        payload = {
            'name': 'Alex',
            'email': 'alex@example.com',
            'service': 'Drone',
            'message': 'Too short'  # 9 chars, requires 10
        }
        response = self.client.post(
            '/api/contact/',
            data=payload,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        errors = response.json()
        self.assertIn('message', errors)
        self.assertIn('10 characters', str(errors['message']))

    def test_public_get_not_allowed(self):
        # Public listing must be prohibited (no public GET endpoint)
        response = self.client.get('/api/contact/')
        self.assertEqual(response.status_code, 405)

    def test_put_and_delete_not_allowed(self):
        self.assertEqual(self.client.put('/api/contact/').status_code, 405)
        self.assertEqual(self.client.delete('/api/contact/').status_code, 405)

    def test_throttling_scoped_to_contact(self):
        cache.clear()
        payload = {
            'name': 'Throttled User',
            'email': 'user@example.com',
            'service': 'Drone Services',
            'message': 'Testing rate limiting for abusive submission spikes.'
        }
        # First 5 submissions within an hour should succeed (rate is 5/hour)
        for i in range(5):
            resp = self.client.post('/api/contact/', data=payload, content_type='application/json')
            self.assertEqual(resp.status_code, 201)

        # 6th submission must be throttled with HTTP 429
        resp = self.client.post('/api/contact/', data=payload, content_type='application/json')
        self.assertEqual(resp.status_code, 429)
        self.assertIn('throttled', resp.json().get('detail', '').lower())



class ContactAdminIntegrationTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            username='admin_inquiries',
            email='admin@example.com',
            password='adminpassword123'
        )
        self.inquiry = ContactInquiry.objects.create(
            name='Test Client',
            email='client@example.com',
            service='Photography',
            message='Test message for admin review.'
        )

    def test_admin_view_inquiries(self):
        self.client.login(username='admin_inquiries', password='adminpassword123')
        # Inquiry changelist
        resp = self.client.get('/admin/inquiries/contactinquiry/')
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, 'Test Client')

        # Inquiry detail
        detail_url = f'/admin/inquiries/contactinquiry/{self.inquiry.id}/change/'
        resp_detail = self.client.get(detail_url)
        self.assertEqual(resp_detail.status_code, 200)
        self.assertContains(resp_detail, 'client@example.com')

        # Add inquiry via admin is prohibited
        resp_add = self.client.get('/admin/inquiries/contactinquiry/add/')
        self.assertEqual(resp_add.status_code, 403)
