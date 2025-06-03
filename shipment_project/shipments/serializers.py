from rest_framework import serializers
from .models import Booking, Shipment
import uuid

class AddressSerializer(serializers.Serializer):
    # Allow any values for address fields by making them optional and removing validation constraints
    name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    zip = serializers.CharField(max_length=20, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)  # Email remains optional

class BookingSerializer(serializers.ModelSerializer):
    pickup_address = AddressSerializer()
    delivery_address = AddressSerializer()
    service_type = serializers.CharField(max_length=50)
    package_type = serializers.CharField(max_length=50)
    weight = serializers.FloatField()
    dimensions = serializers.CharField(max_length=50)
    description = serializers.CharField(allow_blank=True, required=False)
    pickup_date = serializers.DateField()
    pickup_time_window = serializers.CharField(max_length=50)
    payment_method = serializers.CharField(max_length=50)
    lr_no = serializers.CharField(required=False)
    from_location = serializers.CharField(max_length=100, allow_blank=True, required=False)
    to_location = serializers.CharField(max_length=100, allow_blank=True, required=False)
    branch_from_phone = serializers.CharField(max_length=15, allow_blank=True, required=False)
    branch_to_phone = serializers.CharField(max_length=15, allow_blank=True, required=False)
    phone = serializers.CharField(max_length=15, required=False)  # Make phone optional

    class Meta:
        model = Booking
        fields = '__all__'

    def validate_pickup_address(self, value):
        required_fields = ['name', 'address', 'city', 'zip', 'country', 'phone']
        for field in required_fields:
            if field not in value or not value[field]:
                raise serializers.ValidationError(f"Pickup address must include {field}.")
        return value

    def validate_delivery_address(self, value):
        required_fields = ['name', 'address', 'city', 'zip', 'country', 'phone']
        for field in required_fields:
            if field not in value or not value[field]:
                raise serializers.ValidationError(f"Delivery address must include {field}.")
        return value

    def create(self, validated_data):
        pickup_address_data = validated_data.pop('pickup_address')
        delivery_address_data = validated_data.pop('delivery_address')

        # Combine nested address data into a single string for storage
        validated_data['pickup_address'] = f"{pickup_address_data['name']}, {pickup_address_data['address']}, {pickup_address_data['city']}, {pickup_address_data['zip']}, {pickup_address_data['country']}, {pickup_address_data['phone']}, {pickup_address_data.get('email', '')}"
        validated_data['delivery_address'] = f"{delivery_address_data['name']}, {delivery_address_data['address']}, {delivery_address_data['city']}, {delivery_address_data['zip']}, {delivery_address_data['country']}, {delivery_address_data['phone']}, {delivery_address_data.get('email', '')}"

        return Booking.objects.create(**validated_data)

class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = '__all__'
