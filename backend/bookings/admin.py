from django.contrib import admin

from .models import BlockedDate, Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'property', 'check_in', 'check_out', 'guests',
                    'advance_amount', 'balance_amount', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'property', 'check_in')
    search_fields = ('user__username', 'property__name')
    date_hierarchy = 'check_in'


@admin.register(BlockedDate)
class BlockedDateAdmin(admin.ModelAdmin):
    list_display = ("property", "start_date", "end_date")
    list_filter = ("property",)
    search_fields = ("property__name",)
