import { useState, useEffect } from "react";
import "./orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/purchase/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setError(null);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <h2>Purchase Orders</h2>
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>📦 Purchase Orders from Manager</h2>
        <button onClick={fetchOrders} className="refresh-btn">🔄 Refresh</button>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No purchase orders yet</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>{order.product_name}</h3>
                <span className="order-id">PO-{String(order.id).padStart(3, "0")}</span>
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <span className="label">Quantity:</span>
                  <span className="value">{order.quantity} units</span>
                </div>
                <div className="detail-row">
                  <span className="label">Unit Price:</span>
                  <span className="value">₦{order.purchase_price.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Total:</span>
                  <span className="value total">
                    ₦{(order.quantity * order.purchase_price).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="order-meta">
                <div className="meta-item">
                  <span className="meta-label">Shop Location:</span>
                  <span>Akhalia,sylhet</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Ordered on:</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
