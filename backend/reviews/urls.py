from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactUsViewSet, FAQListViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'faqs', FAQListViewSet)
router.register(r'contactus', ContactUsViewSet)

urlpatterns = [
    path('', include(router.urls)),  

]