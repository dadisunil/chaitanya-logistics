from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Shipment, CustomUser

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'status', 'origin', 'destination', 'priority')

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'user_type')
    fieldsets = UserAdmin.fieldsets + (
        ("Additional Info", {'fields': ('user_type',)}),
    )