from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.serializers import Serializer, CharField, EmailField

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Pizza, Order, UserProfile
from .serializers import (
    PizzaSerializer, OrderSerializer, OrderUpdateSerializer,
    UserProfileSerializer
)



# Serializer para validar os dados de cadastro
class RegisterSerializer(Serializer):
    username = CharField(max_length=100)
    email = EmailField()
    password = CharField(write_only=True, max_length=128)

    def validate(self, data):
        # Você pode adicionar validações customizadas aqui (ex: checar se o email já existe)
        return data

class RegisterView(APIView):
    def post(self, request):
        # Validação com o serializer
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Criando o usuário
            username = serializer.validated_data['username']
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = User.objects.create_user(username=username, email=email, password=password)

            return Response({'message': 'Usuário registrado com sucesso!'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'userprofile') and request.user.userprofile.is_admin

class PizzaViewSet(viewsets.ModelViewSet):
    queryset = Pizza.objects.all()
    serializer_class = PizzaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    @action(detail=False, methods=['get'])
    def popular(self, request):
        popular_pizzas = Pizza.objects.filter(is_popular=True)
        serializer = self.get_serializer(popular_pizzas, many=True)
        return Response(serializer.data)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'userprofile') and user.userprofile.is_admin:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = get_object_or_404(Order, pk=pk)
        
        if not request.user.userprofile.is_admin:
            return Response(
                {"detail": "Only admins can update order status."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = OrderUpdateSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)