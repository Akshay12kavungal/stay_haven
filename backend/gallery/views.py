from rest_framework import viewsets

from backend.permissions import IsAdminOrReadOnly

from .models import GalleryImage
from .serializers import GalleryImageSerializer


class GalleryImageViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryImageSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        """Filter by ?property=<id> when given."""
        queryset = GalleryImage.objects.select_related('property').order_by('id')
        property_id = self.request.query_params.get('property')
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        return queryset
