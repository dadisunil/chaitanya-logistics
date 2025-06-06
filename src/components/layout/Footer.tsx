import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-950 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
{/*              <Truck className="text-white h-6 w-6" />
              <span className="text-xl font-bold text-white">LogiTrack</span>
*/}
              <img src="/ck_logo.png" alt="Logo" className="h-8 w-24" />
              <span className="text-xl font-bold text-primary-950">Chaitanya Logistics</span>
              </div>
            <p className="text-sm mb-4">
              Providing reliable and efficient logistics solutions since 2020. 
              We connect businesses to customers with speed and reliability.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="text-gray-400 hover:text-white transition-colors">
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-gray-400 hover:text-white transition-colors">
                  Rate Calculator
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-white transition-colors">
                  Book a Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-white transition-colors">
                <Link to="/services">Freight Forwarding</Link>
              </li>
              <li className="text-gray-400 hover:text-white transition-colors">
                <Link to="/services">Express Delivery</Link>
              </li>
              <li className="text-gray-400 hover:text-white transition-colors">
                <Link to="/services">Road Transportation</Link>
              </li>
              <li className="text-gray-400 hover:text-white transition-colors">
                <Link to="/services">Air Freight</Link>
              </li>
              <li className="text-gray-400 hover:text-white transition-colors">
                <Link to="/services">Ocean Freight</Link>
              </li>
              <li className="text-gray-400 hover:text-white transition-colors">
                <Link to="/services">Warehouse Management</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="text-gray-400 h-5 w-5 mt-0.5" />
                <span>Raipur, City Center, Chhattisgarh</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400 h-5 w-5" />
                <span>+91 8319058757</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400 h-5 w-5" />
                <span>info@chaitanyalogistics.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="border-gray-800 my-8" />
        
        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {currentYear} Chaitanya Logistics. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;