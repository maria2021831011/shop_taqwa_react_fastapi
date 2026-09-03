import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Shield, 
  Truck, 
  Award, 
  Users, 
  ArrowRight,
  Star,
  Clock,
  Tag,
  Phone,
  MapPin,
  Mail,
  ChevronRight
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  const _slides = [
    {
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&auto=format&fit=crop",
      title: "Premium Electronics & Gadgets",
      subtitle: "Up to 60% OFF on Latest Technology"
    },
    {
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1920&auto=format&fit=crop",
      title: "Home Appliances Collection",
      subtitle: "Smart Living Made Affordable"
    },
    {
      image: "https://images.unsplash.com/photo-1607082352121-9c7d0a610d3a?w=1920&auto=format&fit=crop",
      title: "Fashion & Lifestyle",
      subtitle: "Trendy Products at Unbeatable Prices"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Scroll progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledPercent = (winScroll / height) * 100;
      const progressBar = document.getElementById("home-scroll-progress");
      if (progressBar) {
        progressBar.style.width = scrolledPercent + "%";
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const features = [
    {
      icon: <Shield size={32} />,
      title: "100% Authentic Products",
      description: "Guaranteed genuine products with warranty"
    },
    {
      icon: <Truck size={32} />,
      title: "Fast Delivery",
      description: "Same-day delivery in Dhaka, 2-3 days nationwide"
    },
    {
      icon: <Award size={32} />,
      title: "Best Price Guarantee",
      description: "Lowest prices or we match the difference"
    },
    {
      icon: <Users size={32} />,
      title: "24/7 Support",
      description: "Round-the-clock customer service"
    }
  ];

  const categories = [
    { name: "Electronics", items: 1254, color: "home-cat-1" },
    { name: "Home Appliances", items: 892, color: "home-cat-2" },
    { name: "Fashion", items: 1567, color: "home-cat-3" },
    { name: "Groceries", items: 754, color: "home-cat-4" },
    { name: "Beauty", items: 643, color: "home-cat-5" },
    { name: "Sports", items: 432, color: "home-cat-6" }
  ];

  const testimonials = [
    {
      name: "Rahim Ahmed",
      role: "Regular Customer",
      comment: "Best prices in town! Been shopping here for 3 years.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop"
    },
    {
      name: "Fatima Begum",
      role: "Business Owner",
      comment: "Quality products and excellent customer service. Highly recommended!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&auto=format&fit=crop"
    },
    {
      name: "Kamal Hossain",
      role: "Tech Enthusiast",
      comment: "Genuine electronics at amazing prices. My go-to shop for gadgets.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop"
    }
  ];

  return (
    <div className="home-wrapper">
      {/* Scroll Progress Bar */}
      <div id="home-scroll-progress" className="home-scroll-progress"></div>
      
      {/* Navigation Bar */}
      <nav className={`home-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="home-nav-container">
          <div className="home-brand">
            <ShoppingBag size={32} className="home-brand-icon" />
            <div>
              <h1 className="home-brand-title">Taqwa Discount Shop</h1>
              <p className="home-brand-tagline">Quality Products, Unbeatable Prices</p>
            </div>
          </div>
          
          <div className="home-nav-links">
            <Link to="/" className="home-nav-link active">Home</Link>
            <Link to="/products" className="home-nav-link">Products</Link>
            <Link to="/categories" className="home-nav-link">Categories</Link>
            <Link to="/about" className="home-nav-link">About</Link>
            <Link to="/contact" className="home-nav-link">Contact</Link>
          </div>
          
          <div className="home-nav-actions">
            <Link to="/login" className="home-login-btn">
              Sign In
            </Link>
            <Link to="/register" className="home-register-btn">
              Join Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="home-hero-background"></div>
        <div className="home-hero-content">
          <div className="home-hero-badge">🎉 Special Launch Offer</div>
          <h1 className="home-hero-title">Premium Shopping Experience at Taqwa Discount Shop</h1>
          <p className="home-hero-subtitle">
            Discover amazing products at unbeatable prices. Quality guaranteed with 
            24/7 customer support and fast delivery across Bangladesh.
          </p>
          
          {/* Special Launch Offer Section */}
          <div className="home-special-offer">
            <div className="home-offer-header">
              <div className="home-offer-icon">🔥</div>
              <h3>Grocery Launch Offer</h3>
            </div>
            
            <div className="home-offer-timer">
              <div className="home-timer-item">
                <div className="home-timer-number">24</div>
                <div className="home-timer-label">Hours</div>
              </div>
              <div className="home-timer-item">
                <div className="home-timer-number">45</div>
                <div className="home-timer-label">Mins</div>
              </div>
              <div className="home-timer-item">
                <div className="home-timer-number">30</div>
                <div className="home-timer-label">Secs</div>
              </div>
            </div>
            
            <div className="home-foods-grid">
              <div className="home-food-item">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop" 
                  alt="Fresh Vegetables"
                />
                <div className="home-food-overlay">
                  <div className="home-food-name">Fresh Veg</div>
                  <div className="home-food-price">৳ 120/kg</div>
                </div>
              </div>
              
              <div className="home-food-item">
                <img 
                  src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop" 
                  alt="Fresh Fruits"
                />
                <div className="home-food-overlay">
                  <div className="home-food-name">Seasonal Fruits</div>
                  <div className="home-food-price">৳ 180/kg</div>
                </div>
              </div>
              
              <div className="home-food-item">
                <img 
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w-400&auto=format&fit=crop" 
                  alt="Rice & Grains"
                />
                <div className="home-food-overlay">
                  <div className="home-food-name">Rice</div>
                  <div className="home-food-price">৳ 80/kg</div>
                </div>
              </div>
              
              <div className="home-food-item">
                <img 
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop" 
                  alt="Spices"
                />
                <div className="home-food-overlay">
                  <div className="home-food-name">Spices</div>
                  <div className="home-food-price">৳ 250/kg</div>
                </div>
              </div>
              
           
              
              <div className="home-food-item">
                <img 
                  src="https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=400&auto=format&fit=crop" 
                  alt="Beverages"
                />
                <div className="home-food-overlay">
                  <div className="home-food-name">Drinks</div>
                  <div className="home-food-price">৳ 60</div>
                </div>
              </div>
            </div>
            
            <Link to="/products" className="home-offer-btn">
              Grab Offer Now - 30% OFF 🛒
            </Link>
          </div>
          
          <div className="home-hero-actions">
            <Link to="/register" className="home-hero-primary">
              Start Shopping <ArrowRight size={20} />
            </Link>
            <Link to="/products" className="home-hero-secondary">
              Browse Products
            </Link>
          </div>
          
          {/* Hero image container */}
          <div className="home-hero-image-container">
            <div className="home-hero-image"></div>
            <div className="home-hero-image-overlay">
              <div className="home-hero-image-content">
                <h3>Taqwa Discount Shop Experience</h3>
                <p>Visit our physical store for an immersive shopping experience</p>
              </div>
            </div>
          </div>
          
          <div className="home-hero-stats">
            <div className="home-hero-stat">
              <div className="home-hero-stat-value">5K+</div>
              <div className="home-hero-stat-label">Happy Customers</div>
            </div>
            <div className="home-hero-stat">
              <div className="home-hero-stat-value">1K+</div>
              <div className="home-hero-stat-label">Products</div>
            </div>
            <div className="home-hero-stat">
              <div className="home-hero-stat-value">98%</div>
              <div className="home-hero-stat-label">Satisfaction</div>
            </div>
            <div className="home-hero-stat">
              <div className="home-hero-stat-value">24/7</div>
              <div className="home-hero-stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features-section">
        <div className="home-section-header">
          <h2>Why Choose Taqwa Discount Shop?</h2>
          <p>Experience shopping like never before</p>
        </div>
        
        <div className="home-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="home-feature-card">
              <div className="home-feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="home-categories-section">
        <div className="home-section-header">
          <h2>Shop by Category</h2>
          <p>Explore thousands of products across categories</p>
        </div>
        
        <div className="home-categories-grid">
          {categories.map((category, index) => (
            <Link to="/categories" key={index} className="home-category-card">
              <div className={`home-category-icon ${category.color}`}>
                <ShoppingBag size={24} />
              </div>
              <div className="home-category-content">
                <h3>{category.name}</h3>
                <p>{category.items.toLocaleString()} items</p>
              </div>
              <ChevronRight size={20} className="home-category-arrow" />
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="home-testimonials-section">
        <div className="home-section-header">
          <h2>What Our Customers Say</h2>
          <p>Join thousands of satisfied shoppers</p>
        </div>
        
        <div className="home-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="home-testimonial-card">
              <div className="home-testimonial-header">
                <img src={testimonial.image} alt={testimonial.name} className="home-testimonial-avatar" />
                <div className="home-testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
                <div className="home-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < testimonial.rating ? "#FFD700" : "#E2E8F0"} />
                  ))}
                </div>
              </div>
              <p className="home-testimonial-comment">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta-section">
        <div className="home-cta-content">
          <h2>Start Saving Today!</h2>
          <p>Join our community of smart shoppers and enjoy exclusive discounts</p>
          <div className="home-cta-buttons">
            <Link to="/register" className="home-cta-primary">
              Create Free Account <ArrowRight size={20} />
            </Link>
            <Link to="/products" className="home-cta-secondary">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-grid">
          <div className="home-footer-col">
            <div className="home-footer-brand">
              <ShoppingBag size={32} />
              <h3>Taqwa Discount Shop</h3>
            </div>
            <p>Your trusted destination for quality products at unbeatable prices since 2015.</p>
            <div className="home-social-links">
              <a href="#" className="home-social-link">FB</a>
              <a href="#" className="home-social-link">TW</a>
              <a href="#" className="home-social-link">IG</a>
              <a href="#" className="home-social-link">LI</a>
            </div>
          </div>
          
          <div className="home-footer-col">
            <h4>Quick Links</h4>
            <Link to="/products">All Products</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          
          <div className="home-footer-col">
            <h4>Contact Info</h4>
            <div className="home-contact-item">
              <MapPin size={16} />
              <span>Taqwa Discount Shop, Dhaka, Bangladesh</span>
            </div>
            <div className="home-contact-item">
              <Phone size={16} />
              <span>+880 1712 345678</span>
            </div>
            <div className="home-contact-item">
              <Mail size={16} />
              <span>info@taqwa-shop.com</span>
            </div>
          </div>
          
          <div className="home-footer-col">
            <h4>Business Hours</h4>
            <div className="home-hours-item">
              <Clock size={16} />
              <div>
                <p><strong>Mon-Sat:</strong> 9:00 AM - 10:00 PM</p>
                <p><strong>Sunday:</strong> 10:00 AM - 8:00 PM</p>
              </div>
            </div>
            <div className="home-payment-methods">
              <span>We Accept:</span>
              <div className="home-payment-icons">
                <span className="home-payment-icon">CASH</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="home-footer-bottom">
          <p>© 2024 Taqwa Discount Shop. All rights reserved.</p>
          <div className="home-footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/refund">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
