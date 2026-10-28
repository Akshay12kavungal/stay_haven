from django.conf import settings
from twilio.rest import Client


def send_otp_via_whatsapp(phone_number, otp):
    if not (settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN):
        raise RuntimeError('Twilio is not configured (set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN).')
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    response = client.messages.create(
        from_=settings.TWILIO_WHATSAPP_FROM,
        body=f"Your StayHaven OTP is: {otp}. It will expire in 5 minutes.",
        to=f'whatsapp:{phone_number}',
    )
    return response.sid
