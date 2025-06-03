import React, { useState } from 'react';
import { Calculator, Package, Truck, Ship, Plane, Info } from 'lucide-react';

// Sample rate data (in a real app, these would come from an API)
const RATE_DATA = {
  road: {
    baseRate: 5.99,
    perKm: 0.25,
    weightMultiplier: 0.1,
  },
  air: {
    baseRate: 15.99,
    perKm: 0.75,
    weightMultiplier: 0.3,
  },
  ocean: {
    baseRate: 8.99,
    perKm: 0.15,
    weightMultiplier: 0.2,
  },
  express: {
    baseRate: 19.99,
    perKm: 0.5,
    weightMultiplier: 0.25,
  },
};

const cities = [
  { name: 'New York', country: 'United States' },
  { name: 'Los Angeles', country: 'United States' },
  { name: 'Chicago', country: 'United States' },
  { name: 'Houston', country: 'United States' },
  { name: 'Phoenix', country: 'United States' },
  { name: 'Philadelphia', country: 'United States' },
  { name: 'San Antonio', country: 'United States' },
  { name: 'San Diego', country: 'United States' },
  { name: 'Dallas', country: 'United States' },
  { name: 'San Jose', country: 'United States' },
  { name: 'Toronto', country: 'Canada' },
  { name: 'Montreal', country: 'Canada' },
  { name: 'Vancouver', country: 'Canada' },
  { name: 'London', country: 'United Kingdom' },
  { name: 'Paris', country: 'France' },
  { name: 'Berlin', country: 'Germany' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Sydney', country: 'Australia' },
];

// Sample distance data between cities (in kilometers)
// In a real application, this would come from a distance API
const DISTANCE_DATA: Record<string, Record<string, number> | number> = {
  'New York': {
    'Los Angeles': 3940,
    'Chicago': 1270,
    'Houston': 2270,
    'London': 5570,
    'Toronto': 800,
  },
  'Los Angeles': {
    'New York': 3940,
    'Chicago': 2800,
    'San Francisco': 620,
    'Tokyo': 8800,
  },
  'default': 1000, // Default distance
};

const CalculatorPage: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState(5);
  const [length, setLength] = useState(20);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(20);
  const [shipmentType, setShipmentType] = useState('road');
  const [packageType, setPackageType] = useState('box');
  const [calculatedRates, setCalculatedRates] = useState<Record<string, number> | null>(null);
  const [showCalculation, setShowCalculation] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  // Calculate volumetric weight
  const volumetricWeight = (length * width * height) / 5000;
  const chargeableWeight = Math.max(weight, volumetricWeight);

  // Get distance between cities
  const getDistance = (from: string, to: string): number => {
    if (from === to) return 0;

    if (DISTANCE_DATA[from] && typeof DISTANCE_DATA[from] !== 'number' && DISTANCE_DATA[from][to]) {
      return DISTANCE_DATA[from][to];
    }

    if (DISTANCE_DATA[to] && typeof DISTANCE_DATA[to] !== 'number' && DISTANCE_DATA[to][from]) {
      return DISTANCE_DATA[to][from];
    }

    // Return the default distance
    return DISTANCE_DATA.default as number;
  };

  // Calculate shipping rates
  const calculateRates = () => {
    if (!origin || !destination) {
      return;
    }

    const dist = getDistance(origin, destination);
    setDistance(dist);

    const rates: Record<string, number> = {};

    Object.entries(RATE_DATA).forEach(([type, rateInfo]) => {
      const { baseRate, perKm, weightMultiplier } = rateInfo;
      const cost = baseRate + (dist * perKm) + (chargeableWeight * weightMultiplier);
      rates[type] = parseFloat(cost.toFixed(2));
    });

    setCalculatedRates(rates);
    setShowCalculation(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateRates();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  // Reset form
  const resetForm = () => {
    setOrigin('');
    setDestination('');
    setWeight(5);
    setLength(20);
    setWidth(20);
    setHeight(20);
    setShipmentType('road');
    setPackageType('box');
    setCalculatedRates(null);
    setShowCalculation(false);
    setDistance(null);
  };

  // Icon by shipment type
  const getShipmentIcon = (type: string) => {
    switch (type) {
      case 'road':
        return <Truck className="h-5 w-5" />;
      case 'air':
        return <Plane className="h-5 w-5" />;
      case 'ocean':
        return <Ship className="h-5 w-5" />;
      case 'express':
        return <Package className="h-5 w-5" />;
      default:
        return <Truck className="h-5 w-5" />;
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-950 text-white py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Shipping Rate Calculator</h1>
            <p className="text-lg text-gray-300 mb-8">
              Calculate shipping costs for your packages with our easy-to-use rate calculator.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-custom p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Calculator className="mr-2 h-6 w-6 text-primary-600" />
                  Calculate Shipping Cost
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Origin */}
                    <div>
                      <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                        Origin City
                      </label>
                      <select
                        id="origin"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="input w-full"
                        required
                      >
                        <option value="">Select Origin City</option>
                        {cities.map((city) => (
                          <option key={`origin-${city.name}`} value={city.name}>
                            {city.name}, {city.country}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Destination */}
                    <div>
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                        Destination City
                      </label>
                      <select
                        id="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="input w-full"
                        required
                      >
                        <option value="">Select Destination City</option>
                        {cities.map((city) => (
                          <option key={`dest-${city.name}`} value={city.name}>
                            {city.name}, {city.country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Package Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      {/* Package Type */}
                      <div>
                        <label htmlFor="packageType" className="block text-sm font-medium text-gray-700 mb-1">
                          Package Type
                        </label>
                        <select
                          id="packageType"
                          value={packageType}
                          onChange={(e) => setPackageType(e.target.value)}
                          className="input w-full"
                        >
                          <option value="box">Box</option>
                          <option value="envelope">Envelope</option>
                          <option value="pallet">Pallet</option>
                          <option value="tube">Tube</option>
                        </select>
                      </div>

                      {/* Weight */}
                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          id="weight"
                          value={weight}
                          min="0.1"
                          step="0.1"
                          onChange={(e) => setWeight(parseFloat(e.target.value))}
                          className="input w-full"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Dimensions */}
                      <div>
                        <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                          Length (cm)
                        </label>
                        <input
                          type="number"
                          id="length"
                          value={length}
                          min="1"
                          onChange={(e) => setLength(parseInt(e.target.value))}
                          className="input w-full"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                          Width (cm)
                        </label>
                        <input
                          type="number"
                          id="width"
                          value={width}
                          min="1"
                          onChange={(e) => setWidth(parseInt(e.target.value))}
                          className="input w-full"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          id="height"
                          value={height}
                          min="1"
                          onChange={(e) => setHeight(parseInt(e.target.value))}
                          className="input w-full"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-500 flex items-start">
                      <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>
                        Volumetric Weight: {volumetricWeight.toFixed(2)} kg
                        (Chargeable Weight: {chargeableWeight.toFixed(2)} kg)
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Shipment Type</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <label className={`
                        flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all
                        ${shipmentType === 'road' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'}
                      `}>
                        <input
                          type="radio"
                          name="shipmentType"
                          value="road"
                          checked={shipmentType === 'road'}
                          onChange={() => setShipmentType('road')}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <Truck className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                          <span className="font-medium">Road</span>
                        </div>
                      </label>

                      <label className={`
                        flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all
                        ${shipmentType === 'air' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'}
                      `}>
                        <input
                          type="radio"
                          name="shipmentType"
                          value="air"
                          checked={shipmentType === 'air'}
                          onChange={() => setShipmentType('air')}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <Plane className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                          <span className="font-medium">Air</span>
                        </div>
                      </label>

                      <label className={`
                        flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all
                        ${shipmentType === 'ocean' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'}
                      `}>
                        <input
                          type="radio"
                          name="shipmentType"
                          value="ocean"
                          checked={shipmentType === 'ocean'}
                          onChange={() => setShipmentType('ocean')}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <Ship className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                          <span className="font-medium">Ocean</span>
                        </div>
                      </label>

                      <label className={`
                        flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all
                        ${shipmentType === 'express' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'}
                      `}>
                        <input
                          type="radio"
                          name="shipmentType"
                          value="express"
                          checked={shipmentType === 'express'}
                          onChange={() => setShipmentType('express')}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <Package className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                          <span className="font-medium">Express</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button type="button" onClick={resetForm} className="btn btn-outline">
                      Reset
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Calculate Rate
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-custom p-6 h-full">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <span className="mr-2 text-primary-600 text-2xl">₹</span>
                  Shipping Rates
                </h2>

                {showCalculation && calculatedRates ? (
                  <div className="animate-fadeIn">
                    <div className="mb-6">
                      <div className="text-gray-600 mb-2">
                        <span className="font-medium">Distance:</span> {distance} km
                      </div>
                      <div className="text-gray-600 mb-2">
                        <span className="font-medium">From:</span> {origin}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">To:</span> {destination}
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      {Object.entries(calculatedRates).map(([type, rate]) => (
                        <div
                          key={type}
                          className={`
                            p-4 border rounded-lg
                            ${type === shipmentType ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}
                          `}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              {getShipmentIcon(type)}
                              <span className="ml-2 font-medium capitalize">{type}</span>
                            </div>
                            <span className="text-lg font-semibold">
                              {formatCurrency(rate)}
                            </span>
                          </div>
                          {type === shipmentType && (
                            <div className="mt-2 text-xs text-primary-600 bg-primary-100 rounded px-2 py-1 inline-block">
                              Selected Option
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total Cost:</span>
                        <span>{formatCurrency(calculatedRates[shipmentType])}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-12">
                    <Calculator className="h-12 w-12 mb-4 text-gray-400" />
                    <p>Enter shipping details and calculate to see rates</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">How Our Rate Calculator Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our shipping rate calculator provides accurate cost estimates based on various factors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <span className="text-primary-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Enter Details</h3>
              <p className="text-gray-600">
                Provide information about your package including origin, destination, weight, and dimensions.
              </p>
            </div>

            <div className="card">
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <span className="text-primary-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Service</h3>
              <p className="text-gray-600">
                Select your preferred shipping method: Road, Air, Ocean, or Express based on your needs.
              </p>
            </div>

            <div className="card">
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <span className="text-primary-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Compare Rates</h3>
              <p className="text-gray-600">
                View and compare shipping rates across different services to find the best option for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our shipping rates and calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">How accurate are the calculated rates?</h3>
              <p className="text-gray-600">
                Our calculator provides estimates based on standard rates. Actual rates may vary slightly based on specific pickup/delivery locations and current fuel surcharges.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-2">What is volumetric weight?</h3>
              <p className="text-gray-600">
                Volumetric weight is calculated using the dimensions of your package (length × width × height in cm / 5000). We charge based on whichever is higher: actual weight or volumetric weight.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Are there additional charges not shown?</h3>
              <p className="text-gray-600">
                The calculator provides base shipping costs. Additional charges may apply for insurance, duties, taxes, remote area delivery, or special handling requirements.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Can I book a shipment right after calculating?</h3>
              <p className="text-gray-600">
                Yes! After calculating your shipping rate, you can proceed to our booking page to schedule your shipment using the details you've already entered.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CalculatorPage;