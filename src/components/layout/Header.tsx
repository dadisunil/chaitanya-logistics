import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Truck, 
  Package, 
  MapPin, 
  Calculator, 
  Calendar, 
  Mail, 
  Menu, 
  X, 
  User, 
  LogOut 
} from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when changing routes
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
      isActive 
        ? 'text-accent-600' 
        : 'text-gray-700 hover:text-accent-500'
    }`;
  
  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-3' 
          : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
{/*           <Truck className="text-primary-600 h-8 w-8" />
            <span className="text-xl font-bold text-primary-950">LogiTrack</span>
*/}
            <img src="/ck_logo.png" alt="Logo" className="h-8 w-24" />
            <span className="text-xl font-bold text-primary-950">Chaitanya Logistics</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" className={navLinkClasses}>
              <span>Home</span>
            </NavLink>
            <NavLink to="/services" className={navLinkClasses}>
              <Package className="mr-1 h-4 w-4" />
              <span>Services</span>
            </NavLink>
            <NavLink to="/tracking" className={navLinkClasses}>
              <MapPin className="mr-1 h-4 w-4" />
              <span>Tracking</span>
            </NavLink>
            <NavLink to="/calculator" className={navLinkClasses}>
              <Calculator className="mr-1 h-4 w-4" />
              <span>Calculator</span>
            </NavLink>
            <NavLink to="/booking" className={navLinkClasses}>
              <Calendar className="mr-1 h-4 w-4" />
              <span>Booking</span>
            </NavLink>
            <NavLink to="/contact" className={navLinkClasses}>
              <Mail className="mr-1 h-4 w-4" />
              <span>Contact</span>
            </NavLink>
          </nav>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="mr-2">
                  <Link
                    to={
                      user?.user_type === 'admin'
                        ? '/admin'
                        : user?.user_type === 'agent'
                        ? '/dashboard'
                        : user?.user_type === 'client'
                        ? '/user/orders'
                        : '/dashboard'
                    }
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <User className="h-4 w-4 mr-1" />
                    <span>{user?.name}</span>
                  </Link>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-800" />
            ) : (
              <Menu className="h-6 w-6 text-gray-800" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100 py-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="flex flex-col space-y-3">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/services" className={navLinkClasses}>
              <Package className="mr-2 h-4 w-4" />
              Services
            </NavLink>
            <NavLink to="/tracking" className={navLinkClasses}>
              <MapPin className="mr-2 h-4 w-4" />
              Tracking
            </NavLink>
            <NavLink to="/calculator" className={navLinkClasses}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculator
            </NavLink>
            <NavLink to="/booking" className={navLinkClasses}>
              <Calendar className="mr-2 h-4 w-4" />
              Booking
            </NavLink>
            <NavLink to="/contact" className={navLinkClasses}>
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </NavLink>
          </nav>
          
          <div className="mt-6 flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <Link 
                  to={
                    user?.user_type === 'admin' ? '/admin' :
                    user?.user_type === 'agent' ? '/dashboard' :
                    user?.user_type === 'client' ? '/user/orders' : '/dashboard'
                  } 
                  className="btn btn-primary"
                >
                  <User className="mr-2 h-4 w-4" />
                  {user?.user_type === 'admin' ? 'Admin Panel' : user?.user_type === 'client' ? 'My Orders' : 'Dashboard'}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;