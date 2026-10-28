from django.contrib import admin

from gallery.models import GalleryImage


@admin.register(GalleryImage)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'property', 'tag')
    search_fields = ('title', 'property__name')
    list_filter = ('property', 'tag')
