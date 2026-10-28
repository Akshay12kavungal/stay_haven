from rest_framework import viewsets

from backend.permissions import CreateOnlyOrAdmin

from .models import CollaborationRequest
from .serializers import CollaborationRequestSerializer


class CollaborationViewset(viewsets.ModelViewSet):
    """Public "list your property" form; submissions are visible to staff only."""

    queryset = CollaborationRequest.objects.order_by('-created_at')
    serializer_class = CollaborationRequestSerializer
    permission_classes = [CreateOnlyOrAdmin]
