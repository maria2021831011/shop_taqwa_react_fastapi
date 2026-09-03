import { useEffect, useState } from "react";
import axios from "axios";
import "./sales.css";

const SalesSummary = () => {
  const [summary, setSummary] = useState({
    total_orders: 0,
    total_sales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [animatedOrders, setAnimatedOrders] = useState(0);
  const [animatedSales, setAnimatedSales] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:8000/sales/summary/today", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => {
      setSummary(res.data);
      setLoading(false);
      
      // Animate numbers
      animateValue(animatedOrders, res.data.total_orders, 1000, setAnimatedOrders);
      animateValue(animatedSales, res.data.total_sales, 1000, setAnimatedSales);
    })
    .catch(() => setLoading(false));
  }, []);

  const animateValue = (start, end, duration, setValue) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      setValue(value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  // Create sparkle elements
  const createSparkles = () => {
    const sparkles = [];
    for (let i = 0; i < 8; i++) {
      sparkles.push(
        <div
          key={i}
          className="sparkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      );
    }
    return sparkles;
  };

  return (
    <div className="sales-summary">
      {createSparkles()}
      
      <h2>
        <span className="icon">📊</span>
        Today's Performance Dashboard
      </h2>

      <div className="summary-cards">
        <div className="card">
          <h4>
            <span className="icon">📦</span>
            Total Orders Processed
          </h4>
          {loading ? (
            <div className="loading" style={{ height: '50px', borderRadius: '8px' }}></div>
          ) : (
            <p>{animatedOrders.toLocaleString()}</p>
          )}
          <div className="card-subtitle">Tracked in real-time</div>
        </div>

        <div className="card">
          <h4>
            <span className="icon">💰</span>
            Total Revenue Generated
          </h4>
          {loading ? (
            <div className="loading" style={{ height: '50px', borderRadius: '8px' }}></div>
          ) : (
            <p>{formatCurrency(animatedSales)}</p>
          )}
          <div className="card-subtitle">Today's earnings</div>
        </div>
      </div>

      <div className="performance-footer">
        <div className="trend-indicator">
          <span className="trend-icon">📈</span>
          <span className="trend-text">Live updates every 60 seconds</span>
        </div>
        <div className="timestamp">
          Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;