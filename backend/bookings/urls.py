from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  BookingViewSet
from .views import  BlockedDateViewSet

router = DefaultRouter()
router.register(r'', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),  

]