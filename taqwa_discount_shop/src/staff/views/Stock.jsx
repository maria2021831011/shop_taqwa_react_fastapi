import { useEffect, useState } from "react";
import axios from "axios";
import './stock.css';

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: ""
  });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://shop-taqwa-react-fastapi-2.onrender.com/staff/stock");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching stock:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const addProduct = async () => {
    if (!form.name.trim() || !form.price || !form.stock) {
      setSuccessMsg("Please fill all fields!");
      setTimeout(() => setSuccessMsg(""), 3000);
      return;
    }

    try {
      await axios.post("https://shop-taqwa-react-fastapi-2.onrender.com/staff/stock", {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock)
      });
      setForm({ name: "", price: "", stock: "" });
      setSuccessMsg("✅ Product added successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchStock();
    } catch (error) {
      setSuccessMsg("❌ Error adding product");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const updateQty = async (id, type) => {
    try {
      const url = type === "inc" 
        ? `/increase/${id}?qty=1`
        : `/decrease/${id}?qty=1`;

      await axios.patch("https://shop-taqwa-react-fastapi-2.onrender.com/staff/stock" + url);
      fetchStock();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await axios.delete(`https://shop-taqwa-react-fastapi-2.onrender.com/staff/stock/${id}`);
      setSuccessMsg(`🗑️ "${name}" deleted successfully!`);
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchStock();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStockValue = products.reduce((sum, product) => 
    sum + (product.price * product.stock), 0
  );

  const lowStockProducts = products.filter(p => p.stock < 10);

  return (
    <div className="stock-management">
      <div className="stock-header">
        <h2>📦 Stock Management</h2>
        <p className="stock-subtitle">Manage inventory and monitor stock levels</p>
      </div>

      {successMsg && (
        <div className={`success-message ${successMsg.includes('❌') ? 'error' : ''}`}>
          {successMsg}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>৳{totalStockValue.toLocaleString()}</h3>
            <p>Total Stock Value</p>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{lowStockProducts.length}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="add-product-card">
        <h3>➕ Add New Product</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              placeholder="Enter product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Price (৳) *</label>
            <input
              placeholder="Enter price"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Initial Stock *</label>
            <input
              placeholder="Enter quantity"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="form-input"
            />
          </div>
          
          <button 
            onClick={addProduct} 
            className="add-btn"
            disabled={!form.name || !form.price || !form.stock}
          >
            <span className="btn-icon">➕</span> Add Product
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="clear-search"
            >
              ✕
            </button>
          )}
        </div>
        <span className="product-count">
          {filteredProducts.length} of {products.length} products
        </span>
      </div>

      {/* Stock List */}
      <div className="stock-list">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading stock data...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h4>No products found</h4>
            <p>{searchTerm ? "Try a different search term" : "Add your first product to get started"}</p>
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div className={`product-card ${p.stock < 10 ? 'low-stock' : p.stock < 20 ? 'medium-stock' : 'high-stock'}`} key={p.id}>
              <div className="product-header">
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <span className="product-price">৳{p.price.toLocaleString()}</span>
                </div>
                <div className="product-actions">
                  <button 
                    onClick={() => updateQty(p.id, "inc")}
                    className="action-btn inc-btn"
                    title="Increase Stock"
                  >
                    <span className="action-icon">➕</span>
                  </button>
                  <button 
                    onClick={() => updateQty(p.id, "dec")}
                    className="action-btn dec-btn"
                    disabled={p.stock <= 0}
                    title="Decrease Stock"
                  >
                    <span className="action-icon">➖</span>
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id, p.name)}
                    className="action-btn delete-btn"
                    title="Delete Product"
                  >
                    <span className="action-icon">🗑️</span>
                  </button>
                </div>
              </div>
              
              <div className="product-details">
                <div className="stock-info">
                  <div className="stock-label">Current Stock:</div>
                  <div className={`stock-value ${p.stock < 10 ? 'warning' : p.stock < 20 ? 'medium' : 'good'}`}>
                    {p.stock} units
                  </div>
                </div>
                
                <div className="stock-total">
                  <div className="stock-label">Total Value:</div>
                  <div className="total-value">৳{(p.price * p.stock).toLocaleString()}</div>
                </div>
                
                <div className="stock-bar-container">
                  <div className="stock-bar-label">
                    Stock Level: {Math.round((p.stock / 50) * 100)}%
                  </div>
                  <div className="stock-bar">
                    <div 
                      className={`stock-progress ${p.stock < 10 ? 'danger' : p.stock < 20 ? 'warning' : 'success'}`}
                      style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Stock;
