import React, { useState } from 'react';
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
import { nanoid } from 'nanoid';

// Sample data for admin dashboard
const SHIPMENTS_DATA = [
  {
    id: 'LT1234567',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    status: 'in-transit',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    createdAt: '2025-06-10T10:30:00',
    estimatedDelivery: '2025-06-15',
    service: 'Express Delivery',
    priority: 'high',
    lastLocation: 'Chicago Distribution Center',
  },
  {
    id: 'LT7654321',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    status: 'delivered',
    origin: 'Seattle, WA',
    destination: 'Portland, OR',
    createdAt: '2025-06-01T09:20:00',
    estimatedDelivery: '2025-06-05',
    deliveryDate: '2025-06-05',
    service: 'Standard Delivery',
    priority: 'medium',
    lastLocation: 'Portland, OR',
  },
  {
    id: 'LT8901234',
    customer: {
      name: 'Robert Johnson',
      email: 'robert@example.com',
    },
    status: 'pending',
    origin: 'Boston, MA',
    destination: 'Washington, DC',
    createdAt: '2025-06-13T14:45:00',
    estimatedDelivery: '2025-06-18',
    service: 'Road Freight',
    priority: 'medium',
    lastLocation: 'Boston, MA',
  },
  {
    id: 'LT3456789',
    customer: {
      name: 'Sarah Williams',
      email: 'sarah@example.com',
    },
    status: 'in-transit',
    origin: 'Chicago, IL',
    destination: 'Miami, FL',
    createdAt: '2025-06-08T13:15:00',
    estimatedDelivery: '2025-06-14',
    service: 'Express Delivery',
    priority: 'high',
    lastLocation: 'Atlanta Distribution Center',
  },
  {
    id: 'LT9876543',
    customer: {
      name: 'Michael Brown',
      email: 'michael@example.com',
    },
    status: 'delayed',
    origin: 'San Francisco, CA',
    destination: 'Denver, CO',
    createdAt: '2025-06-07T16:20:00',
    estimatedDelivery: '2025-06-12',
    service: 'Standard Delivery',
    priority: 'high',
    lastLocation: 'Salt Lake City Sorting Facility',
    delayReason: 'Weather conditions affecting transportation routes.',
  },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  });
  
