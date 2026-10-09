import ipaddress
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from apps.inquiries.serializers import ContactInquirySerializer


def get_client_ip(request):
    """
    Extract and validate client IP address from proxy headers or remote address.
    Returns valid IPv4/IPv6 string or None.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    raw_ip = None
    if x_forwarded_for:
        raw_ip = x_forwarded_for.split(',')[0].strip()
    else:
        raw_ip = request.META.get('REMOTE_ADDR')

    if raw_ip:
        try:
            ipaddress.ip_address(raw_ip)
            return raw_ip
        except ValueError:
            return None
    return None


class ContactCreateView(generics.CreateAPIView):
    """
    Public endpoint to create contact / booking inquiries.
    Supports throttled POST requests and returns 201 {"ok": true, "id": <id>}.
    Public GET listing is prohibited.
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact'
    serializer_class = ContactInquirySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ip_addr = get_client_ip(request)
        ua = request.META.get('HTTP_USER_AGENT', '')[:500]

        inquiry = serializer.save(
            ip_address=ip_addr,
            user_agent=ua
        )

        return Response(
            {'ok': True, 'id': inquiry.id},
            status=status.HTTP_201_CREATED
        )
