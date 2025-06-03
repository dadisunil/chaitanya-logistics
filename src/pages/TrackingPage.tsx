import React, { useState } from 'react';
import { Package, TruckIcon, CheckCircle, AlertCircle, Calendar, Clock, MapPin } from 'lucide-react';

// TrackingPage Component
const TrackingPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      setTrackingData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/track_shipment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lr_no: trackingNumber }),
      });

      const result = await response.json();

      if (result.success) {
        setTrackingData(result);
        setError(null);
      } else {
        setTrackingData(null);
        setError(result.message || 'No shipment found with this tracking number. Please check and try again.');
      }
    } catch (error) {
      setError('An error occurred while fetching tracking details. Please try again later.');
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  // Explicitly type the updates array and its elements
  type Update = {
    status: string;
    location: string;
    timestamp: string;
    description: string;
  };

  // Removed redundant redeclaration of trackingData

  // Status indicator component
  const StatusIndicator = ({ status }: { status: string }) => {
    let statusText, statusIcon, statusColor;
    
    switch (status) {
      case 'delivered':
        statusText = 'Delivered';
        statusIcon = <CheckCircle className="h-5 w-5" />;
        statusColor = 'bg-success-500 text-white';
        break;
      case 'in-transit':
        statusText = 'In Transit';
        statusIcon = <TruckIcon className="h-5 w-5" />;
        statusColor = 'bg-primary-500 text-white';
        break;
      case 'order-placed':
        statusText = 'Order Placed';
        statusIcon = <Package className="h-5 w-5" />;
        statusColor = 'bg-accent-500 text-white';
        break;
      case 'out-for-delivery':
        statusText = 'Out for Delivery';
        statusIcon = <TruckIcon className="h-5 w-5" />;
        statusColor = 'bg-primary-600 text-white';
        break;
      default:
        statusText = 'Processing';
        statusIcon = <Package className="h-5 w-5" />;
        statusColor = 'bg-gray-500 text-white';
    }
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
        {statusIcon}
        <span className="ml-1">{statusText}</span>
      </div>
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-950 text-white py-16">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Track Your Shipment</h1>
            <p className="text-lg text-gray-300 mb-8">
              Enter your tracking number to get real-time updates on your shipment status and location.
            </p>
            
            <form onSubmit={handleTrack} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (Try LT1234567 or LT7654321)"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button 
                  type="submit" 
                  className="btn bg-accent-500 hover:bg-accent-600 text-white px-6 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Tracking...' : 'Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Tracking Results */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          {error && (
            <div className="bg-error-500 text-white p-4 rounded-lg mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {trackingData && (
            <div className="animate-fadeIn">
              {/* Tracking Header */}
              <div className="bg-white rounded-lg shadow-custom p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">
                      Tracking Number: {trackingData.trackingNumber}
                    </h2>
                    <StatusIndicator status={trackingData.status} />
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right">
                    <div className="text-gray-600 mb-2">
                      <Calendar className="inline-block h-4 w-4 mr-1" />
                      {trackingData.status === 'delivered' 
                        ? `Delivered on ${formatDate(trackingData.deliveryDate)}` 
                        : `Estimated delivery: ${formatDate(trackingData.estimatedDelivery)}`}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Service:</span> {trackingData.service}
                    </div>
                  </div>
                </div>
                
                {/* Shipment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">From</div>
                    <div className="font-medium flex items-start">
                      <MapPin className="h-4 w-4 mt-0.5 mr-1 text-gray-500" />
                      {trackingData.origin}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">To</div>
                    <div className="font-medium flex items-start">
                      <MapPin className="h-4 w-4 mt-0.5 mr-1 text-gray-500" />
                      {trackingData.destination}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-sm mb-1">Weight</div>
                    <div className="font-medium">
                      {trackingData.weight}
                    </div>
                  </div>
                </div>
                
                {/* Tracking Progress */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Shipment Progress</h3>
                  <div className="tracking-progress">
                    <div className={`tracking-step ${trackingData?.updates.some((u: Update) => u.status === 'Order Placed') ? 'completed' : ''}`}>
                      <Package className="h-4 w-4" />
                    </div>
                    <div className={`tracking-line ${trackingData?.updates.some((u: Update) => u.status === 'Picked Up') ? 'active' : ''}`}></div>
                    <div className={`tracking-step ${trackingData?.updates.some((u: Update) => u.status === 'Picked Up') ? 'completed' : ''}`}>
                      <Package className="h-4 w-4" />
                    </div>
                    <div className={`tracking-line ${trackingData?.updates.some((u: Update) => u.status === 'In Transit') ? 'active' : ''}`}></div>
                    <div className={`tracking-step ${trackingData?.updates.some((u: Update) => u.status === 'In Transit') ? 'completed' : trackingData?.updates.some((u: Update) => u.status === 'Out for Delivery' || u.status === 'Delivered') ? 'completed' : ''}`}>
                      <TruckIcon className="h-4 w-4" />
                    </div>
                    <div className={`tracking-line ${trackingData?.updates.some((u: Update) => u.status === 'Out for Delivery') ? 'active' : ''}`}></div>
                    <div className={`tracking-step ${trackingData?.updates.some((u: Update) => u.status === 'Out for Delivery') ? 'completed' : ''}`}>
                      <TruckIcon className="h-4 w-4" />
                    </div>
                    <div className={`tracking-line ${trackingData?.updates.some((u: Update) => u.status === 'Delivered') ? 'active' : ''}`}></div>
                    <div className={`tracking-step ${trackingData?.updates.some((u: Update) => u.status === 'Delivered') ? 'completed' : ''}`}>
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Order Placed</span>
                    <span>Picked Up</span>
                    <span>In Transit</span>
                    <span>Out for Delivery</span>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>
              
              {/* Tracking Timeline */}
              <div className="bg-white rounded-lg shadow-custom p-6">
                <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
                <div className="space-y-6">
                  {trackingData.updates.map((update: any, index: number) => {
                    const { date, time } = formatTimestamp(update.timestamp);
                    return (
                      <div key={index} className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-0 last:pb-0">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary-500"></div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div>
                            <h4 className="font-semibold text-primary-800">{update.status}</h4>
                            <p className="text-gray-600 mb-1">
                              <MapPin className="inline-block h-4 w-4 mr-1" />
                              {update.location}
                            </p>
                            <p className="text-gray-600 text-sm">{update.description}</p>
                          </div>
                          <div className="mt-2 sm:mt-0 sm:ml-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {date}
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {time}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {!error && !trackingData && !isLoading && (
            <div className="text-center py-10">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Enter Your Tracking Number</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Enter your tracking number above to get the latest status updates on your shipment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about tracking your shipments with chaitanyalogistics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">How do I track my shipment?</h3>
              <p className="text-gray-600">
                Enter your tracking number in the form above to get real-time updates on your shipment status. You can find your tracking number in your shipping confirmation email.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">What if my tracking information is not updating?</h3>
              <p className="text-gray-600">
                It may take up to 24 hours for tracking information to appear in our system. If you don't see updates after this time, please contact our customer support.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">How accurate is the estimated delivery date?</h3>
              <p className="text-gray-600">
                Our estimated delivery dates are based on current shipping conditions and are generally accurate. However, factors such as weather and unforeseen events may cause delays.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Can I change my delivery address after shipping?</h3>
              <p className="text-gray-600">
                For security reasons, we cannot change the delivery address once a package has been shipped. Please contact customer support for assistance with special circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrackingPage;