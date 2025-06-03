import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Package, Clock, CheckCircle, Download, Filter, RefreshCcw, XCircle, Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subWeeks, subMonths, subYears } from 'date-fns';

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong: {this.state.error?.message}</h1>;
    }

    return this.props.children;
  }
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('shipments');
  const [shipments, setShipments] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  // Add state for status update
  const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>({});
  const [updating, setUpdating] = useState<string | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination and sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Add fade state
  const [isFading, setIsFading] = useState(false);

  // Add isCalendarOpen state to control DatePicker popup.
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomerShipments = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/customer-shipments/', {
          baseURL: 'http://127.0.0.1:8000',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            page: currentPage,
            page_size: pageSize,
          },
        });
        if (Array.isArray(response.data.results)) {
          setShipments(response.data.results);
          setTotalCount(response.data.count || 0);
        } else {
          setShipments([]);
          setTotalCount(0);
        }
      } catch (error) {
        setShipments([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerShipments();
  }, [currentPage, pageSize]);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Export shipments as CSV
  const exportShipments = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get('/api/export-customer-shipments-csv/', {
        baseURL: 'http://127.0.0.1:8000',
        withCredentials: true,
        headers: {
          'Content-Type': 'text/csv',
        },
        params: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'shipments.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Error exporting shipment data:', error);
      alert('Failed to export shipment data.');
    } finally {
      setLoading(false);
    }
  };
  // Filter shipments by date
  const filterShipments = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    setIsFading(true);
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.get('/api/customer-shipments/', {
          baseURL: 'http://127.0.0.1:8000',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            page: 1,
            page_size: pageSize,
          },
        });
        if (Array.isArray(response.data.results)) {
          setShipments(response.data.results);
          setTotalCount(response.data.count || 0);
          setCurrentPage(1);
        } else {
          setShipments([]);
          setTotalCount(0);
        }
      } catch (error) {
        setShipments([]);
        setTotalCount(0);
      } finally {
        setIsFading(false);
        setLoading(false);
      }
    }, 200); // 200ms fade duration
  };


  // Reset filter to remove date conditions and reload all shipments
  const resetFilter = async () => {
    setDateRange([null, null]);
    setLoading(true);
    try {
      const response = await axios.get('/api/customer-shipments/', {
        baseURL: 'http://127.0.0.1:8000',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          page: 1,
          page_size: pageSize,
        },
      });
      if (Array.isArray(response.data.results)) {
        setShipments(response.data.results);
        setTotalCount(response.data.count || 0);
        setCurrentPage(1);
      } else {
        setShipments([]);
        setTotalCount(0);
      }
    } catch (error) {
      setShipments([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch booking details by LR No
  const fetchBookingByLRNo = async (lrNo: string) => {
    try {
      const response = await axios.get(`/api/customer-shipments/`, {
        baseURL: 'http://127.0.0.1:8000',
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      if (Array.isArray(response.data.results)) {
        const found = response.data.results.find((b: any) => b.id === lrNo);
        if (found) setReceiptData(found);
      }
    } catch (error) {
      setReceiptData(null);
    }
  };

  // Print receipt logic (reuse from BookingPage)
  const handlePrintReceipt = () => {
    if (!receiptData) return;
    const printContent = `
      <div>
        <h1>Booking Receipt</h1>
        <p><strong>LR No:</strong> ${receiptData.id}</p>
        <p><strong>Status:</strong> ${receiptData.status}</p>
        <p><strong>Origin:</strong> ${receiptData.origin}</p>
        <p><strong>Destination:</strong> ${receiptData.destination}</p>
        <p><strong>Booking Date:</strong> ${receiptData.createdAt ? new Date(receiptData.createdAt).toLocaleDateString() : ''}</p>
        <p><strong>Estimated Delivery:</strong> ${receiptData.estimatedDelivery ? new Date(receiptData.estimatedDelivery).toLocaleDateString() : ''}</p>
        <p><strong>Service:</strong> ${receiptData.service}</p>
        <p><strong>Branch From Phone:</strong> ${receiptData.branch_from_phone}</p>
        <p><strong>Branch To Phone:</strong> ${receiptData.branch_to_phone}</p>
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

  // Handle status dropdown change
  const handleStatusChange = (shipmentId: string, newStatus: string) => {
    setStatusUpdates((prev) => ({ ...prev, [shipmentId]: newStatus }));
  };

  // Handle status update API call
  const updateShipmentStatus = async (shipmentId: string) => {
    setUpdating(shipmentId);
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/update-shipment-status/',
        { lr_no: shipmentId, status: statusUpdates[shipmentId] }
      );
      // Refresh shipments after update
      const response = await axios.get('/api/customer-shipments/', {
        baseURL: 'http://127.0.0.1:8000',
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
        params: {
          page: currentPage,
          page_size: pageSize,
        },
      });
      setShipments(Array.isArray(response.data.results) ? response.data.results : []);
      setTotalCount(response.data.count || 0);
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

  // Shipments Tab
  const renderShipmentsTab = () => {
    const shipmentCount = Array.isArray(shipments) ? shipments.length : 0;

    // Filtered shipments based on search
    const filteredShipments = shipments.filter((shipment) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        (shipment.id && shipment.id.toLowerCase().includes(term)) ||
        (shipment.status && shipment.status.toLowerCase().includes(term)) ||
        (shipment.origin && shipment.origin.toLowerCase().includes(term)) ||
        (shipment.destination && shipment.destination.toLowerCase().includes(term)) ||
        (shipment.service && shipment.service.toLowerCase().includes(term))
      );
    });

    // Sorting logic
    const sortedShipments = React.useMemo(() => {
      let sortable = [...filteredShipments];
      if (sortConfig !== null) {
        sortable.sort((a, b) => {
          const aValue = a[sortConfig.key] ?? '';
          const bValue = b[sortConfig.key] ?? '';
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return sortable;
    }, [filteredShipments, sortConfig]);

    // Pagination logic
    const totalRecords = totalCount;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const paginatedShipments = shipments;

    // Handle sort
    const handleSort = (key: string) => {
      setSortConfig((prev) => {
        if (prev && prev.key === key) {
          return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { key, direction: 'asc' };
      });
    };

    // Responsive controls container
    return (
      <div>
        {/* Loading Spinner Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
            <Loader2 className="animate-spin h-12 w-12 text-primary-600" />
          </div>
        )}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2 flex-wrap w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold">
              Recent Shipments
              <span className="ml-2 text-base font-normal text-gray-500">({shipmentCount} record{shipmentCount === 1 ? '' : 's'})</span>
            </h1>
          </div>
          <div className="flex flex-row flex-wrap w-full gap-2 items-center justify-start">
            <input
              type="text"
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border rounded px-2 py-1 flex-1 min-w-0 max-w-xs focus:ring-2 focus:ring-primary-300"
            />
            <div className="flex flex-row gap-2 items-center flex-shrink-0">
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update: [Date | null, Date | null]) => {
                  setDateRange(update);
                }}
                isClearable={true}
                placeholderText="Select date range"
                className="border rounded px-2 py-1 min-w-0 max-w-xs focus:ring-2 focus:ring-primary-300"
                open={isCalendarOpen}
                onClickOutside={() => setIsCalendarOpen(false)}
                onInputClick={() => setIsCalendarOpen(true)}
                calendarContainer={({ children }) => (
                  <div
                    style={{ background: 'rgba(255,255,255,0.98)', borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', position: 'relative' }}
                    className="flex flex-row p-2 relative"
                  >
                    {/* Quick range buttons vertically beside calendar */}
                    <div className="flex flex-col gap-2 pr-4 border-r border-gray-200 justify-center min-w-[120px]">
                      {quickRanges.map(q => (
                        <button
                          key={q.label}
                          type="button"
                          className="border rounded px-2 py-1 text-xs hover:bg-primary-100 hover:text-primary-700 whitespace-nowrap focus:ring-2 focus:ring-primary-300"
                          onClick={() => {
                            setDateRange(q.getRange() as [Date | null, Date | null]);
                          }}
                          title={q.label}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                    <div className="pl-4 relative w-full">
                      {children}
                    </div>
                  </div>
                )}
              />
              <button
                onClick={filterShipments}
                className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:ring-2 focus:ring-green-300 flex-shrink-0"
                title="Apply Filter"
                style={{ whiteSpace: 'nowrap' }}
              >
                <Filter className="h-4 w-4" /> Filter
              </button>
              <button
                onClick={exportShipments}
                className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 flex-shrink-0"
                title="Export as CSV"
                style={{ whiteSpace: 'nowrap' }}
              >
                <Download className="h-4 w-4" /> Export
              </button>
              <button
                onClick={resetFilter}
                className="flex items-center gap-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 flex-shrink-0"
                title="Reset Filter"
                style={{ whiteSpace: 'nowrap' }}
              >
                <RefreshCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto max-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {[
                  { key: 'id', label: 'LR No' },
                  { key: 'status', label: 'Status' },
                  { key: 'origin', label: 'Origin' },
                  { key: 'destination', label: 'Destination' },
                  { key: 'createdAt', label: 'Booking Date' },
                  { key: 'estimatedDelivery', label: 'Est. Delivery' },
                  { key: 'service', label: 'Service' },
                  { key: 'branch_from_phone', label: 'Branch From Phone' },
                  { key: 'branch_to_phone', label: 'Branch To Phone' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  >
                    {col.label}
                    {sortConfig?.key === col.key && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </th>
                ))}
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedShipments.map((shipment, idx) => (
                <tr key={shipment.id} className={idx % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-primary-600 underline hover:text-primary-800"
                      onClick={() => {
                        fetchBookingByLRNo(shipment.id);
                        setShowReceipt(true);
                      }}
                    >
                      {shipment.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shipment.status}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900" title={shipment.origin}>{shipment.origin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900" title={shipment.destination}>{shipment.destination}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(shipment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(shipment.estimatedDelivery)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.branch_from_phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.branch_to_phone}
                  </td>
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
                    <button
                      className="ml-2 bg-primary-600 text-white px-3 py-1 rounded disabled:opacity-50"
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
        {/* Pagination controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 gap-2">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Address Book Tab
  const renderAddressBookTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Saved Addresses</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium">Home</h4>
              <div className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">Default</div>
            </div>
            <p className="text-gray-700 text-sm">123 Main Street</p>
            <p className="text-gray-700 text-sm">Apt 4B</p>
            <p className="text-gray-700 text-sm">New York, NY 10001</p>
            <p className="text-gray-700 text-sm">United States</p>
            
            <div className="mt-4 pt-3 border-t border-gray-100 flex space-x-3">
              <button className="text-sm text-primary-600 hover:text-primary-700">Edit</button>
              <button className="text-sm text-gray-600 hover:text-gray-700">Delete</button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium">Office</h4>
            </div>
            <p className="text-gray-700 text-sm">456 Business Avenue</p>
            <p className="text-gray-700 text-sm">Suite 200</p>
            <p className="text-gray-700 text-sm">New York, NY 10018</p>
            <p className="text-gray-700 text-sm">United States</p>
            
            <div className="mt-4 pt-3 border-t border-gray-100 flex space-x-3">
              <button className="text-sm text-primary-600 hover:text-primary-700">Edit</button>
              <button className="text-sm text-gray-600 hover:text-gray-700">Delete</button>
              <button className="text-sm text-gray-600 hover:text-gray-700">Set as default</button>
            </div>
          </div>
        </div>
        
        <button className="mt-6 btn btn-outline">
          Add New Address
        </button>
      </div>
    );
  };
  
  // Account Settings Tab
  const renderAccountTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Account Settings</h3>
        
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium mb-3">Personal Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={user?.name}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={user?.email}
                    className="input w-full"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue="+1 (555) 123-4567"
                    className="input w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-base font-medium mb-3">Change Password</h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="input w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-base font-medium mb-3">Notification Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">Email Notifications</label>
                    <p className="text-gray-500">Receive email updates about your shipments</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="smsNotifications"
                      name="smsNotifications"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="smsNotifications" className="font-medium text-gray-700">SMS Notifications</label>
                    <p className="text-gray-500">Receive text messages about your shipments</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="marketingEmails"
                      name="marketingEmails"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="marketingEmails" className="font-medium text-gray-700">Marketing Emails</label>
                    <p className="text-gray-500">Receive promotional offers and updates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button type="button" className="btn btn-outline mr-3">
              Cancel
            </button>
            <button type="button" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Dashboard Stats (dynamic counts)
  const activeCount = shipments.filter(s => s.status === 'in-transit').length;
  const deliveredCount = shipments.filter(s => s.status === 'delivered').length;
  const pendingCount = shipments.filter(s => s.status === 'pending').length;
  
  // Quick date range options
  const quickRanges = [
    { label: 'Today', getRange: () => {
      const today = new Date();
      return [startOfDay(today), endOfDay(today)];
    }},
    { label: 'Yesterday', getRange: () => {
      const yesterday = subDays(new Date(), 1);
      return [startOfDay(yesterday), endOfDay(yesterday)];
    }},
    { label: 'This Week', getRange: () => {
      const now = new Date();
      return [startOfWeek(now, { weekStartsOn: 1 }), endOfWeek(now, { weekStartsOn: 1 })];
    }},
    { label: 'Last Week', getRange: () => {
      const lastWeek = subWeeks(new Date(), 1);
      return [startOfWeek(lastWeek, { weekStartsOn: 1 }), endOfWeek(lastWeek, { weekStartsOn: 1 })];
    }},
    { label: 'This Month', getRange: () => {
      const now = new Date();
      return [startOfMonth(now), endOfMonth(now)];
    }},
    { label: 'Last Month', getRange: () => {
      const lastMonth = subMonths(new Date(), 1);
      return [startOfMonth(lastMonth), endOfMonth(lastMonth)];
    }},
    { label: 'This Year', getRange: () => {
      const now = new Date();
      return [startOfYear(now), endOfYear(now)];
    }},
    { label: 'Last Year', getRange: () => {
      const lastYear = subYears(new Date(), 1);
      return [startOfYear(lastYear), endOfYear(lastYear)];
    }},
  ];
  
  return (
    <ErrorBoundary>
      <div className="max-w-screen-xl mx-auto px-2 md:px-6 py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name}</h1>
          <p className="text-gray-600 text-sm">
            Manage your shipments, bookings, and account settings
          </p>
        </div>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Active Shipments</div>
                <div className="text-2xl font-semibold">{activeCount}</div>
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
                <div className="text-2xl font-semibold">{deliveredCount}</div>
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
                <div className="text-2xl font-semibold">{pendingCount}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
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
                activeTab === 'addresses'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('addresses')}
            >
              Address Book
            </button>
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'account'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('account')}
            >
              Account Settings
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'shipments' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                {renderShipmentsTab()}
              </div>
            </div>
          )}
          {activeTab === 'addresses' && renderAddressBookTab()}
          {activeTab === 'account' && renderAccountTab()}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={async () => {
              try {
                const response = await axios.get('/api/export-all-customer-shipments-csv/', {
                  baseURL: 'http://127.0.0.1:8000',
                  withCredentials: true,
                  headers: {
                    'Content-Type': 'text/csv',
                  },
                  responseType: 'blob',
                });
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'all_shipments.csv');
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
              } catch (error) {
                alert('Failed to export all shipment data.');
              }
            }}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Export All
          </button>
        </div>
        {/* Modal for receipt */}
        <Modal
          isOpen={showReceipt}
          onRequestClose={() => setShowReceipt(false)}
          className="fixed inset-0 flex items-center justify-center z-50 outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
          ariaHideApp={false}
        >
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 focus:outline-none"
              onClick={() => setShowReceipt(false)}
              title="Close"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Booking Receipt</h2>
            {receiptData ? (
              <div>
                <p><strong>LR No:</strong> {receiptData.id}</p>
                <p><strong>Status:</strong> {receiptData.status}</p>
                <p><strong>Origin:</strong> {receiptData.origin}</p>
                <p><strong>Destination:</strong> {receiptData.destination}</p>
                <p><strong>Booking Date:</strong> {receiptData.createdAt ? new Date(receiptData.createdAt).toLocaleDateString() : ''}</p>
                <p><strong>Estimated Delivery:</strong> {receiptData.estimatedDelivery ? new Date(receiptData.estimatedDelivery).toLocaleDateString() : ''}</p>
                <p><strong>Service:</strong> {receiptData.service}</p>
                <p><strong>Branch From Phone:</strong> {receiptData.branch_from_phone}</p>
                <p><strong>Branch To Phone:</strong> {receiptData.branch_to_phone}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
            <div className="flex justify-end mt-6 space-x-3">
              <button onClick={handlePrintReceipt} className="btn btn-primary">Print Receipt</button>
              <button onClick={() => setShowReceipt(false)} className="btn btn-outline">Close</button>
            </div>
          </div>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default CustomerDashboard;