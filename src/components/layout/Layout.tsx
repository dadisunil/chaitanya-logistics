import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import AdminSidebar from '../dashboard/AdminSidebar';

const Layout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {isDashboardPage && isAuthenticated ? (
          <div className="flex">
            <DashboardSidebar />
            <div className="flex-1 p-6">
              <Outlet />
            </div>
          </div>
        ) : isAdminPage && isAdmin ? (
          <div className="flex">
            <AdminSidebar />
            <div className="flex-1 p-6">
              <Outlet />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;