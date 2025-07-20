from django.db import models
from decimal import Decimal
from django.contrib.auth.models import AbstractUser
from django.conf import settings
import logging

class Shipment(models.Model):
    lr_no = models.CharField(max_length=20, unique=True)    
    tracking_number = models.CharField(max_length=50, unique=True)
    from_location = models.CharField(max_length=100)
    to_location = models.CharField(max_length=100)
    dod = models.DateField(null=True, blank=True)
    branch_from_phone = models.CharField(max_length=15)
    branch_to_phone = models.CharField(max_length=15)
    customer_name = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='Pending')
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    priority = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.tracking_number}: {self.origin_pincode} -> {self.destination_pincode}"


class ShipmentDetails(models.Model):
    shipment = models.OneToOneField(Shipment, on_delete=models.CASCADE, related_name='shipment_details')
    from_location = models.CharField(max_length=100)
    branch_ph_no = models.CharField(max_length=15)
    to_location = models.CharField(max_length=100)
    no_of_packages_in_words = models.CharField(max_length=255)
    actual_wt_kg = models.FloatField()
    charge_wt_kg = models.FloatField()
    pm_no = models.CharField(max_length=100)
    gstin = models.CharField(max_length=50)
    tel = models.CharField(max_length=15)
    pin = models.CharField(max_length=6)
    consignor = models.CharField(max_length=100)
    consignee = models.CharField(max_length=100)
    remark = models.TextField()
    freight = models.FloatField()
    dod = models.DateField(null=True, blank=True)  # Date of Delivery
    #misc_charges
    sub_total = models.FloatField()
    sgst = models.FloatField()
    cgst = models.FloatField()
    g_total = models.FloatField()  # Grand Total
    to_pay = models.FloatField()
    paid = models.FloatField()
    tbb = models.CharField(max_length=10)  # To Be Billed
    to_be_delivered_before_date = models.DateField(null=True, blank=True)
    le_no = models.CharField(max_length=100)  # LR No. (Consignment Note Number)
    pkg_date = models.DateField(null=True, blank=True)  # Package Date
    owners_risk = models.BooleanField(default=False)
    e_way_bill_status = models.CharField(max_length=100)
    insurance = models.CharField(max_length=100)
    policy_no = models.CharField(max_length=100)

    def __str__(self):
        return f"Details for {self.shipment.tracking_number}"


class Booking(models.Model):
    lr_no = models.CharField(max_length=20, unique=True, blank=True, null=True)  # Allow blank and null for auto-generation
    booking_date = models.DateField(auto_now_add=True)  # Booking Date auto-populated on creation
    from_location = models.CharField(max_length=100)
    to_location = models.CharField(max_length=100)
    branch_from_phone = models.CharField(max_length=15)
    branch_to_phone = models.CharField(max_length=15)
    actual_weight = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    chargeable_weight = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    freight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    dod = models.DateField(auto_now_add=True)  # Delivery on Demand amount
    sgst = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    cgst = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    policy_no = models.CharField(max_length=50, blank=True, null=True)
    noofpkgs = models.CharField(max_length=50, blank=True, null=True)
    consignor = models.CharField(max_length=50, blank=True, null=True)
    consignee = models.CharField(max_length=50, blank=True, null=True)
    saidtocontain = models.CharField(max_length=50, blank=True, null=True)
    pickup_address = models.JSONField(blank=True, null=True)
    delivery_address = models.JSONField(blank=True, null=True)
    service_type = models.CharField(max_length=50, blank=True, null=True)
    package_type = models.CharField(max_length=50, blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    dimensions = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    pickup_date = models.DateField(blank=True, null=True)
    pickup_time_window = models.CharField(max_length=50, blank=True, null=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=50, default='in-transit')
    updates = models.JSONField(default=list)
    phone = models.CharField(max_length=15, blank=True, null=True)  # Add phone field to Booking model
    delivery_email = models.CharField(max_length=255, blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')

    def save(self, *args, **kwargs):
        logger = logging.getLogger(__name__)

        if not self.lr_no:
            # Generate auto-incremental LR number based on the last record
            last_booking = Booking.objects.order_by('-id').first()
            last_lr_no = int(last_booking.lr_no) if last_booking and last_booking.lr_no else 0
            self.lr_no = str(last_lr_no + 1)  # Store only the numeric part

        # Input weight into actual_weight
        self.actual_weight = self.weight

        logger.info(f"Booking saved with LR No: {self.lr_no}, From: {self.from_location}, To: {self.to_location}")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"LR No. {self.lr_no} - {self.from_location} to {self.to_location}"


class CustomUser(AbstractUser):
    USER_TYPES = (
        ('admin', 'Admin'),
        ('agent', 'Agent'),
        ('client', 'Client'),
    )
    user_type = models.CharField(max_length=50, choices=USER_TYPES, default='agent')  # Default is customer
