from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from notification.models import Notification

from .models import UserProfile
from .serializers import (
    ChangePasswordSerializer,
    OTPRequestSerializer,
    OTPVerifySerializer,
    UserProfileSerializer,
    UserSerializer,
    UserSignupSerializer,
)
from .utils import send_otp_via_whatsapp


def tokens_for(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """Staff can browse users; everyone else can only see themselves via /me/."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "username"

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        return Response(self.get_serializer(request.user).data)


class ProfileViewSet(viewsets.GenericViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        profile = self.get_object()
        if request.method == 'PATCH':
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        return Response(self.get_serializer(profile).data)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'message': 'Password updated.'})


class RegisterViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = UserSignupSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        Notification.objects.create(user=user, message="Welcome to StayHaven! Your account is ready.")
        return Response(
            {"message": "User registered successfully!", "user_id": user.id, **tokens_for(user)},
            status=status.HTTP_201_CREATED,
        )


class CurrentUserProfile(APIView):
    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response(UserProfileSerializer(profile).data)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_otp(request):
    serializer = OTPRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user_profile = get_object_or_404(UserProfile, phone_number=serializer.validated_data['phone_number'])
    user_profile.generate_otp()
    try:
        send_otp_via_whatsapp(user_profile.phone_number, user_profile.otp)
    except Exception:
        return Response({'error': 'Could not send the OTP right now. Please try again later.'},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE)
    return Response({'message': 'OTP sent via WhatsApp'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_otp(request):
    serializer = OTPVerifySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user_profile = get_object_or_404(UserProfile, phone_number=serializer.validated_data['phone_number'])
    if user_profile.is_otp_valid(serializer.validated_data['otp']):
        user_profile.clear_otp()
        return Response({'message': 'Login successful', **tokens_for(user_profile.user)})
    return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
