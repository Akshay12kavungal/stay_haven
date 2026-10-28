from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from backend.permissions import CreateOnlyOrAdmin, IsAdminOrReadOnly

from .models import FAQ, ContactUs, Review
from .serializers import ContactUsSerializer, FAQSerializer, ReviewSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS or obj.user == request.user or request.user.is_staff


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        qs = Review.objects.select_related('user').order_by('-created_at')
        property_id = self.request.query_params.get('property')
        if property_id:
            qs = qs.filter(property_id=property_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ContactUsViewSet(viewsets.ModelViewSet):
    """Public contact form; submissions are visible to staff only."""

    queryset = ContactUs.objects.order_by('-created_at')
    serializer_class = ContactUsSerializer
    permission_classes = [CreateOnlyOrAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact = serializer.save()
        return Response({"message": "Message received successfully!", "contact_id": contact.id},
                        status=status.HTTP_201_CREATED)


class FAQListViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.order_by('created_at')
    serializer_class = FAQSerializer
    permission_classes = [IsAdminOrReadOnly]
