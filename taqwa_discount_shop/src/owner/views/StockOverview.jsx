/*import { useEffect, useState } from "react";

const StockOverview = () => {
  const [lowStock, setLowStock] = useState([]);
  const [healthyStock, setHealthyStock] = useState([]);

  const fetchStock = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/owner/stock", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const products = await res.json();

      // Separate low stock (< 10) and healthy stock
      const low = products.filter(p => p.stock < 10).map(p => p.name);
      const healthy = products.filter(p => p.stock >= 10).map(p => p.name);

      setLowStock(low);
      setHealthyStock(healthy);
    } catch (err) {
      console.error("Error fetching stock:", err);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  if (!lowStock && !healthyStock) return <p>Loading...</p>;

  return (
    <div>
      <h2>Stock Overview</h2>

      {lowStock.length > 0 && (
        <div className="card warning">
          Low Stock: {lowStock.join(", ")}
        </div>
      )}
      {healthyStock.length > 0 && (
        <div className="card">
          Healthy Stock: {healthyStock.join(", ")}
        </div>
      )}
    </div>
  );
};

export default StockOverview;
*/
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Package, AlertCircle } from "lucide-react";
import "./StockOverview.css";

const StockOverview = () => {
  const [lowStock, setLowStock] = useState([]);
  const [healthyStock, setHealthyStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStock = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/owner/stock", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const products = await res.json();

      // Separate low stock (< 10) and healthy stock
      const low = products.filter(p => p.stock < 10);
      const healthy = products.filter(p => p.stock >= 10);

      setLowStock(low);
      setHealthyStock(healthy);
    } catch (err) {
      console.error("Error fetching stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const getProductIcon = (productName) => {
    const icons = ["📦", "🥫", "🧃", "🍫", "🧼", "🛒", "🧴", "🍪", "☕", "🧻"];
    const index = productName.length % icons.length;
    return icons[index];
  };

  if (loading) {
    return (
      <div className="stock-container">
        <h2>Stock Overview</h2>
        <div className="loading-skeleton">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }

  const totalLowStock = lowStock.length;
  const totalHealthyStock = healthyStock.length;
  const totalProducts = totalLowStock + totalHealthyStock;

  return (
    <div className="stock-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Stock Overview</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
          <Package size={16} />
          <span>{totalProducts} Total Products</span>
        </div>
      </div>

      {/* Urgent Alert for Low Stock */}
      {totalLowStock > 0 && (
        <div className="urgent-alert">
          <AlertTriangle size={24} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', marginBottom: '4px' }}>Action Required!</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {totalLowStock} product{totalLowStock !== 1 ? 's' : ''} running low on stock. Please restock immediately.
            </div>
          </div>
        </div>
      )}

      <div className="stock-dashboard">
        {/* Low Stock Card */}
        {totalLowStock > 0 && (
          <div className="stock-card warning">
            <div className="card-header">
              <div className="card-title">Low Stock Alert</div>
              <div className="card-count">{totalLowStock} Items</div>
            </div>
            
            <div className="status-indicator">
              <div className="status-dot"></div>
              <div className="status-text">Critical - Restock Needed</div>
            </div>

            <div style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '16px' }}>
              Products with less than 10 units in stock
            </div>

            <div className="product-list">
              {lowStock.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-icon">
                    {getProductIcon(product.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                      Stock: <strong style={{ color: '#dc2626' }}>{product.stock} units</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Healthy Stock Card */}
        {totalHealthyStock > 0 && (
          <div className="stock-card healthy">
            <div className="card-header">
              <div className="card-title">Healthy Stock</div>
              <div className="card-count">{totalHealthyStock} Items</div>
            </div>
            
            <div className="status-indicator">
              <div className="status-dot"></div>
              <div className="status-text">Good - Well Stocked</div>
            </div>

            <div style={{ fontSize: '14px', color: '#064e3b', marginBottom: '16px' }}>
              Products with 10+ units in stock
            </div>

            <div className="product-list">
              {healthyStock.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-icon">
                    {getProductIcon(product.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{product.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                      Stock: <strong style={{ color: '#059669' }}>{product.stock} units</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stock Summary */}
      <div className="stock-summary">
        <div className="summary-item">
          <div className="summary-label">Total Products</div>
          <div className="summary-value">{totalProducts}</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-label">Low Stock Items</div>
          <div className="summary-value warning">{totalLowStock}</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-label">Healthy Stock Items</div>
          <div className="summary-value healthy">{totalHealthyStock}</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-label">Health Status</div>
          <div className="summary-value" style={{ 
            color: totalLowStock === 0 ? '#10b981' : totalLowStock <= 3 ? '#f59e0b' : '#ef4444',
            fontSize: '20px'
          }}>
            {totalLowStock === 0 ? 'Excellent' : totalLowStock <= 3 ? 'Moderate' : 'Critical'}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {totalProducts === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <p>No products found in inventory</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>Add products to see stock overview</p>
        </div>
      )}
    </div>
  );
};

export default StockOverview;