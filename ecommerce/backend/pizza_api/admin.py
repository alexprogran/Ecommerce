from django.contrib import admin
from .models import Pizza, PizzaPrice, Order, OrderItem, UserProfile

class PizzaPriceInline(admin.TabularInline):
    model = PizzaPrice
    extra = 3  # Show 3 empty forms for different sizes

@admin.register(Pizza)
class PizzaAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_popular', 'created_at')
    list_filter = ('category', 'is_popular')
    search_fields = ('name', 'description')
    inlines = [PizzaPriceInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('total',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'customer_name', 'status', 'total', 'created_at')
    list_filter = ('status', 'delivery_method', 'payment_method')
    search_fields = ('customer_name', 'customer_phone', 'delivery_address')
    readonly_fields = ('subtotal', 'tax', 'delivery_fee', 'total')
    inlines = [OrderItemInline]

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'is_admin')
    list_filter = ('is_admin',)
    search_fields = ('user__username', 'user__email', 'phone')