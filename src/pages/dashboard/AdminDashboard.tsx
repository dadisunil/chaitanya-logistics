import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  TruckIcon,
  Package,
  BarChart,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react';
import DatePicker from 'react-datepicker'; // Corrected import for DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import datepicker styles
import { API_BASE_URL } from '../../config';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<any[]>([]); // State for fetched shipment data
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  });
  const [startDate, setStartDate] = useState<Date | null>(null); // State for start date
  const [endDate, setEndDate] = useState<Date | null>(null); // State for end date

  // Add state for status update
  const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>({});
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch shipment data from the backend
  const fetchShipments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/shipments/`);
      setShipments(response.data); // Set the fetched data to state
    } catch (error) {
      console.error('Error fetching shipment data:', error);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Sort function
  const sortedShipments = [...shipments].sort((a, b) => {
    const key = sortConfig.key as keyof typeof a;
    const valueA = a[key] ?? '';
    const valueB = b[key] ?? '';

    // Use booking_date and estimated_delivery for sorting
    if (key === 'booking_date' || key === 'estimated_delivery') {
      const dateA = new Date(valueA as string).getTime();
      const dateB = new Date(valueB as string).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    // Handle string comparison (case-insensitive)
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortConfig.direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Handle number comparison
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
    }

    return 0; // Default case if values are not comparable
  });

  // Filter function
  const filteredShipments = sortedShipments.filter((shipment) => {
    // Status filter
    if (statusFilter !== 'all' && (shipment.status || '').toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        shipment.id.toLowerCase().includes(query) ||
        shipment.customer?.name?.toLowerCase().includes(query) ||
        shipment.customer?.email?.toLowerCase().includes(query) ||
        shipment.origin.toLowerCase().includes(query) ||
        shipment.destination.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
  };

  // Handle sort
  const requestSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Status indicator component
  const StatusIndicator = ({ status }: { status: string }) => {
    let statusText, statusColor, statusIcon;

    switch (status) {
      case 'delivered':
        statusText = 'Delivered';
        statusColor = 'bg-success-500 text-white';
        statusIcon = <CheckCircle className="h-4 w-4 mr-1" />;
        break;
      case 'in-transit':
        statusText = 'In Transit';
        statusColor = 'bg-primary-500 text-white';
        statusIcon = <TruckIcon className="h-4 w-4 mr-1" />;
        break;
      case 'pending':
        statusText = 'Pending';
        statusColor = 'bg-accent-500 text-white';
        statusIcon = <Clock className="h-4 w-4 mr-1" />;
        break;
      case 'delayed':
        statusText = 'Delayed';
        statusColor = 'bg-error-500 text-white';
        statusIcon = <AlertTriangle className="h-4 w-4 mr-1" />;
        break;
      default:
        statusText = 'Processing';
        statusColor = 'bg-gray-500 text-white';
        statusIcon = <Package className="h-4 w-4 mr-1" />;
    }

    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
        {statusIcon}
        {statusText}
      </div>
    );
  };

  // Priority indicator component
  const PriorityIndicator = ({ priority }: { priority: string }) => {
    let priorityColor;

    switch (priority) {
      case 'high':
        priorityColor = 'bg-red-100 text-red-800';
        break;
      case 'medium':
        priorityColor = 'bg-yellow-100 text-yellow-800';
        break;
      case 'low':
        priorityColor = 'bg-green-100 text-green-800';
        break;
      default:
        priorityColor = 'bg-gray-100 text-gray-800';
    }

    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${priorityColor}`}>
        {priority}
      </span>
    );
  };

  // Handle filter
  const handleFilter = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/shipments/`, {
        params: {
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString(),
        },
      });
      setShipments(response.data);
    } catch (error) {
      console.error('Error filtering shipment data:', error);
    }
  };

  // Render overview tab
  const renderOverviewTab = () => {
    const totalShipments = shipments.length;
    const inTransit = shipments.filter((s) => (s.status || '').toLowerCase() === 'in-transit').length;
    const delivered = shipments.filter((s) => (s.status || '').toLowerCase() === 'delivered').length;
    const pending = shipments.filter((s) => (s.status || '').toLowerCase() === 'pending').length;
    const delayed = shipments.filter((s) => (s.status || '').toLowerCase() === 'delayed').length;

    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Active Shipments</div>
                <div className="text-2xl font-semibold">{inTransit}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Delivered</div>
                <div className="text-2xl font-semibold">{delivered}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Clock className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Pending</div>
                <div className="text-2xl font-semibold">{pending}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Delayed</div>
                <div className="text-2xl font-semibold">{delayed}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render shipments tab
  const renderShipmentsTab = () => {
    return (
      <div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LR No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{shipment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="border rounded px-2 py-1"
                        value={statusUpdates[shipment.id] || shipment.status}
                        onChange={(e) => handleStatusChange(shipment.id, e.target.value)}
                        disabled={updating === shipment.id}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="delayed">Delayed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{shipment.from_location || shipment.origin || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{shipment.to_location || shipment.destination || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.booking_date ? formatDate(shipment.booking_date) : ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.estimated_delivery ? formatDate(shipment.estimated_delivery) : ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.service_type || shipment.service || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="bg-primary-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        onClick={() => updateShipmentStatus(shipment.id)}
                        disabled={updating === shipment.id || !statusUpdates[shipment.id] || statusUpdates[shipment.id] === shipment.status}
                      >
                        {updating === shipment.id ? 'Updating...' : 'Update'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Fixed implicit 'any' type for date parameters
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  // Handle status dropdown change
  const handleStatusChange = (shipmentId: string, newStatus: string) => {
    setStatusUpdates((prev) => ({ ...prev, [shipmentId]: newStatus }));
  };

  // Handle status update API call
  const updateShipmentStatus = async (shipmentId: string) => {
    setUpdating(shipmentId);
    try {
      await axios.post(
        `${API_BASE_URL}/api/update-shipment-status/`,
        { lr_no: shipmentId, status: statusUpdates[shipmentId] }
      );
      fetchShipments(); // Refresh data
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        alert('You are forbidden to update the shipment status.');
      } else {
        alert('Failed to update status.');
      }
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'shipments' && renderShipmentsTab()}
      <div className="recent-shipments-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="text-xl font-semibold">Recent Shipments</h2>
        <div className="date-filter" style={{ display: 'flex', gap: '10px' }}>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            placeholderText="Start Date"
            className="border rounded px-2 py-1"
          />
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            placeholderText="End Date"
            className="border rounded px-2 py-1"
          />
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Filter
          </button>
        </div>
      </div>
      <ul>
        {shipments.map((shipment) => (
          <li key={shipment.id}>{shipment.id} - {shipment.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;