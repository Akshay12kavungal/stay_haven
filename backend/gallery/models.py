from django.db import models
from properties.models import Property

class GalleryImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to='gallery_images/')
    title = models.CharField(max_length=100)  # Optional field for image title
    description = models.TextField(blank=True, null=True)  # Optional field for description
    tag = models.CharField(max_length=50, blank=True, null=True)  # Optional tag field

    def __str__(self):
        return f'{self.property.name} - {self.title or "Untitled Image"}'
