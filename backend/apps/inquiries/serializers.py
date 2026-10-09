from rest_framework import serializers
from apps.inquiries.models import ContactInquiry


class OptionalDateField(serializers.DateField):
    """
    Custom DateField that treats empty strings or null as None,
    and supports standard ISO YYYY-MM-DD date inputs.
    """
    def to_internal_value(self, value):
        if value in ('', None):
            return None
        return super().to_internal_value(value)


class ContactInquirySerializer(serializers.ModelSerializer):
    date = OptionalDateField(
        source='project_date',
        required=False,
        allow_null=True,
        default=None,
        format='%Y-%m-%d',
        input_formats=['%Y-%m-%d', 'iso-8601']
    )
    name = serializers.CharField(
        max_length=255,
        error_messages={
            'blank': 'This field may not be blank.',
            'required': 'This field is required.'
        }
    )
    email = serializers.EmailField(
        max_length=255,
        error_messages={
            'blank': 'This field may not be blank.',
            'invalid': 'Enter a valid email address.',
            'required': 'This field is required.'
        }
    )
    service = serializers.CharField(
        max_length=255,
        error_messages={
            'blank': 'This field may not be blank.',
            'required': 'This field is required.'
        }
    )
    phone = serializers.CharField(
        max_length=50,
        required=False,
        allow_blank=True,
        default=''
    )
    location = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        default=''
    )
    message = serializers.CharField(
        min_length=10,
        max_length=5000,
        error_messages={
            'blank': 'This field may not be blank.',
            'min_length': 'Ensure this field has at least 10 characters.',
            'required': 'This field is required.'
        }
    )

    class Meta:
        model = ContactInquiry
        fields = [
            'name',
            'email',
            'phone',
            'service',
            'date',
            'location',
            'message',
        ]
