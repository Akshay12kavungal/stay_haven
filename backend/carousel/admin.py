from django.contrib import admin

from carousel.models import CarouselVideo

# Register your models here.

@admin.register(CarouselVideo)
class CarouselAdmin(admin.ModelAdmin):
    list_display=['title','video']
    search_fields=['title']
    list_filter=['is_active']