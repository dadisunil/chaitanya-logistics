from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.urls import reverse
from .models import Shipment, Booking
from .forms import AgentRegistrationForm
from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import datetime
from django.db.models import Q, Max
from django.db import transaction, IntegrityError
import uuid
import openpyxl
import csv
from .serializers import ShipmentSerializer, BookingSerializer
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.models import User, Group
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.encoding import smart_str
from django.views.decorators.http import require_POST
from rest_framework.generics import ListAPIView
from rest_framework import filters
from .models import Booking
from .serializers import BookingSerializer
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings

class ShipmentViewSet(ModelViewSet):
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer

# Home page view
def home(request):
    return render(request, 'shipment/home.html')

# Agent login view
def agent_login(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)
                if user.groups.filter(name="Agent").exists():
                    return redirect('agent_home')
                else:
                    messages.error(request, "You are not authorized to access this page.")
            else:
                messages.error(request, "Your account is inactive.")
        else:
            messages.error(request, "Invalid username or password.")
        return redirect('agent_login')            
    return render(request, 'shipment/home.html')

# Agent home view
@login_required
def agent_home(request):
    if request.user.groups.filter(name='Agent').exists():
        return render(request, 'shipment/agent_home.html')
    else:
        messages.error(request, "Access denied: Unauthorized user.")
        return redirect('home')

# Agent registration view
def agent_register(request):
    if request.method == 'POST':
        form = AgentRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Agent account created successfully.')
            return redirect('agent_login')
    else:
        form = AgentRegistrationForm()
    return render(request, 'shipment/agent_register.html', {'form': form})

# Export bookings to Excel
@login_required
def export_bookings(request):
    if not request.user.groups.filter(name='Agent').exists():
        messages.error(request, "Access denied: Unauthorized user.")
        return redirect('home')

    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    download = request.GET.get('download')
    download_complete = request.GET.get('download_complete')

    try:
        if start_date:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        if end_date:
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        messages.error(request, "Invalid date format. Use 'YYYY-MM-DD'.")
        return redirect('agent_home')

    bookings = Booking.objects.all()
    if start_date and end_date:
        bookings = bookings.filter(booking_date__range=[start_date, end_date])

    if download:
        return download_bookings(bookings, "filtered_bookings.xlsx")
    elif download_complete:
        return download_bookings(Booking.objects.all(), "complete_bookings.xlsx")

    return render(request, 'shipment/export_bookings.html', {'bookings': bookings})

def download_bookings(bookings, filename):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Bookings"

    headers = [
        "LR No", "Booking Date", "From Location", "To Location", 
        "Branch From Phone", "Branch To Phone", "Actual Weight", 
        "Chargeable Weight", "Freight", "Remarks"
    ]
    ws.append(headers)

    for booking in bookings:
        ws.append([
            booking.lr_no,
            booking.booking_date,
            booking.from_location,
            booking.to_location,
            booking.branch_from_phone,
            booking.branch_to_phone,
            booking.actual_weight,
            booking.chargeable_weight,
            booking.freight,
            booking.remarks,
        ])

    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    wb.save(response)
    return response

# Export bookings to CSV
@login_required
def export_bookings_csv(request):
    if not request.user.groups.filter(name='Agent').exists():
        messages.error(request, "Access denied: Unauthorized user.")
        return redirect('home')

    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    try:
        if start_date:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        if end_date:
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        messages.error(request, "Invalid date format. Use 'YYYY-MM-DD'.")
        return redirect('agent_home')

    bookings = Booking.objects.all()
    if start_date and end_date:
        bookings = bookings.filter(booking_date__range=[start_date, end_date])

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="bookings.csv"'

    writer = csv.writer(response)
    writer.writerow([
        "LR No", "Booking Date", "From Location", "To Location",
        "Branch From Phone", "Branch To Phone", "Actual Weight",
        "Charged Weight", "Freight Amount", "Delivery Amount",
        "Total Amount", "Status"
    ])

    for booking in bookings:
        writer.writerow([
            booking.lr_no, booking.booking_date, booking.from_location,
            booking.to_location, booking.branch_from_phone,
            booking.branch_to_phone, booking.actual_weight,
            booking.charged_weight, booking.freight_amount,
            booking.delivery_amount, booking.total_amount,
            booking.status
        ])

    return response

