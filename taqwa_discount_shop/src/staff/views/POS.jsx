// POS.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./POS.css";

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [successMsg, setSuccessMsg] = useState("");

  // Get logged-in staff ID safely
  const loggedInStaffId = Number(JSON.parse(localStorage.getItem("user"))?.id);

  // Load products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://shop-taqwa-react-fastapi-2.onrender.com/staff/stock");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    if (product.stock === 0) {
      setSuccessMsg("❌ Out of stock!");
      setTimeout(() => setSuccessMsg(""), 3000);
      return;
    }

    const exists = cart.find((c) => c.id === product.id);
    if (exists) {
      if (exists.qty >= product.stock) {
        setSuccessMsg(`❌ Only ${product.stock} items available!`);
        setTimeout(() => setSuccessMsg(""), 3000);
        return;
      }
      setCart(cart.map((c) => (c.id === product.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }

    setSuccessMsg(`✅ ${product.name} added to cart!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  // Change quantity in cart
  const changeQty = (id, type) => {
    setCart(
      cart.map((c) => {
        if (c.id === id) {
          const newQty = type === "inc" ? c.qty + 1 : Math.max(1, c.qty - 1);
          const product = products.find((p) => p.id === id);
          if (newQty > c.qty && newQty > product.stock) {
            setSuccessMsg(`❌ Only ${product.stock} items available!`);
            setTimeout(() => setSuccessMsg(""), 3000);
            return c;
          }
          return { ...c, qty: newQty };
        }
        return c;
      })
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    setSuccessMsg("🗑️ Item removed from cart");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  // Totals
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vatRate = 0.15;
  const vatAmount = total * vatRate;
  const discount = 0;
  const grandTotal = total + vatAmount - discount;

  // Complete Sale
  const completeSale = async () => {
    if (!loggedInStaffId) {
      setSuccessMsg("❌ Staff not logged in!");
      return;
    }

    if (cart.length === 0) {
      setSuccessMsg("❌ Cart is empty!");
      return;
    }

    try {
      const payload = {
        staff_id: loggedInStaffId,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
          price: Number(item.price),
        })),
        total: Number(total),
        vat: Number(vatAmount),
        discount: discount,
        grand_total: Number(grandTotal),
        payment_method: "cash",
      };

      await axios.post("https://shop-taqwa-react-fastapi-2.onrender.com/pos/complete", payload);

      setSuccessMsg(`✅ Sale completed! Receipt #INV-${Date.now()}`);
      setCart([]);
      fetchProducts();
    } catch (error) {
      setSuccessMsg("❌ Error completing sale");
      console.error("Error completing sale:", error.response?.data || error.message);
    }
  };

  // Filtered products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="pos-system">
      {/* Header */}
      <div className="pos-header">
        <h2>💳 POS System</h2>
        <p className="pos-subtitle">Point of Sale - Process transactions</p>
      </div>

      {successMsg && (
        <div className={`success-message ${successMsg.includes("❌") ? "error" : ""}`}>
          {successMsg}
        </div>
      )}

      <div className="pos-container">
        {/* Left Column: Products */}
        <div className="pos-products">
          <div className="products-header">
            <h3>📦 Products</h3>
            <div className="products-controls">
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="clear-search">
                    ✕
                  </button>
                )}
              </div>

              {categories.length > 1 && (
                <div className="category-filter">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="category-select"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="products-grid">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-products">
                <div className="empty-icon">📦</div>
                <p>No products found</p>
              </div>
            ) : (
              filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className={`pos-product-card ${p.stock === 0 ? "out-of-stock" : ""}`}
                  onClick={() => addToCart(p)}
                >
                  <div className="pos-product-image">
                    {p.stock === 0 ? (
                      <span className="stock-badge out">OUT</span>
                    ) : p.stock < 10 ? (
                      <span className="stock-badge low">LOW</span>
                    ) : (
                      <span className="stock-badge">IN</span>
                    )}
                  </div>
                  <div className="pos-product-info">
                    <h4 className="pos-product-name">{p.name}</h4>
                    {p.category && <span className="pos-product-category">{p.category}</span>}
                    <div className="product-price-stock">
                      <span className="price">৳{p.price.toLocaleString()}</span>
                      <span className="stock">Stock: {p.stock}</span>
                    </div>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    disabled={p.stock === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                  >
                    🛒 Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Cart */}
        <div className="pos-cart">
          <div className="cart-header">
            <h3>🛒 Shopping Cart</h3>
            {cart.length > 0 && <span className="cart-count">{cart.length} items</span>}
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <p className="hint">Add products from the left panel</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4 className="item-name">{item.name}</h4>
                    <div className="item-price">৳{item.price.toLocaleString()} each</div>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button onClick={() => changeQty(item.id, "dec")} disabled={item.qty <= 1}>
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => changeQty(item.id, "inc")}>+</button>
                    </div>
                    <div className="item-total">৳{(item.price * item.qty).toLocaleString()}</div>
                    <button onClick={() => removeFromCart(item.id)}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>VAT (15%):</span>
                <span>৳{vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="summary-row discount">
                <span>Discount:</span>
                <span>-৳{discount.toLocaleString()}</span>
              </div>
              <div className="summary-row total-row">
                <span>Grand Total:</span>
                <span className="grand-total">{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="payment-actions">
                <button onClick={completeSale}>💳 Complete Sale</button>
                <button onClick={() => setCart([])}>Clear Cart</button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="quick-stats">
            <div>
              Products: {products.length}
            </div>
            <div>
              In Stock: {products.filter((p) => p.stock > 0).length}
            </div>
            <div>
              Out of Stock: {products.filter((p) => p.stock === 0).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
