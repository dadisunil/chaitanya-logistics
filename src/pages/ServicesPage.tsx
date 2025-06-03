import React from 'react';

const ServicesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Standard Shipping</h2>
          <p className="text-gray-600 mb-4">Affordable, reliable delivery for non-urgent domestic shipments. Typical delivery time: 3-5 business days. Includes basic tracking and doorstep delivery.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Express Shipping</h2>
          <p className="text-gray-600 mb-4">Fastest option for urgent packages. Delivery within 1-2 business days. Includes real-time tracking and priority handling.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">International Shipping</h2>
          <p className="text-gray-600 mb-4">Worldwide shipping with customs clearance, end-to-end tracking, and estimated delivery between 5-10 business days depending on destination.</p>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;