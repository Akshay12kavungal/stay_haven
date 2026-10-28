from django.contrib import admin

from .models import UserProfile

admin.site.site_header = "StayHaven"
admin.site.site_title = "StayHaven"
admin.site.index_title = "Welcome to Your StayHaven Admin Portal"


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'date_of_birth')
    search_fields = ('user__username', 'user__email', 'phone_number')
    exclude = ('otp', 'otp_created_at')
