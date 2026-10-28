from django.conf import settings
from django.contrib.auth.models import User
from django.test import Client, TestCase


class HostAndAdminSecurityTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin_user = User.objects.create_superuser(
            username="testadmin",
            email="testadmin@example.com",
            password="testpassword123",
        )

    def test_allowed_hosts_includes_ipv6_bracketed(self):
        """Ensure IPv6 address is properly bracketed in ALLOWED_HOSTS per RFC 3986."""
        self.assertIn("[::1]", settings.ALLOWED_HOSTS)

    def test_admin_login_ipv4_localhost(self):
        """IPv4 localhost access should succeed with 200 OK."""
        response = self.client.get("/admin/login/", HTTP_HOST="localhost:8000")
        self.assertEqual(response.status_code, 200)

    def test_admin_login_ipv4_numeric(self):
        """IPv4 numeric 127.0.0.1 access should succeed with 200 OK."""
        response = self.client.get("/admin/login/", HTTP_HOST="127.0.0.1:8000")
        self.assertEqual(response.status_code, 200)

    def test_admin_login_ipv6(self):
        """IPv6 [::1] access should succeed with 200 OK."""
        response = self.client.get("/admin/login/", HTTP_HOST="[::1]:8000")
        self.assertEqual(response.status_code, 200)

    def test_admin_index_authenticated_no_500_error(self):
        """Authenticated access to admin index should return 200 without static manifest 500 errors."""
        self.client.force_login(self.admin_user)
        response_v4 = self.client.get("/admin/", HTTP_HOST="127.0.0.1:8000")
        self.assertEqual(response_v4.status_code, 200)

        response_v6 = self.client.get("/admin/", HTTP_HOST="[::1]:8000")
        self.assertEqual(response_v6.status_code, 200)

    def test_disallowed_host_returns_400(self):
        """Requests with unauthorized Host header must be rejected with HTTP 400."""
        response = self.client.get("/admin/login/", HTTP_HOST="evil-unauthorized-host.com")
        self.assertEqual(response.status_code, 400)
