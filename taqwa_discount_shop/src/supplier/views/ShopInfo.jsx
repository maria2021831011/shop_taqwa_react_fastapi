import { MapPin, Phone, Mail, Clock, Users, Store } from "lucide-react";
import shopImage from "../../download.jpg";
import "./shopinfo.css";

const ShopInfo = () => {
  const shopDetails = {
    name: "Taqwa Discount Shop",
    tagline: "Your Trusted Shopping Destination",
    address: "Akhalia, Sylhet, Bangladesh",
    phone: "017xxxxxxxx",
    email: "shop@taqwa.com",
    description:
      "Taqwa Discount Shop is a leading retail store dedicated to providing quality products at affordable prices. We serve thousands of customers daily with exceptional service and a wide variety of products.",
    hours: {
      weekday: "9:00 AM - 10:00 PM",
      weekend: "10:00 AM - 11:00 PM",
    },
    stats: {
      customers: "10,000+",
      products: "500+",
      staff: "25+",
    },
    highlights: [
      "🎯 Best Prices in the Market",
      "📦 Wide Product Selection",
      "👥 Dedicated Customer Service",
      "🚚 Fast Delivery Available",
      "💳 Multiple Payment Options",
      "⭐ Loyalty Rewards Program",
    ],
  };

  return (
    <div className="shopinfo-container">
      {/* Hero Section with Image */}
      <div className="shop-hero">
        <div className="shop-image-wrapper">
          <img src={shopImage} alt="Taqwa Discount Shop" className="shop-image" />
          <div className="image-overlay"></div>
        </div>
        <div className="hero-content">
          <h1>{shopDetails.name}</h1>
          <p className="tagline">{shopDetails.tagline}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="shopinfo-content">
        {/* Description Section */}
        <section className="description-section">
          <h2>About Us</h2>
          <p>{shopDetails.description}</p>
        </section>

        {/* Contact Information */}
        <section className="contact-section">
          <h2>Contact Information</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-icon">
                <MapPin size={24} />
              </div>
              <div className="contact-text">
                <h3>Address</h3>
                <p>{shopDetails.address}</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Phone size={24} />
              </div>
              <div className="contact-text">
                <h3>Phone</h3>
                <p>{shopDetails.phone}</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Mail size={24} />
              </div>
              <div className="contact-text">
                <h3>Email</h3>
                <p>{shopDetails.email}</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Clock size={24} />
              </div>
              <div className="contact-text">
                <h3>Business Hours</h3>
                <p>
                  <strong>Weekdays:</strong> {shopDetails.hours.weekday}
                </p>
                <p>
                  <strong>Weekends:</strong> {shopDetails.hours.weekend}
                </p>
              </div>
            </div>
          </div>
        </section>

  

        {/* Highlights */}
        <section className="highlights-section">
          <h2>Why Choose Us?</h2>
          <div className="highlights-grid">
            {shopDetails.highlights.map((highlight, index) => (
              <div key={index} className="highlight-item">
                <p>{highlight}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Map Section */}
        {/* Map Section */}
<section className="map-section">
  <h2>Location</h2>
  <div className="map-wrapper">
    <iframe
      title="Shop Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.935032035328!2d91.8732896749364!3d24.861564344620577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3751ab3af7c3c0a1%3A0xfd3ec6d8491af9a8!2sAkhalia%2C%20Sylhet!5e0!3m2!1sen!2sbd!4v1647351234567!5m2!1sen!2sbd"
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="map-iframe"
    ></iframe>
  </div>
</section>
      </div>
    </div>
  );
};

export default ShopInfo;