// Sort function
const sortedShipments = [...SHIPMENTS_DATA].sort((a, b) => {
  const key = sortConfig.key as keyof typeof a;

  // Handle undefined or null values
  const valueA = a[key] ?? '';
  const valueB = b[key] ?? '';

  // Handle date comparison
  if (key === 'createdAt' || key === 'estimatedDelivery' || key === 'deliveryDate') {
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
    if (statusFilter !== 'all' && shipment.status !== statusFilter) {
      return false;
    }
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        shipment.id.toLowerCase().includes(query) ||
        shipment.customer.name.toLowerCase().includes(query) ||
        shipment.customer.email.toLowerCase().includes(query) ||
        shipment.origin.toLowerCase().includes(query) ||
        shipment.destination.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
  
  // Render overview tab
  const renderOverviewTab = () => {
    // Calculate stats
    const totalShipments = SHIPMENTS_DATA.length;
    const inTransit = SHIPMENTS_DATA.filter(s => s.status === 'in-transit').length;
    const delivered = SHIPMENTS_DATA.filter(s => s.status === 'delivered').length;
    const pending = SHIPMENTS_DATA.filter(s => s.status === 'pending').length;
    const delayed = SHIPMENTS_DATA.filter(s => s.status === 'delayed').length;
    
    // Calculate percentages for donut chart (this would be replaced with a real chart in production)
    const inTransitPercent = Math.round((inTransit / totalShipments) * 100);
    const deliveredPercent = Math.round((delivered / totalShipments) * 100);
    const pendingPercent = Math.round((pending / totalShipments) * 100);
    const delayedPercent = Math.round((delayed / totalShipments) * 100);
    
    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Total Shipments</div>
                <div className="text-2xl font-semibold">{totalShipments}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <TruckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">In Transit</div>
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
        
        {/* Charts and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Shipment Status</h3>
            <div className="flex items-center justify-center p-4">
              {/* Simple representation of a donut chart */}
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-medium">{totalShipments}</span>
                </div>
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeDasharray={`${inTransitPercent}, 100`}
                    strokeDashoffset="25"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="3"
                    strokeDasharray={`${deliveredPercent}, 100`}
                    strokeDashoffset={`${100 - inTransitPercent + 25}`}
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeDasharray={`${pendingPercent}, 100`}
                    strokeDashoffset={`${100 - inTransitPercent - deliveredPercent + 25}`}
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeDasharray={`${delayedPercent}, 100`}
                    strokeDashoffset={`${100 - inTransitPercent - deliveredPercent - pendingPercent + 25}`}
                  />
                </svg>
              </div>
              <div className="ml-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                    <span className="text-sm">In Transit ({inTransitPercent}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
                    <span className="text-sm">Delivered ({deliveredPercent}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-accent-500 rounded-full mr-2"></div>
                    <span className="text-sm">Pending ({pendingPercent}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-error-500 rounded-full mr-2"></div>
                    <span className="text-sm">Delayed ({delayedPercent}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {SHIPMENTS_DATA.slice(0, 4).map((shipment) => (
                <div key={nanoid()} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="p-2 rounded-full mr-3">
                    {shipment.status === 'delivered' ? (
                      <CheckCircle className="h-5 w-5 text-success-500" />
                    ) : shipment.status === 'in-transit' ? (
                      <TruckIcon className="h-5 w-5 text-primary-500" />
                    ) : shipment.status === 'delayed' ? (
                      <AlertTriangle className="h-5 w-5 text-error-500" />
                    ) : (
                      <Package className="h-5 w-5 text-accent-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{shipment.id}</div>
                    <div className="text-sm text-gray-600">
                      {shipment.status === 'delivered' 
                        ? `Delivered to ${shipment.destination}` 
                        : shipment.status === 'in-transit'
                        ? `In transit at ${shipment.lastLocation}`
                        : shipment.status === 'delayed'
                        ? `Delayed at ${shipment.lastLocation}`
                        : `Pending pickup from ${shipment.origin}`
                      }
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(shipment.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all activity
              </button>
            </div>
          </div>
        </div>
        
        {/* Top Priority Shipments */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">High Priority Shipments</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Est. Delivery
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {SHIPMENTS_DATA.filter(s => s.priority === 'high').map((shipment) => (
                  <tr key={nanoid()} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-600">{shipment.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{shipment.customer.name}</div>
                      <div className="text-sm text-gray-500">{shipment.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={shipment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shipment.origin}</div>
                      <div className="text-sm text-gray-500">to {shipment.destination}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(shipment.estimatedDelivery)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Update
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
  
  // Render shipments tab
  const renderShipmentsTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Shipments</h2>
          <button className="btn btn-primary">
            + New Shipment
          </button>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, customer, or location..."
              className="pl-10 input w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <select
                className="input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
            
            <button className="btn btn-outline px-3 py-2">
              Export
            </button>
          </div>
        </div>
        
        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('id')}
                  >
                    <div className="flex items-center">
                      Tracking ID
                      {sortConfig.key === 'id' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-4 w-4 ml-1" />
                          : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === 'status' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-4 w-4 ml-1" />
                          : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Created
                      {sortConfig.key === 'createdAt' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-4 w-4 ml-1" />
                          : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('estimatedDelivery')}
                  >
                    <div className="flex items-center">
                      Est. Delivery
                      {sortConfig.key === 'estimatedDelivery' && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-4 w-4 ml-1" />
                          : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr key={nanoid()} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-600">{shipment.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{shipment.customer.name}</div>
                      <div className="text-sm text-gray-500">{shipment.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={shipment.status} />
                      {shipment.status === 'delayed' && (
                        <div className="text-xs text-red-600 mt-1 max-w-xs truncate">
                          {shipment.delayReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                        {shipment.origin}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                        {shipment.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(shipment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(shipment.estimatedDelivery)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityIndicator priority={shipment.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredShipments.length === 0 && (
            <div className="py-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No shipments found</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'There are no shipments matching the selected filters'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render drivers tab
  const renderDriversTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Delivery Drivers</h2>
          <button className="btn btn-primary">
            + Add Driver
          </button>
        </div>
        
        <p className="text-gray-600 py-8 text-center">
          Driver management functionality will be implemented in the next phase.
        </p>
      </div>
    );
  };
  
  // Render reports tab
  const renderReportsTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Reports & Analytics</h2>
          <div className="flex space-x-3">
            <button className="btn btn-outline">
              Export Data
            </button>
            <button className="btn btn-primary">
              Generate Report
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 py-8 text-center">
          Reporting and analytics functionality will be implemented in the next phase.
        </p>
      </div>
    );
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage shipments, drivers, and monitor delivery performance
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-full mr-4">
              <Package className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Active Shipments</div>
              <div className="text-2xl font-semibold">
                {SHIPMENTS_DATA.filter(s => s.status !== 'delivered').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Total Customers</div>
              <div className="text-2xl font-semibold">
                {/* Count unique customers */}
                {new Set(SHIPMENTS_DATA.map(s => s.customer.email)).size}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <TruckIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Deliveries Today</div>
              <div className="text-2xl font-semibold">3</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">On-Time Delivery</div>
              <div className="text-2xl font-semibold">92%</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'shipments'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('shipments')}
          >
            Shipments
          </button>
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'drivers'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('drivers')}
          >
            Drivers
          </button>
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'shipments' && renderShipmentsTab()}
      {activeTab === 'drivers' && renderDriversTab()}
      {activeTab === 'reports' && renderReportsTab()}
    </div>
  );
};

export default AdminDashboard;