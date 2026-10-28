from django.db import models

# Create your models here.
from django.db import models

class CarouselVideo(models.Model):
    title = models.CharField(max_length=255)
    video = models.FileField(upload_to='carousel_videos/')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
