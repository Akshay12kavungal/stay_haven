from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking', 'amount', 'payment_date', 'payment_status')
    list_filter = ('payment_status', 'payment_date')
    search_fields = ('booking__user__username', 'booking__property__name')

