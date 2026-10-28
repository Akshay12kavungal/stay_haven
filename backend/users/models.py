import secrets
from django.utils.timezone import now
from django.contrib.auth.models import User
from django.db import models
from datetime import timedelta

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)

    def generate_otp(self):
        self.otp = f"{secrets.randbelow(1_000_000):06d}"
        self.otp_created_at = now()
        self.save()

    def is_otp_valid(self, otp):
        return self.otp == otp and self.otp_created_at and now() - self.otp_created_at < timedelta(minutes=5)

    def clear_otp(self):
        self.otp = None
        self.otp_created_at = None
        self.save()

    def __str__(self):
        return self.user.username
