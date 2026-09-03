import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import "./notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/purchase/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Get latest 5 orders as notifications
        setNotifications(data.slice(0, 5));
        setError(null);
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="notifications-header">
          <h2>🔔 Notifications</h2>
        </div>
        <div className="loading">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>🔔 Purchase Order Notifications</h2>
        <button onClick={fetchNotifications} className="refresh-btn" title="Refresh">
          🔄
        </button>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={48} />
          <p>No new notifications</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div key={notif.id} className="notification-card">
              <div className="notification-content">
                <div className="notification-icon">🛒</div>
                <div className="notification-text">
                  <h3>Order #{String(notif.id).padStart(3, "0")} Received</h3>
                  <p className="product-name">{notif.product_name}</p>
                  <div className="notification-meta">
                    <span className="badge">📦 {notif.quantity} units</span>
                    <span className="badge">💰 ₦{(notif.quantity * notif.purchase_price).toFixed(2)}</span>
                    <span className="badge">📍 {notif.shop_location || "N/A"}</span>
                  </div>
                  <p className="timestamp">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                className="dismiss-btn"
                onClick={() => dismissNotification(notif.id)}
                title="Dismiss"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