@csrf_exempt
def track_shipment(request):
    if request.method == 'POST':
        try:
            # Parse JSON body to extract lr_no
            body = json.loads(request.body)
            lr_no = body.get('lr_no')
            print("Received LR No:", lr_no)  # Debug log for received LR No

            if not lr_no:
                return JsonResponse({"success": False, "message": "Tracking number is required."}, status=400)

            booking = Booking.objects.filter(lr_no__iexact=lr_no).first()
            if booking:
                print("Booking Found:", booking)  # Debug log for booking details
                data = {
                    "success": True,
                    "trackingNumber": booking.lr_no,
                    "status": "in-transit",  # Placeholder status
                    "estimatedDelivery": booking.dod.strftime('%Y-%m-%d') if booking.dod else None,
                    "origin": booking.from_location,
                    "destination": booking.to_location,
                    "service": "Standard Delivery",  # Placeholder service type
                    "weight": f"{booking.actual_weight} kg" if booking.actual_weight else "Unknown",
                    "updates": [
                        {
                            "status": "Order Placed",
                            "location": booking.from_location,
                            "timestamp": booking.booking_date.strftime('%Y-%m-%dT%H:%M:%S') if booking.booking_date else None,
                            "description": "Order has been placed and confirmed."
                        },
                        {
                            "status": "In Transit",
                            "location": booking.from_location,
                            "timestamp": booking.booking_date.strftime('%Y-%m-%dT%H:%M:%S') if booking.booking_date else None,
                            "description": "Package is in transit to the next facility."
                        }
                    ]
                }
            else:
                print("No booking found for LR No:", lr_no)  # Debug log for missing booking
                data = {"success": False, "message": "No shipment found with this tracking number. Please check and try again."}
            return JsonResponse(data)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON format."}, status=400)
    return JsonResponse({'success': False, 'message': 'Shipment not found.'})

