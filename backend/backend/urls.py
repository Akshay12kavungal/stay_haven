from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic.base import RedirectView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from bookings.views import BlockedDateViewSet
from users.views import CurrentUserProfile, request_otp, verify_otp

urlpatterns = [
    path('', RedirectView.as_view(url='/admin/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/bookings/', include('bookings.urls')),
    path('api/properties/', include('properties.urls')),
    path('api/carousel/', include('carousel.urls')),
    path('api/gallery/', include('gallery.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/users/', include('users.urls')),
    path('api/collaborations/', include('collaborations.urls')),
    path('api/about/', include('about.urls')),
    path('api/notification/', include('notification.urls')),

    path('api/current_profile/', CurrentUserProfile.as_view(), name='current-user-profile'),
    path('api/blockeddates/', BlockedDateViewSet.as_view(), name='blockeddates-list'),

    path('api/request-otp/', request_otp, name='request_otp'),
    path('api/verify-otp/', verify_otp, name='verify_otp'),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Media is served by Django in development and by nginx in Docker.
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
