import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Package, 
  BarChart, 
  Clock, 
  Shield, 
  Globe, 
  TrendingUp,
  PackageCheck,
  Ship,
  Plane,
  Building,
  ArrowRight
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const PHRASES = [
  "Efficient Logistics Solutions",
  "On-Time Delivery, Every Time",
  "Seamless Supply Chain Management",
  "Real-Time Shipment Tracking",
  "Pan-India & Global Reach",
  "Trusted by Leading Businesses",
];

const HomePage: React.FC = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % PHRASES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-950 to-primary-900 text-white">
        <div className="container-custom py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeIn">
              <div className="relative h-24 md:h-28 flex items-center">
                <div
                  key={currentPhrase}
                  className="absolute w-full left-0 top-0 flex justify-start items-center animate-slide-in-flash"
                  style={{
                    animation: 'slideInFlash 1.2s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-accent-500 via-primary-400 to-accent-600 bg-clip-text text-transparent drop-shadow-lg">
                    {PHRASES[currentPhrase]}
                  </h1>
                </div>
                <style>
                  {`
                    @keyframes slideInFlash {
                      0% {
                        opacity: 0;
                        transform: translateX(-60%) scale(0.95);
                        filter: brightness(1.2) drop-shadow(0 0 10px #fff);
                      }
                      60% {
                        opacity: 1;
                        transform: translateX(0) scale(1.05);
                        filter: brightness(2) drop-shadow(0 0 20pxrgb(13, 12, 7));
                      }
                      100% {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                        filter: brightness(1.2) drop-shadow(0 0 10px #fff);
                      }
                    }
                    .animate-slide-in-flash {
                      animation: slideInFlash 1.2s cubic-bezier(0.4,0,0.2,1);
                    }
                  `}
                </style>
              </div>
              <p className="text-lg mb-8 text-gray-200 max-w-lg">
                Fast, reliable, and cost-effective shipping and logistics services tailored to your needs. Track shipments, calculate rates, and book services online.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/tracking" className="btn btn-accent">
                  Track Shipment
                </Link>
                <Link to="/booking" className="btn bg-white text-primary-950 hover:bg-gray-100">
                  Book Now
                </Link>
              </div>
            </div>
            <div className="relative w-full lg:w-1/1.5 h-90 rounded-lg overflow-hidden border border-gray-300 shadow-lg mt-16 md:mt-20">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop
                className="h-96 w-full"
              >
                <SwiperSlide>
                  <img src="/warehouse.webp" alt="Logo" className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/hero.jpg" alt="Hero Image" className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/chaitanya.PNG" alt="Logistics operations" className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
                    alt="Logistics dashboard"
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/package.jpg" alt="Warehouse" className="w-full h-full object-cover" />
                </SwiperSlide>
              </Swiper>

              <style>
                {`
                  .swiper-button-next,
                  .swiper-button-prev {
                    color: #ffffff;
                    background-color: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }

                  .swiper-button-next:hover,
                  .swiper-button-prev:hover {
                    background-color: rgba(0, 0, 0, 0.8);
                  }

                  .swiper-pagination-bullet {
                    background-color: #ffffff;
                    opacity: 0.7;
                  }

                  .swiper-pagination-bullet-active {
                    background-color: #000000;
                    opacity: 1;
                  }
                `}
              </style>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Logistics Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive logistics solutions designed to streamline your supply chain and ensure timely delivery of your goods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="card hover:shadow-lg transition-shadow animate-slideUp">
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Truck className="text-primary-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Road Freight</h3>
              <p className="text-gray-600 mb-4">
                Reliable road transportation services with nationwide coverage and flexible delivery options.
              </p>
              <Link to="/services" className="text-primary-600 font-medium flex items-center hover:text-primary-700">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="card hover:shadow-lg transition-shadow animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Ship className="text-primary-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Ocean Freight</h3>
              <p className="text-gray-600 mb-4">
                International ocean shipping solutions for businesses of all sizes, with competitive rates.
              </p>
              <Link to="/services" className="text-primary-600 font-medium flex items-center hover:text-primary-700">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Service 3 */}
            <div className="card hover:shadow-lg transition-shadow animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Plane className="text-primary-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Air Freight</h3>
              <p className="text-gray-600 mb-4">
                Express air freight services for time-sensitive shipments, with global coverage.
              </p>
              <Link to="/services" className="text-primary-600 font-medium flex items-center hover:text-primary-700">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Service 4 */}
            <div className="card hover:shadow-lg transition-shadow animate-slideUp">
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Package className="text-primary-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Express Delivery</h3>
              <p className="text-gray-600 mb-4">
                Fast and reliable express delivery services for urgent shipments with real-time tracking.
              </p>
              <Link to="/services" className="text-primary-600 font-medium flex items-center hover:text-primary-700">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Service 5 */}
            <div className="card hover:shadow-lg transition-shadow animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <PackageCheck className="text-primary-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Freight Forwarding</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive freight forwarding services to manage your international shipping needs.
              </p>
              <Link to="/services" className="text-primary-600 font-medium flex items-center hover:text-primary-700">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Service 6 */}
            <div className="card hover:shadow-lg transition-shadow animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="p-3 bg-primary-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Building className="text-primary-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Warehouse Solutions</h3>
              <p className="text-gray-600 mb-4">
                Secure warehousing and inventory management solutions to optimize your supply chain.
              </p>
              <Link to="/services" className="text-primary-600 font-medium flex items-center hover:text-primary-700">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/services" className="btn btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">Why Choose Our Logistics Services?</h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4">
                    <div className="p-2 bg-primary-100 rounded-full">
                      <Globe className="text-primary-600 h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
                    <p className="text-gray-600">
                      Our extensive network reaches over 150 countries, providing you with global shipping solutions.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="p-2 bg-primary-100 rounded-full">
                      <Clock className="text-primary-600 h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Time-Efficient</h3>
                    <p className="text-gray-600">
                      We optimize routes and processes to ensure your shipments reach their destination on time, every time.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="p-2 bg-primary-100 rounded-full">
                      <Shield className="text-primary-600 h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Secure Handling</h3>
                    <p className="text-gray-600">
                      Your goods are handled with care and tracked in real-time to ensure safe delivery.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="p-2 bg-primary-100 rounded-full">
                      <BarChart className="text-primary-600 h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cost-Effective</h3>
                    <p className="text-gray-600">
                      Competitive pricing and optimized routes help reduce your logistics costs without sacrificing quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
                alt="Logistics dashboard"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-900 text-white py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Streamline Your Logistics?</h2>
            <p className="text-lg mb-8 text-gray-200">
              Join thousands of businesses that trust chaitanyalogistics for their shipping and logistics needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn btn-accent">
                Get Started
              </Link>
              <Link to="/contact" className="btn bg-white text-primary-900 hover:bg-gray-100">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about our logistics services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="card">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex text-accent-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">
                  "chaitanyalogistics has transformed our supply chain with their reliable shipping services. Our delivery times have improved by 30% and our customers are happier than ever."
                </p>
                <div className="flex items-center mt-auto">
                  <div className="mr-3">
                    <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="font-medium text-primary-700">JD</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Brijkishore Pandey</h4>
                    <p className="text-sm text-gray-500">CEO, Tech Innovations</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="card">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex text-accent-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">
                  "As a small e-commerce business, finding cost-effective shipping solutions was a challenge until we found chaitanyalogistics. Their rates are competitive and their service is exceptional."
                </p>
                <div className="flex items-center mt-auto">
                  <div className="mr-3">
                    <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="font-medium text-primary-700">JS</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Janardhan shinde</h4>
                    <p className="text-sm text-gray-500">Owner, Boutique Finds</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="card">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex text-accent-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">
                  "The real-time tracking feature has been a game-changer for our business. We can provide accurate delivery estimates to our customers, improving satisfaction significantly."
                </p>
                <div className="flex items-center mt-auto">
                  <div className="mr-3">
                    <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="font-medium text-primary-700">RJ</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Radhika Jain</h4>
                    <p className="text-sm text-gray-500">Logistics Manager, Global Retail</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Impact in Numbers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've helped thousands of businesses optimize their logistics operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="p-3 bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-primary-600 h-8 w-8" />
              </div>
              <div className="text-4xl font-bold text-primary-700 mb-2">5,000+</div>
              <p className="text-gray-600">Successful Deliveries</p>
            </div>
            
            <div className="card text-center">
              <div className="p-3 bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="text-primary-600 h-8 w-8" />
              </div>
              <div className="text-4xl font-bold text-primary-700 mb-2">15+</div>
              <p className="text-gray-600">States Covered</p>
            </div>
            
            <div className="card text-center">
              <div className="p-3 bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="text-primary-600 h-8 w-8" />
              </div>
              <div className="text-4xl font-bold text-primary-700 mb-2">2.5K+</div>
              <p className="text-gray-600">Packages Delivered</p>
            </div>
            
            <div className="card text-center">
              <div className="p-3 bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-600 h-8 w-8" />
              </div>
              <div className="text-4xl font-bold text-primary-700 mb-2">99.8%</div>
              <p className="text-gray-600">On-Time Delivery Rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;