# Customer shipments view
class BookingPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CustomerShipmentsListView(ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    pagination_class = BookingPagination
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['booking_date', 'status', 'lr_no']
    search_fields = ['lr_no', 'from_location', 'to_location', 'status']
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(booking_date__gte=start_date, booking_date__lte=end_date)
        return queryset

# Other views
def book_shipment(request):
    return redirect('home')

def store_locator(request):
    return redirect('home')

def company(request):
    return render(request, 'shipment/company.html')

def services(request):
    return render(request, 'shipment/services.html')

def grow_with_us(request):
    return render(request, 'shipment/grow_with_us.html')

def careers(request):
    return render(request, 'shipment/careers.html')

def contact_us(request):
    return render(request, 'shipment/contact_us.html')

def booking_page(request):
    return render(request, 'shipment/booking.html')

def submit_booking(request):
    if request.method == "POST":
        try:
            with transaction.atomic():
                booking_date = request.POST.get('booking_date')
                from_location = request.POST.get('from_location')
                to_location = request.POST.get('to_location')
                branch_from_phone = request.POST.get('branch_from_phone')
                branch_to_phone = request.POST.get('branch_to_phone')
                actual_weight = Decimal(request.POST.get('actual_weight', 0))
                chargeable_weight = Decimal(request.POST.get('chargeable_weight', 0))
                freight = Decimal(request.POST.get('freight', 0))
                remarks = request.POST.get('remarks', '')

                # Generate a unique LR number using UUID
                lr_no = f"LR-{uuid.uuid4().hex[:8].upper()}"

                booking = Booking.objects.create(
                    lr_no=lr_no,  # Assign the generated LR number
                    booking_date=booking_date,
                    from_location=from_location,
                    to_location=to_location,
                    branch_from_phone=branch_from_phone,
                    branch_to_phone=branch_to_phone,
                    actual_weight=actual_weight,
                    chargeable_weight=chargeable_weight,
                    freight=freight,
                    remarks=remarks
                )

                # Save the booking with the generated LR number
                booking.save()

            # Prepare receipt data
            receipt_data = {
                "lr_no": lr_no,
                "booking_date": booking_date,
                "from_location": from_location,
                "to_location": to_location,
                "branch_from_phone": branch_from_phone,
                "branch_to_phone": branch_to_phone,
                "actual_weight": actual_weight,
                "chargeable_weight": chargeable_weight,
                "freight": freight,
                "remarks": remarks,
            }

            # Render receipt template
            return render(request, 'shipment/receipt.html', {"receipt_data": receipt_data})

        except IntegrityError:
            return HttpResponse("Error: Duplicate LR No. Please try again.", status=400)

    return redirect('booking_page')

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        import json
        data = json.loads(request.body)
        username = data.get('name')
        password = data.get('password')
        email = data.get('email')
        User = get_user_model()
        user = User.objects.create_user(username=username, password=password, email=email)
        user.user_type = 'client'
        user.save()
        customer_group, created = Group.objects.get_or_create(name='customer')
        user.groups.add(customer_group)
        return JsonResponse({'message': 'User registered successfully'})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_booking(request):
    serializer = BookingSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    try:
        # Save the booking and set the user if authenticated
        booking = serializer.save(user=request.user if request.user.is_authenticated else None)
        return Response({
            "message": "Booking created successfully",
            "booking_id": booking.id,
            "lr_no": booking.lr_no
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            email = body.get('email')
            password = body.get('password')
            if not email or not password:
                return JsonResponse({"success": False, "message": "Email and password are required."}, status=400)
            User = get_user_model()
            user_obj = User.objects.filter(email=email).first()
            if user_obj:
                user = authenticate(request, username=user_obj.username, password=password)
            else:
                user = None
            if user is not None:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    "success": True,
                    "message": "Login successful",
                    "user": {
                        "id": user.id,
                        "name": user.username,
                        "email": user.email,
                        "user_type": getattr(user, "user_type", None)
                    },
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                })
            else:
                return JsonResponse({"success": False, "message": "Invalid email or password."}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON format."}, status=400)
    if request.method == 'GET':
        return JsonResponse({"success": False, "message": "This endpoint is for login via POST requests."}, status=405)
    return JsonResponse({"success": False, "message": "Invalid request method."}, status=405)

@api_view(['GET'])
def export_shipments(request):
    shipments = Shipment.objects.all()
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    if start_date and end_date:
        try:
            start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()
            shipments = shipments.filter(booking_date__gte=start_date_obj, booking_date__lte=end_date_obj)
        except Exception as e:
            print(f"Date filter error: {e}")

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Shipments"
    headers = ["ID", "Origin", "Destination", "Status", "Created At", "Estimated Delivery"]
    ws.append(headers)
    for shipment in shipments:
        ws.append([
            shipment.id,
            shipment.from_location,
            shipment.to_location,
            shipment.status,
            shipment.booking_date.strftime('%Y-%m-%d') if shipment.booking_date else None,
            shipment.dod.strftime('%Y-%m-%d') if shipment.dod else None,
        ])
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename="shipments.xlsx"'
    wb.save(response)
    return response

@api_view(['GET'])
@permission_classes([AllowAny])
def export_customer_shipments_csv(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    shipments = Booking.objects.all()
    if start_date and end_date:
        try:
            start_date_obj = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()
            shipments = shipments.filter(booking_date__gte=start_date_obj, booking_date__lte=end_date_obj)
        except Exception as e:
            print(f"Date filter error: {e}")

    response = HttpResponse(content_type='text/csv; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="shipments.csv"'
    writer = csv.writer(response)
    writer.writerow([
        "LR No", "Booking Date", "From Location", "To Location",
        "Branch From Phone", "Branch To Phone", "Status", "Estimated Delivery", "Service"
    ])
    for shipment in shipments:
        writer.writerow([
            smart_str(shipment.lr_no),
            shipment.booking_date.strftime('%Y-%m-%d') if shipment.booking_date else "",
            smart_str(shipment.from_location),
            smart_str(shipment.to_location),
            smart_str(getattr(shipment, 'branch_from_phone', '')),
            smart_str(getattr(shipment, 'branch_to_phone', '')),
            smart_str(shipment.status),
            shipment.dod.strftime('%Y-%m-%d') if shipment.dod else "",
            smart_str(getattr(shipment, 'service_type', '')),
        ])
    return response

@api_view(['GET'])
def export_all_customer_shipments_csv(request):
    shipments = Booking.objects.all()
    response = HttpResponse(content_type='text/csv; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="all_shipments.csv"'
    writer = csv.writer(response)
    writer.writerow([
        "id", "lr_no", "booking_date", "from_location", "to_location", "branch_from_phone", "branch_to_phone", "actual_weight", "chargeable_weight", "freight", "dod", "sgst", "cgst", "remarks", "policy_no", "noofpkgs", "consignor", "consignee", "saidtocontain", "delivery_address", "pickup_address", "description", "dimensions", "package_type", "payment_method", "pickup_date", "pickup_time_window", "service_type", "weight", "status", "updates", "phone"
    ])
    for shipment in shipments:
        writer.writerow([
            shipment.id,
            shipment.lr_no,
            shipment.booking_date.strftime('%Y-%m-%d') if shipment.booking_date else "",
            shipment.from_location,
            shipment.to_location,
            getattr(shipment, 'branch_from_phone', ''),
            getattr(shipment, 'branch_to_phone', ''),
            getattr(shipment, 'actual_weight', ''),
            getattr(shipment, 'chargeable_weight', ''),
            getattr(shipment, 'freight', ''),
            shipment.dod.strftime('%Y-%m-%d') if getattr(shipment, 'dod', None) else "",
            getattr(shipment, 'sgst', ''),
            getattr(shipment, 'cgst', ''),
            getattr(shipment, 'remarks', ''),
            getattr(shipment, 'policy_no', ''),
            getattr(shipment, 'noofpkgs', ''),
            getattr(shipment, 'consignor', ''),
            getattr(shipment, 'consignee', ''),
            getattr(shipment, 'saidtocontain', ''),
            getattr(shipment, 'delivery_address', ''),
            getattr(shipment, 'pickup_address', ''),
            getattr(shipment, 'description', ''),
            getattr(shipment, 'dimensions', ''),
            getattr(shipment, 'package_type', ''),
            getattr(shipment, 'payment_method', ''),
            shipment.pickup_date.strftime('%Y-%m-%d') if getattr(shipment, 'pickup_date', None) else "",
            getattr(shipment, 'pickup_time_window', ''),
            getattr(shipment, 'service_type', ''),
            getattr(shipment, 'weight', ''),
            getattr(shipment, 'status', ''),
            getattr(shipment, 'updates', ''),
            getattr(shipment, 'phone', ''),
        ])
    return response

@csrf_exempt
def insert_booking_from_block(request):
    if request.method == 'POST':
        block_text = request.POST.get('block_text', '')
        lines = [line.strip() for line in block_text.strip().split('\n') if line.strip()]
        field_names = [
            'lr_no', 'booking_date', 'from_location', 'to_location', 'branch_from_phone',
            'branch_to_phone', 'actual_weight', 'chargeable_weight', 'freight', 'dod',
            'sgst', 'cgst', 'remarks', 'policy_no', 'noofpkgs', 'consignor', 'consignee',
            'saidtocontain', 'delivery_address', 'pickup_address', 'description', 'dimensions',
            'package_type', 'payment_method', 'pickup_date', 'pickup_time_window', 'service_type',
            'weight', 'status', 'updates', 'phone'
        ]
        if len(lines) != len(field_names):
            return JsonResponse({'error': 'Block text does not match required number of fields.'}, status=400)
        data = dict(zip(field_names, lines))
        # Optionally parse/convert fields as needed (dates, decimals, etc.)
        try:
            booking = Booking.objects.create(**data)
            return JsonResponse({'success': True, 'booking_id': booking.id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def update_shipment_status(request):
    try:
        lr_no = request.data.get('lr_no')
        new_status = request.data.get('status')
        if not lr_no or not new_status:
            return JsonResponse({'error': 'LR No and status are required.'}, status=400)
        booking = Booking.objects.filter(lr_no=lr_no).first()
        if not booking:
            return JsonResponse({'error': 'Booking not found.'}, status=404)
        booking.status = new_status
        booking.save()
        return JsonResponse({'success': True, 'lr_no': lr_no, 'status': new_status})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bookings(request):
    bookings = Booking.objects.filter(user=request.user).order_by('-booking_date')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def contact_us_api(request):
    name = request.data.get('name')
    email = request.data.get('email')
    phone = request.data.get('phone')
    subject = request.data.get('subject')
    message = request.data.get('message')
    if not (name and email and subject and message):
        return Response({'error': 'Please fill all required fields.'}, status=400)
    # Compose email to admin
    email_subject = f"Contact Query: {subject}"
    email_message = f"Name: {name}\nEmail: {email}\nPhone: {phone}\nMessage:\n{message}"
    send_mail(
        email_subject,
        email_message,
        settings.DEFAULT_FROM_EMAIL,
        ["info@chaitanyalogistics.com"],
        fail_silently=False,
    )
    # Send acknowledgment to user
    ack_subject = "Thank you for contacting Chaitanya Logistics"
    ack_message = f"Dear {name},\n\nThank you for reaching out to Chaitanya Logistics. We have received your message and our team will get back to you soon.\n\nYour Query:\n{message}\n\nBest regards,\nChaitanya Logistics Team"
    send_mail(
        ack_subject,
        ack_message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )
    return Response({'success': True, 'message': 'Query sent successfully.'})