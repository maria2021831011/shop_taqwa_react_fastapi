import { useEffect, useState } from "react";
import "./LiveStock.css";

const LiveStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, low, out
  const [sortBy, setSortBy] = useState("stock"); // stock, name, price
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch stock data
  const fetchStockData = () => {
    setLoading(true);
    fetch("http://localhost:8000/products/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch stock data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStockData();

    // Auto-refresh every 10 seconds
    const interval = autoRefresh && setInterval(fetchStockData, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter products
  const filteredProducts = products.filter(product => {
    if (filter === "low") return product.stock > 0 && product.stock <= 10;
    if (filter === "out") return product.stock === 0;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "stock") return b.stock - a.stock;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price") return b.price - a.price;
    return 0;
  });

  // Calculate statistics
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  // Determine stock level color
  const getStockStatus = (stock) => {
    if (stock === 0) return "out-of-stock";
    if (stock <= 10) return "low-stock";
    if (stock <= 30) return "medium-stock";
    return "high-stock";
  };

  const getStockPercentage = (stock) => {
    // Assuming max capacity is 100 units
    return Math.min((stock / 100) * 100, 100);
  };

  return (
    <div className="livestock-container">
      {/* Header */}
      <div className="livestock-header">
        <div>
          <h2>📦 Live Stock Management</h2>
          <p className="last-updated">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="header-controls">
          <button
            className={`refresh-btn ${autoRefresh ? "active" : ""}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
            title="Toggle auto-refresh"
          >
            🔄 Auto-Refresh {autoRefresh ? "ON" : "OFF"}
          </button>
          <button className="manual-refresh-btn" onClick={fetchStockData}>
            🔁 Refresh Now
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{totalProducts}</span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <span className="stat-label">Low Stock</span>
            <span className="stat-value">{lowStockCount}</span>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <span className="stat-label">Out of Stock</span>
            <span className="stat-value">{outOfStockCount}</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Stock Value</span>
            <span className="stat-value">৳{totalStockValue.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="all">All Products</option>
            <option value="low">Low Stock (≤10)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
        <div className="sort-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="stock">Stock Quantity</option>
            <option value="name">Product Name</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className="results-info">
          Showing {sortedProducts.length} of {totalProducts} products
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="loading-spinner">Loading stock data...</div>}

      {/* Error State */}
      {error && <div className="error-banner">{error}</div>}

      {/* Products Grid */}
      {!loading && sortedProducts.length > 0 && (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <div key={product.id} className={`product-card ${getStockStatus(product.stock)}`}>
              {/* Stock Status Badge */}
              <div className="stock-badge">
                {product.stock === 0 ? "OUT OF STOCK" : product.stock <= 10 ? "⚠️ LOW STOCK" : "✓ IN STOCK"}
              </div>

              {/* Product Info */}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">৳{product.price.toFixed(2)}</p>
              </div>

              {/* Stock Progress Bar */}
              <div className="stock-bar-wrapper">
                <div className="stock-bar">
                  <div
                    className="stock-bar-fill"
                    style={{
                      width: `${getStockPercentage(product.stock)}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Stock Details */}
              <div className="stock-details">
                <div className="stock-item">
                  <span className="stock-label">Stock:</span>
                  <span className="stock-count">{product.stock} units</span>
                </div>
                <div className="stock-item">
                  <span className="stock-label">Value:</span>
                  <span className="stock-value">৳{(product.price * product.stock).toFixed(2)}</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="status-indicator">
                <span className="status-dot"></span>
                <span className="status-text">
                  {product.stock === 0 ? "Need Restock" : product.stock <= 10 ? "Low" : "Good"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && sortedProducts.length === 0 && (
        <div className="empty-state">
          <p>📭 No products found</p>
          {filter !== "all" && <p>Try adjusting your filters</p>}
        </div>
      )}
    </div>
  );
};

export default LiveStock;
