from rest_framework import permissions, viewsets

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """A user's payment history. Payments are created through POST /api/bookings/{id}/pay/."""

    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Payment.objects.select_related('booking')
        if not self.request.user.is_staff:
            qs = qs.filter(booking__user=self.request.user)
        return qs.order_by('-payment_date')
