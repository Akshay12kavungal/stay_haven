from django.contrib import admin

from .models import Amenity, Property


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'property_type', 'address', 'price', 'advance_amount', 'is_active')
    list_filter = ('property_type', 'is_active')
    search_fields = ('name', 'address')
    filter_horizontal = ('amenities',)


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
