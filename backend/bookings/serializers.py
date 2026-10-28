from django.utils import timezone
from rest_framework import serializers

from bookings.models import BlockedDate, Booking, overlapping_blocks, overlapping_bookings
from bookings.pricing import quote


class BookingPropertySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    address = serializers.CharField()
    image = serializers.ImageField()
    rooms = serializers.IntegerField()


class BookingSerializer(serializers.ModelSerializer):
    property_detail = BookingPropertySerializer(source='property', read_only=True)
    nights = serializers.IntegerField(read_only=True)
    price_breakdown = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'property', 'property_detail', 'check_in', 'check_out', 'guests', 'nights',
            'advance_amount', 'balance_amount', 'total_amount', 'status', 'created_at', 'price_breakdown',
        ]
        read_only_fields = ['advance_amount', 'balance_amount', 'total_amount', 'status', 'created_at']

    def get_price_breakdown(self, obj):
        q = quote(obj.property, obj.check_in, obj.check_out)
        return {k: str(v) if not isinstance(v, int) else v for k, v in q.items()}

    def validate(self, attrs):
        prop = attrs['property']
        check_in, check_out, guests = attrs['check_in'], attrs['check_out'], attrs['guests']

        if not prop.is_active:
            raise serializers.ValidationError({'property': 'This property is not available for booking.'})
        if check_in < timezone.localdate():
            raise serializers.ValidationError({'check_in': 'Check-in cannot be in the past.'})
        if check_out <= check_in:
            raise serializers.ValidationError({'check_out': 'Check-out must be after check-in.'})
        if guests < 1 or guests > prop.guests:
            raise serializers.ValidationError({'guests': f'This property allows 1 to {prop.guests} guests.'})
        if overlapping_blocks(prop.id, check_in, check_out).exists():
            raise serializers.ValidationError({'non_field_errors': ['Those dates are unavailable at this property.']})
        if overlapping_bookings(prop.id, check_in, check_out).exists():
            raise serializers.ValidationError({'non_field_errors': ['Those dates are already booked.']})
        return attrs


class BlockedDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedDate
        fields = "__all__"
