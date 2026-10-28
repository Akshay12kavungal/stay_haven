import builtins
from datetime import timedelta

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from properties.models import Property

# Bookings in these states hold their dates. Unpaid "pending" bookings only hold
# dates for PENDING_HOLD, so an abandoned checkout doesn't block the calendar.
ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed', 'paid', 'bookings', 'visited']
PENDING_HOLD = timedelta(minutes=30)


class Booking(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('canceled', 'Canceled'),
        ('bookings', 'Bookings'),
        ('visited', 'Visited'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='bookings')
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveIntegerField()
    advance_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    balance_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Booking {self.id} for {self.property.name} by {self.user.username}'

    @builtins.property  # the `property` field shadows the builtin in this class body
    def nights(self):
        return (self.check_out - self.check_in).days

    @classmethod
    def holding_dates(cls):
        """Bookings that currently block their date range."""
        return cls.objects.filter(status__in=ACTIVE_BOOKING_STATUSES).exclude(
            status='pending', created_at__lt=timezone.now() - PENDING_HOLD
        )

    def save(self, *args, **kwargs):
        if self.total_amount is not None and self.advance_amount is not None:
            self.balance_amount = self.total_amount - self.advance_amount
        else:
            self.balance_amount = None
        super().save(*args, **kwargs)


def overlapping_bookings(property_id, check_in, check_out, exclude_id=None):
    qs = Booking.holding_dates().filter(property_id=property_id, check_in__lt=check_out, check_out__gt=check_in)
    if exclude_id:
        qs = qs.exclude(id=exclude_id)
    return qs


def overlapping_blocks(property_id, check_in, check_out):
    # BlockedDate.end_date is inclusive; a stay occupies nights check_in .. check_out-1.
    return BlockedDate.objects.filter(property_id=property_id, start_date__lt=check_out, end_date__gte=check_in)


class BlockedDate(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="blocked_dates")
    start_date = models.DateField()
    end_date = models.DateField()

    def clean(self):
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValidationError("Start date cannot be after end date.")

        overlaps = BlockedDate.objects.filter(
            property_id=self.property_id,
            start_date__lte=self.end_date,
            end_date__gte=self.start_date,
        ).exclude(pk=self.pk)
        if overlaps.exists():
            raise ValidationError("This date range overlaps with an existing block.")

    def __str__(self):
        return f"Blocked: {self.start_date} to {self.end_date} for {self.property.name}"
