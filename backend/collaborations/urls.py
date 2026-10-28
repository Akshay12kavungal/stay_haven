from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CollaborationViewset

router = DefaultRouter()
router.register(r'', CollaborationViewset)

urlpatterns = [
    path('', include(router.urls)),  

]