import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Truck, Ship, Plane, Package, CreditCard, MapPin, Info, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Sample service data
const SERVICES = [
  {
    id: 'road',
    name: 'Road Freight',
    icon: <Truck className="h-6 w-6" />,
    description: 'Reliable road transportation with nationwide coverage.',
    estimatedTime: '3-5 days',
    priceRange: '₹5-15 per kg',
  },
  {
    id: 'air',
    name: 'Air Freight',
    icon: <Plane className="h-6 w-6" />,
    description: 'Fast air freight services for time-sensitive shipments.',
    estimatedTime: '1-2 days',
    priceRange: '₹15-30 per kg',
  },
  {
    id: 'ocean',
    name: 'Ocean Freight',
    icon: <Ship className="h-6 w-6" />,
    description: 'Cost-effective ocean shipping for larger cargo.',
    estimatedTime: '15-30 days',
    priceRange: '₹3-8 per kg',
  },
  {
    id: 'express',
    name: 'Express Delivery',
    icon: <Package className="h-6 w-6" />,
    description: 'Premium express delivery for urgent shipments.',
    estimatedTime: 'Next day',
    priceRange: '₹25-40 per kg',
  },
];

const BookingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [continueAsGuest, setContinueAsGuest] = useState(false); // New state for guest booking
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading indicator

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Service Selection
    serviceType: '',
    
    // Step 2: Shipment Details
    packageType: 'box',
    weight: '5',
    length: '20',
    width: '20',
    height: '20',
    description: '',
    
    // Step 3: Addresses
    pickupName: '',
    pickupAddress: '',
    pickupCity: '',
    pickupZip: '',
    pickupCountry: '',
    pickupPhone: '',
    pickupEmail: '',
    pickupParticular: '', // NEW FIELD
    
    deliveryName: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryZip: '',
    deliveryCountry: '',
    deliveryPhone: '',
    deliveryEmail: '',
    deliveryParticular: '', // NEW FIELD
    
    // Step 4: Schedule
    pickupDate: '',
    pickupTimeWindow: '',
    
    // Step 5: Payment
    paymentMethod: 'credit',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    freight: '', // Added freight property

    // Additional properties
    fromLocation: '',
    toLocation: '',
    branchFromPhone: '',
    branchToPhone: '',
    actualWeight: '',
    chargeableWeight: '',
    remarks: '',
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    setFormData({
      ...formData,
      serviceType: serviceId,
    });
    nextStep(); // Automatically proceed to the next step after selecting a service
  };

  // Go to next step
  const nextStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(currentStep + 1);
  };

  // Go to previous step
  const prevStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(currentStep - 1);
  };

  const API_BASE_URL = (import.meta as any).env.VITE_API_URL;

  // Update the handleSubmitWithAPI function to display the new booking reference
  const handleSubmitWithAPI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Show loading indicator

    // Validate phone fields before submission
    if (!formData.pickupPhone || !formData.deliveryPhone) {
      alert('Phone numbers for both pickup and delivery are required.');
      setIsSubmitting(false);
      return;
    }

    // Map formData to match the API model
    const payload = {
      service_type: formData.serviceType,
      package_type: formData.packageType,
      weight: parseFloat(formData.weight),
      dimensions: `${formData.length}x${formData.width}x${formData.height}`,
      description: formData.description,
      pickup_address: {
        name: formData.pickupName,
        address: formData.pickupAddress,
        city: formData.pickupCity,
        zip: formData.pickupZip,
        country: formData.pickupCountry,
        phone: formData.pickupPhone,
        email: formData.pickupEmail,
        particular: formData.pickupParticular // NEW FIELD
      },
      delivery_address: {
        name: formData.deliveryName,
        address: formData.deliveryAddress,
        city: formData.deliveryCity,
        zip: formData.deliveryZip,
        country: formData.deliveryCountry,
        phone: formData.deliveryPhone,
        email: formData.deliveryEmail,
        particular: formData.deliveryParticular // NEW FIELD
      },
      pickup_date: formData.pickupDate,
      pickup_time_window: formData.pickupTimeWindow,
      payment_method: formData.paymentMethod, // Will be 'credit' or 'cash_on_delivery'
      status: formData.paymentMethod === 'cash_on_delivery' ? 'Pending' : undefined, // Set status to Pending for CashOnDelivery
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bookings/`, payload);
      setBookingSuccess(true);
      setBookingReference(response.data.lr_no); // Display the new booking reference
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('There was an error submitting your booking. Please try again.');
    } finally {
      setIsSubmitting(false); // Hide loading indicator
    }
  };

  // Add email validation logic
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === '' || emailRegex.test(email);
  };

  // Steps validation
  const isStep1Valid = !!formData.serviceType;
  
  const isStep2Valid = 
    !!formData.packageType && 
    !!formData.weight && 
    !!formData.length && 
    !!formData.width && 
    !!formData.height;
  
  // Update isStep3Valid to include phone validation
  const isStep3Valid = 
    !!formData.pickupName && 
    !!formData.pickupAddress && 
    !!formData.pickupCity && 
    !!formData.pickupZip && 
    !!formData.pickupCountry && 
    !!formData.pickupPhone && 
    isValidEmail(formData.pickupEmail) && 
    !!formData.deliveryName && 
    !!formData.deliveryAddress && 
    !!formData.deliveryCity && 
    !!formData.deliveryZip && 
    !!formData.deliveryCountry && 
    !!formData.deliveryPhone && 
    isValidEmail(formData.deliveryEmail);
  
  const isStep4Valid = !!formData.pickupDate && !!formData.pickupTimeWindow;
  
  const isStep5Valid = formData.paymentMethod === 'credit' ? 
    (!!formData.cardNumber && !!formData.cardName && !!formData.cardExpiry && !!formData.cardCvv) : 
    true;

  // Render different form steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderServiceSelection();
      case 2:
        return renderShipmentDetails();
      case 3:
        return renderAddresses();
      case 4:
        return renderSchedule();
      case 5:
        return renderPayment();
      default:
        return renderServiceSelection();
    }
  };

  // Step 1: Service Selection
  const renderServiceSelection = () => {
    return (
      <div className="animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-6">Select Shipping Service</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className={
                `border rounded-lg p-6 cursor-pointer transition-all ${
                  formData.serviceType === service.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-200'
                }`
              }
              onClick={() => handleServiceSelect(service.id)}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary-100 rounded-full mr-3">
                  {React.cloneElement(service.icon, { className: 'text-primary-600 h-6 w-6' })}
                </div>
                <h3 className="text-xl font-medium">{service.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">Est. Time:</span> {service.estimatedTime}
                </div>
                <div>
                  <span className="font-medium">Price Range:</span> {service.priceRange}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStep1Valid}
            className="btn btn-primary disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // Step 2: Shipment Details
  const renderShipmentDetails = () => {
    return (
      <div className="animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-6">Package Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="packageType" className="block text-sm font-medium text-gray-700 mb-1">
              Package Type *
            </label>
            <select
              id="packageType"
              name="packageType"
              value={formData.packageType}
              onChange={handleInputChange}
              className="input w-full"
              required
            >
              <option value="box">Box</option>
              <option value="envelope">Envelope</option>
              <option value="pallet">Pallet</option>
              <option value="tube">Tube</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg) *
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              min="0.1"
              step="0.1"
              value={formData.weight}
              onChange={handleInputChange}
              className="input w-full"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
              Length (cm) *
            </label>
            <input
              type="number"
              id="length"
              name="length"
              min="1"
              value={formData.length}
              onChange={handleInputChange}
              className="input w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
              Width (cm) *
            </label>
            <input
              type="number"
              id="width"
              name="width"
              min="1"
              value={formData.width}
              onChange={handleInputChange}
              className="input w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm) *
            </label>
            <input
              type="number"
              id="height"
              name="height"
              min="1"
              value={formData.height}
              onChange={handleInputChange}
              className="input w-full"
              required
            />
          </div>
        </div>
        
        <div className="mb-8">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Package Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the contents of your package"
            className="input w-full"
          ></textarea>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="btn btn-outline"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStep2Valid}
            className="btn btn-primary disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // Step 3: Addresses
  const renderAddresses = () => {
    return (
      <div className="animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-6">Pickup & Delivery Addresses</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pickup Address */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary-600" />
              Pickup Address
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="pickupName" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  id="pickupName"
                  name="pickupName"
                  value={formData.pickupName}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="pickupAddress"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickupCity" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="pickupCity"
                    name="pickupCity"
                    value={formData.pickupCity}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="pickupZip" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="pickupZip"
                    name="pickupZip"
                    value={formData.pickupZip}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="pickupCountry" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  id="pickupCountry"
                  name="pickupCountry"
                  value={formData.pickupCountry}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="pickupPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="pickupPhone"
                  name="pickupPhone"
                  value={formData.pickupPhone}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
                {!formData.pickupPhone && (
                  <p className="text-sm text-red-500">Phone number is required.</p>
                )}
              </div>
              
              <div>
                <label htmlFor="pickupEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="pickupEmail"
                  name="pickupEmail"
                  value={formData.pickupEmail}
                  onChange={handleInputChange}
                  className="input w-full"
                />
                {!isValidEmail(formData.pickupEmail) && (
                  <p className="text-sm text-red-500">Enter a valid email address.</p>
                )}
              </div>

              <div>
                <label htmlFor="pickupParticular" className="block text-sm font-medium text-gray-700 mb-1">
                  Particular (optional)
                </label>
                <input
                  type="text"
                  id="pickupParticular"
                  name="pickupParticular"
                  value={formData.pickupParticular}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Enter any particular detail for pickup"
                />
              </div>
            </div>
          </div>
          
          {/* Delivery Address */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary-600" />
              Delivery Address
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="deliveryName" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  id="deliveryName"
                  name="deliveryName"
                  value={formData.deliveryName}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="deliveryCity" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="deliveryCity"
                    name="deliveryCity"
                    value={formData.deliveryCity}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="deliveryZip" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="deliveryZip"
                    name="deliveryZip"
                    value={formData.deliveryZip}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="deliveryCountry" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  id="deliveryCountry"
                  name="deliveryCountry"
                  value={formData.deliveryCountry}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="deliveryPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="deliveryPhone"
                  name="deliveryPhone"
                  value={formData.deliveryPhone}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
                {!formData.deliveryPhone && (
                  <p className="text-sm text-red-500">Phone number is required.</p>
                )}
              </div>
              
              <div>
                <label htmlFor="deliveryEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="deliveryEmail"
                  name="deliveryEmail"
                  value={formData.deliveryEmail}
                  onChange={handleInputChange}
                  className="input w-full"
                />
                {!isValidEmail(formData.deliveryEmail) && (
                  <p className="text-sm text-red-500">Enter a valid email address.</p>
                )}
              </div>

              <div>
                <label htmlFor="deliveryParticular" className="block text-sm font-medium text-gray-700 mb-1">
                  Particular (optional)
                </label>
                <input
                  type="text"
                  id="deliveryParticular"
                  name="deliveryParticular"
                  value={formData.deliveryParticular}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Enter any particular detail for delivery"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="btn btn-outline"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStep3Valid}
            className="btn btn-primary disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // Step 4: Schedule
  const renderSchedule = () => {
    // Calculate minimum date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    return (
      <div className="animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-6">Pickup Schedule</h2>
        
        <div className="max-w-xl mx-auto bg-white p-6 border border-gray-200 rounded-lg mb-8">
          <div className="flex items-start mb-6">
            <Calendar className="h-6 w-6 text-primary-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-medium mb-2">Select Pickup Date & Time</h3>
              <p className="text-gray-600 text-sm">
                Choose when you'd like us to collect your package. We'll notify you on the day of pickup with a more specific time.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Date *
              </label>
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                min={minDate}
                value={formData.pickupDate}
                onChange={handleInputChange}
                className="input w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="pickupTimeWindow" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time Window *
              </label>
              <select
                id="pickupTimeWindow"
                name="pickupTimeWindow"
                value={formData.pickupTimeWindow}
                onChange={handleInputChange}
                className="input w-full"
                required
              >
                <option value="">Select a time window</option>
                <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                <option value="afternoon">Afternoon (12:00 PM - 3:00 PM)</option>
                <option value="evening">Evening (3:00 PM - 6:00 PM)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ensure someone will be available at the pickup address during the selected time window.</li>
                  <li>Have your package ready and properly packaged before the pickup time.</li>
                  <li>Our driver will call the provided contact number before arrival.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="btn btn-outline"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStep4Valid}
            className="btn btn-primary disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // Step 5: Payment
  const renderPayment = () => {
    // Calculate estimated cost based on weight and service
    const getServiceRate = (serviceId: string) => {
      switch (serviceId) {
        case 'road':
          return 7.99;
        case 'air':
          return 19.99;
        case 'ocean':
          return 5.99;
        case 'express':
          return 29.99;
        default:
          return 9.99;
      }
    };
    
    const weight = parseFloat(formData.weight);
    const baseRate = getServiceRate(formData.serviceType);
    const weightCost = weight * baseRate;
    const serviceFee = 4.99;
    const totalCost = weightCost + serviceFee;
    
    return (
      <div className="animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-6">Payment & Confirmation</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Payment Details */}
          <div>
            <div className="bg-white p-6 border border-gray-200 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
                Payment Method
              </h3>
              
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      checked={formData.paymentMethod === 'credit'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Credit Card
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Cash On Delivery
                  </label>
                </div>
                
                {formData.paymentMethod === 'credit' && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="input w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="input w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          id="cardCvv"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="input w-full"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {formData.paymentMethod === 'cash_on_delivery' && (
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-blue-700">
                      You will pay for your shipment in cash at the time of delivery. Your booking will be marked as <b>Pending</b> until payment is received.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="font-medium">Service:</span>
                  <span>
                    {SERVICES.find(s => s.id === formData.serviceType)?.name || 'Standard Shipping'}
                  </span>
                </div>
                
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="font-medium">Package Weight:</span>
                  <span>{weight} kg</span>
                </div>
                
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="font-medium">Pickup Date:</span>
                  <span>{formData.pickupDate || 'Not selected'}</span>
                </div>
                
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="font-medium">Weight Cost:</span>
                  <span>₹{weightCost.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="font-medium">Service Fee:</span>
                  <span>₹{serviceFee.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>₹{totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="btn btn-outline"
          >
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmitWithAPI}
            disabled={!isStep5Valid || isSubmitting}
            className="btn btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Complete Booking'}
          </button>
        </div>
      </div>
    );
  };

  // Update the handlePrintReceipt function to include dynamic receipt data
  const handlePrintReceipt = () => {
    const receiptData = {
      lr_no: bookingReference,
      booking_date: new Date().toLocaleDateString(),
      from_location: formData.fromLocation || 'N/A',
      to_location: formData.toLocation || 'N/A',
      branch_from_phone: formData.branchFromPhone || 'N/A',
      branch_to_phone: formData.branchToPhone || 'N/A',
      actual_weight: formData.actualWeight || 'N/A',
      chargeable_weight: formData.chargeableWeight || 'N/A',
      freight: formData.freight || 'N/A',
      remarks: formData.remarks || 'N/A',
    };

    const printContent = `
      <div>
        <h1>Booking Receipt</h1>
        <p><strong>LR No:</strong> ${receiptData.lr_no}</p>
        <p><strong>Booking Date:</strong> ${receiptData.booking_date}</p>
        <p><strong>From Location:</strong> ${receiptData.from_location}</p>
        <p><strong>To Location:</strong> ${receiptData.to_location}</p>
        <p><strong>Branch From Phone:</strong> ${receiptData.branch_from_phone}</p>
        <p><strong>Branch To Phone:</strong> ${receiptData.branch_to_phone}</p>
        <p><strong>Actual Weight:</strong> ${receiptData.actual_weight}</p>
        <p><strong>Chargeable Weight:</strong> ${receiptData.chargeable_weight}</p>
        <p><strong>Freight:</strong> ${receiptData.freight}</p>
        <p><strong>Remarks:</strong> ${receiptData.remarks}</p>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Booking Receipt</title></head><body>');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Update the renderSuccess function to include a print button
  const renderSuccess = () => {
    return (
      <div className="animate-fadeIn text-center max-w-2xl mx-auto py-10">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-xl text-gray-600 mb-8">
            Your shipment has been successfully booked.
          </p>
        </div>

        <div id="receipt-content" className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <div className="mb-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Booking Reference:</span>
              <span className="font-bold text-lg">{bookingReference}</span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Service Type:</span>
              <span className="font-medium">
                {SERVICES.find(s => s.id === formData.serviceType)?.name || 'Standard Shipping'}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Pickup Date:</span>
              <span className="font-medium">{formData.pickupDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pickup Time Window:</span>
              <span className="font-medium">
                {formData.pickupTimeWindow === 'morning' 
                  ? 'Morning (9:00 AM - 12:00 PM)' 
                  : formData.pickupTimeWindow === 'afternoon'
                  ? 'Afternoon (12:00 PM - 3:00 PM)'
                  : 'Evening (3:00 PM - 6:00 PM)'}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <p className="text-gray-600 mb-4">
              A confirmation email has been sent to <span className="font-medium">{formData.pickupEmail}</span>.
            </p>
            <p className="text-gray-600">
              You can use your booking reference to track your shipment once it's been picked up.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handlePrintReceipt} className="btn btn-primary">
            Print Receipt
          </button>
          <Link to="/tracking" className="btn btn-primary">
            Track Your Shipment
          </Link>
          <Link to="/" className="btn btn-outline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  };

  // Update ProgressBar to allow navigation between steps
  const ProgressBar = () => {
    const steps = [
      { number: 1, name: 'Service' },
      { number: 2, name: 'Package' },
      { number: 3, name: 'Addresses' },
      { number: 4, name: 'Schedule' },
      { number: 5, name: 'Payment' },
    ];

    const handleStepClick = (stepNumber: number) => {
      if (stepNumber <= currentStep) {
        setCurrentStep(stepNumber);
      }
    };

    return (
      <div className="mb-10 hidden md:block">
        <div className="relative flex items-center justify-between">
          {/* Progress Line */}
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          {/* Steps */}
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center cursor-pointer"
              onClick={() => handleStepClick(step.number)}
            >
              <div
                className={
                  `w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= step.number
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-500'
                  }`
                }
              >
                {step.number}
              </div>
              <span
                className={
                  `mt-2 text-sm font-medium ${
                    currentStep >= step.number ? 'text-gray-800' : 'text-gray-500'
                  }`
                }
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Check if user needs to log in or continue as guest
  const renderLoginPrompt = () => {
    return (
      <div className="text-center max-w-lg mx-auto py-10">
        <h2 className="text-2xl font-semibold mb-4">Please Log In to Continue</h2>
        <p className="text-gray-600 mb-8">
          You need to be logged in to book a shipment. Please log in, create an account, or continue as a guest to proceed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login" className="btn btn-primary">
            Log In
          </Link>
          <Link to="/register" className="btn btn-outline">
            Create Account
          </Link>
          <button
            onClick={() => setContinueAsGuest(true)}
            className="btn btn-secondary"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-950 text-white py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Book a Shipment</h1>
            <p className="text-lg text-gray-300 mb-8">
              Schedule a pickup and delivery for your package with our easy online booking system.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          {isAuthenticated || continueAsGuest ? (
            <div>
              {bookingSuccess ? (
                renderSuccess()
              ) : (
                <div className="bg-white rounded-lg shadow-custom p-6">
                  <ProgressBar />
                  <form onSubmit={handleSubmitWithAPI}>
                    {renderStep()}
                  </form>
                </div>
              )}
            </div>
          ) : (
            renderLoginPrompt()
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">How Booking Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our booking process is simple and straightforward. Here's what to expect when booking a shipment with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <span className="text-primary-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Book Online</h3>
              <p className="text-gray-600">
                Complete our simple online booking form with your shipment details, addresses, and schedule.
              </p>
            </div>
            
            <div className="card">
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <span className="text-primary-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Prepare Your Package</h3>
              <p className="text-gray-600">
                Package your items securely and make them ready for pickup at the scheduled time.
              </p>
            </div>
            
            <div className="card">
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <span className="text-primary-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Track & Deliver</h3>
              <p className="text-gray-600">
                We'll pick up your package and deliver it to the destination. Track the progress in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;