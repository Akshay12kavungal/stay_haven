from rest_framework import viewsets

from backend.permissions import IsAdminOrReadOnly

from .models import CarouselVideo
from .serializers import CarouselVideoSerializer


class CarouselVideoViewSet(viewsets.ModelViewSet):
    serializer_class = CarouselVideoSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = CarouselVideo.objects.order_by('id')
        if not self.request.user.is_staff:
            qs = qs.filter(is_active=True)
        return qs
