from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PizzaViewSet, OrderViewSet, RegisterView, UserProfileViewSet

router = DefaultRouter()
router.register(r'pizzas', PizzaViewSet, basename='pizza')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
]