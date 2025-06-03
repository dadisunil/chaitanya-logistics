import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  MapPin,
  Settings,
  CreditCard,
  Bell,
  LogOut,
  BarChart,
} from 'lucide-react';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    {
      name: 'Shipments',
      icon: <Package className="h-5 w-5" />,
      path: '/dashboard',
      key: 'shipments',
    },
    {
      name: 'Address Book',
      icon: <MapPin className="h-5 w-5" />,
      path: '/dashboard/addresses',
      key: 'address-book',
    },
    {
      name: 'Payment Methods',
      icon: <CreditCard className="h-5 w-5" />,
      path: '/dashboard/payments',
      key: 'payment-methods',
    },
    {
      name: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      path: '/dashboard/notifications',
      key: 'notifications',
    },
    {
      name: 'Account Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/dashboard/settings',
      key: 'account-settings',
    },
    {
      name: 'Agent Dashboard',
      icon: <BarChart className="h-5 w-5" />,
      path: '/dashboard',
      key: 'agent-dashboard',
    },
  ];
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Customer Dashboard</h2>
      </div>
      
      <nav className="px-3 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              <Link
                to={item.path}
                className={`
                  flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${isActive(item.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
          
          <li className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DashboardSidebar;