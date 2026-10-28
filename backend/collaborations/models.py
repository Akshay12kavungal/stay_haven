from django.db import models

class CollaborationRequest(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)  # Owner's name (optional)
    email = models.EmailField(null=True, blank=True)  # Owner's email (optional)
    phone = models.CharField(max_length=15, blank=True, null=True)  # Contact number (optional)
    
    property_name = models.CharField(max_length=200, null=True, blank=True)  # Name of the property (optional)
    property_type = models.CharField(max_length=50, null=True, blank=True)  # Type of property (optional)
    location = models.CharField(max_length=255, null=True, blank=True)  # Property location (optional)
    
    bedrooms = models.PositiveIntegerField(null=True, blank=True)  # Number of bedrooms (optional)
    bathrooms = models.PositiveIntegerField(null=True, blank=True)  # Number of bathrooms (optional)
    
    description = models.TextField(null=True, blank=True)  # Detailed description of the property (optional)
    
    website = models.URLField(blank=True, null=True)  # Website link for the property (optional)
    photos = models.ImageField(upload_to='property_photos/', blank=True, null=True)  # Upload property photos (optional)

    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp of submission (auto-generated)

    def __str__(self):
        return f"{self.property_name} - {self.name} ({self.email})"