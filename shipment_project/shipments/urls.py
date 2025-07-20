from django.urls import path, include
from rest_framework.routers import DefaultRouter
from shipments.views import ShipmentViewSet, register_user, create_booking, track_shipment, api_login, export_shipments, export_customer_shipments_csv, export_all_customer_shipments_csv, update_shipment_status, CustomerShipmentsListView, user_bookings, contact_us_api

router = DefaultRouter()
router.register(r'shipments', ShipmentViewSet)

urlpatterns = [
    # Function-based endpoints FIRST!
    path('api/register', register_user, name='register_user'),
    path('api/bookings/', create_booking, name='create_booking'),
    path('api/track_shipment/', track_shipment, name='track_shipment'),
    path('api/login', api_login, name='api_login'),
    path('api/customer-shipments/', CustomerShipmentsListView.as_view(), name='customer_shipments'),
    path('api/export-shipments/', export_shipments, name='export_shipments'),
    path('api/export-customer-shipments-csv/', export_customer_shipments_csv, name='export_customer_shipments_csv'),
    path('api/export-all-customer-shipments-csv/', export_all_customer_shipments_csv, name='export_all_customer_shipments_csv'),
    path('api/update-shipment-status/', update_shipment_status, name='update_shipment_status'),
    path('api/user-bookings/', user_bookings, name='user_bookings'),
    path('api/contact/', contact_us_api, name='contact_us_api'),
    # Router LAST
    path('api/', include(router.urls)),
]