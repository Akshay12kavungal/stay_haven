from django.db import models
from bookings.models import Booking

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('advance_amount', 'Advance Payment'),
        ('completed', 'Payment Completed'),
        ('failed', 'Payment Failed'),
    ]

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payment')
    advance_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default=''
    )

    def __str__(self):
        return f'Payment for Booking {self.booking.id}'
