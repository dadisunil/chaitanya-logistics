import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  Calendar, 
  Settings, 
  BarChart,
  MessageSquare,
  TruckIcon
} from 'lucide-react';

export default function AdminSidebar() {
  return (
    <aside className="bg-white w-64 min-h-screen p-4 border-r border-gray-200">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 px-2 py-3">
          <TruckIcon className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Admin Panel</span>
        </div>
        
        <nav className="space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <BarChart className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Users className="h-5 w-5" />
            <span>Users</span>
          </Link>

          <Link
            to="/admin/shipments"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Package className="h-5 w-5" />
            <span>Shipments</span>
          </Link>

          <Link
            to="/admin/bookings"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Calendar className="h-5 w-5" />
            <span>Bookings</span>
          </Link>

          <Link
            to="/admin/messages"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
          </Link>

          <Link
            to="/admin/settings"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}