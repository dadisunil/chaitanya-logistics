import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const UserOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('logitrack_token');
        const response = await axios.get(`${API_BASE_URL}/api/user-bookings/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Your Past Orders</h1>
      <button
        className="btn btn-primary mb-6"
        onClick={() => window.location.href = '/booking'}
      >
        Book Now
      </button>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id} className="mb-4 border-b pb-2">
              <div><strong>LR No:</strong> {order.lr_no}</div>
              <div><strong>Status:</strong> {order.status}</div>
              <div><strong>Service:</strong> {order.service_type}</div>
              <div><strong>Pickup Date:</strong> {order.pickup_date}</div>
              {/* Add more fields as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrdersPage;
