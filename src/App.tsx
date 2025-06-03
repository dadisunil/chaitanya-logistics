import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import TrackingPage from './pages/TrackingPage';
import CalculatorPage from './pages/CalculatorPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import UserOrdersPage from './pages/UserOrdersPage';

const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes in ms

function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showTimeoutModal, setShowTimeoutModal] = React.useState(false);
  const idleTimer = React.useRef<NodeJS.Timeout | null>(null);

  // Reset timer on user activity
  React.useEffect(() => {
    if (!isAuthenticated) return;
    const resetTimer = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        logout();
        setShowTimeoutModal(true);
      }, IDLE_TIMEOUT);
    };
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [isAuthenticated, logout]);

  // Modal for timeout
  const TimeoutModal = () => (
    showTimeoutModal ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
          <h2 className="text-xl font-bold mb-4">Session Timed Out</h2>
          <p className="mb-6">You have been logged out due to inactivity. Please log in again to continue.</p>
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              setShowTimeoutModal(false);
              navigate('/login');
            }}
          >
            Log In
          </button>
        </div>
      </div>
    ) : null
  );

  return (
    <ErrorBoundary>
      <>
        <TimeoutModal />
        <Routes>
          {/* Main layout route */}
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="tracking" element={<TrackingPage />} />
            <Route path="calculator" element={<CalculatorPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="user/orders" element={<UserOrdersPage />} />

            {/* Admin-only routes */}
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </>
    </ErrorBoundary>
  );
}

export default App;