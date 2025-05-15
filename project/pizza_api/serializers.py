from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Pizza, PizzaPrice, Order, OrderItem, UserProfile




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'phone', 'default_address', 'is_admin')

class PizzaPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PizzaPrice
        fields = ('size', 'price')

class PizzaSerializer(serializers.ModelSerializer):
    prices = PizzaPriceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pizza
        fields = ('id', 'name', 'description', 'category', 'image', 'is_popular', 
                 'toppings', 'prices', 'created_at', 'updated_at')

class OrderItemSerializer(serializers.ModelSerializer):
    pizza = PizzaSerializer(read_only=True)
    pizza_id = serializers.PrimaryKeyRelatedField(
        queryset=Pizza.objects.all(), 
        write_only=True,
        source='pizza'
    )
    
    class Meta:
        model = OrderItem
        fields = ('id', 'pizza', 'pizza_id', 'size', 'quantity', 'price', 'total')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'user', 'status', 'delivery_method', 'payment_method',
                 'customer_name', 'customer_phone', 'delivery_address',
                 'delivery_instructions', 'subtotal', 'tax', 'delivery_fee',
                 'total', 'items', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order

class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('status',)