from django.db import transaction
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from notification.models import Notification
from payments.models import Payment

from .models import BlockedDate, Booking
from .pricing import quote
from .serializers import BlockedDatesSerializer, BookingSerializer


class BookingViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
                     viewsets.GenericViewSet):
    """A user's own bookings. Staff see every booking; editing is done in the admin."""

    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Booking.objects.select_related('property', 'user')
        if not self.request.user.is_staff:
            qs = qs.filter(user=self.request.user)
        property_id = self.request.query_params.get('property')
        if property_id:
            qs = qs.filter(property_id=property_id)
        return qs

    @transaction.atomic
    def perform_create(self, serializer):
        data = serializer.validated_data
        q = quote(data['property'], data['check_in'], data['check_out'])
        booking = serializer.save(
            user=self.request.user, status='pending', total_amount=q['total'], advance_amount=q['advance']
        )
        Notification.objects.create(
            user=booking.user,
            message=f"Booking #{booking.id} at {booking.property.name} is reserved. Pay the advance to confirm it.",
        )

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def pay(self, request, pk=None):
        """Record the advance payment and confirm the booking.

        No payment gateway is wired up yet, so this records the payment as completed.
        """
        booking = self.get_object()
        if booking.status != 'pending':
            return Response({'detail': f'This booking is already {booking.get_status_display().lower()}.'},
                            status=status.HTTP_400_BAD_REQUEST)
        if not Booking.holding_dates().filter(pk=booking.pk).exists():
            return Response({'detail': 'This reservation has expired. Please book again.'},
                            status=status.HTTP_400_BAD_REQUEST)

        Payment.objects.create(
            booking=booking, amount=booking.advance_amount, advance_amount=booking.advance_amount,
            payment_status='advance_amount',
        )
        booking.status = 'confirmed'
        booking.save()
        Notification.objects.create(
            user=booking.user, message=f"Your booking #{booking.id} at {booking.property.name} is confirmed."
        )
        return Response(self.get_serializer(booking).data)

    @action(detail=True, methods=['patch', 'post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == 'canceled':
            return Response({'detail': 'Booking is already cancelled.'}, status=status.HTTP_400_BAD_REQUEST)
        if booking.status == 'visited':
            return Response({'detail': 'A completed stay cannot be cancelled.'}, status=status.HTTP_400_BAD_REQUEST)
        booking.status = 'canceled'
        booking.save()
        Notification.objects.create(user=booking.user, message=f"Your booking #{booking.id} has been cancelled.")
        return Response(self.get_serializer(booking).data)


class BlockedDateViewSet(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        blocked_dates = BlockedDate.objects.all()
        property_id = request.query_params.get('property')
        if property_id:
            blocked_dates = blocked_dates.filter(property_id=property_id)
        return Response(BlockedDatesSerializer(blocked_dates, many=True).data)
