from rest_framework import serializers
from .models import CarouselVideo

class CarouselVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarouselVideo
        fields = '__all__'