from django.db.models import Avg, Count
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from backend.permissions import IsAdminOrReadOnly
from bookings.models import Booking

from .models import Property
from .serializers import PropertySerializer


class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = (
            Property.objects.prefetch_related('amenities')
            .annotate(rating=Avg('reviews__rating'), review_count=Count('reviews', distinct=True))
            .order_by('-created_at')
        )
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        return queryset

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def availability(self, request, pk=None):
        """Date ranges that can't be booked: active bookings plus admin-blocked dates."""
        prop = self.get_object()
        booked = Booking.holding_dates().filter(property=prop).values('check_in', 'check_out')
        blocked = prop.blocked_dates.values('start_date', 'end_date')
        ranges = [{'start': b['check_in'], 'end': b['check_out'], 'type': 'booked'} for b in booked]
        # Blocked ranges are inclusive of end_date; express them as checkout-exclusive like bookings.
        ranges += [{'start': b['start_date'], 'end': b['end_date'], 'type': 'blocked', 'inclusive': True} for b in blocked]
        return Response(ranges)
