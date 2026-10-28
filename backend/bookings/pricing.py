from decimal import ROUND_HALF_UP, Decimal

from django.conf import settings

CENT = Decimal('0.01')


def quote(prop, check_in, check_out):
    """Server-side price breakdown for a stay. All amounts are Decimals in INR."""
    nights = (check_out - check_in).days
    rental = (prop.price * nights).quantize(CENT, ROUND_HALF_UP)
    gst = (rental * Decimal(settings.BOOKING_GST_RATE)).quantize(CENT, ROUND_HALF_UP)
    total = rental + gst
    advance = min((prop.advance_amount or Decimal('0')) * nights, total).quantize(CENT, ROUND_HALF_UP)
    return {
        'nights': nights,
        'rental': rental,
        'gst': gst,
        'gst_rate': Decimal(settings.BOOKING_GST_RATE),
        'total': total,
        'advance': advance,
        'balance': total - advance,
    }
