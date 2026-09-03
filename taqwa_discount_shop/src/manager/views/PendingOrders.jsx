import { useState } from "react";
import axios from "axios";
import {
  Package,
  ShoppingCart,
  Truck,
  Mail,
  MapPin,
  PlusCircle,
  DollarSign,
  Hash,
  User
} from "lucide-react";
import "./PurchaseOrders.css";

const PendingOrders = () => {
  const [form, setForm] = useState({
    product_name: "",
    quantity: "",
    purchase_price: "",
    supplier_name: "",
    supplier_email: "",
    shop_location: "Taqwa Discount Shop, Dhaka"
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await axios.post("http://localhost:8000/purchase", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      setForm({
        product_name: "",
        quantity: "",
        purchase_price: "",
        supplier_name: "",
        supplier_email: "",
        shop_location: "Taqwa Discount Shop, Dhaka"
      });
    } catch (_err) {
      alert("❌ Error adding purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="purchase-container">
      {/* Header */}
      <div className="purchase-header">
        <div className="header-icon">
          <ShoppingCart size={32} />
        </div>
        <div>
          <h1>📦 Stock Purchase Management</h1>
          <p className="header-subtitle">Add new inventory purchases and update stock levels</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <div>
            <h3>Purchase Successful!</h3>
            <p>Stock has been updated in the inventory</p>
          </div>
        </div>
      )}

      <div className="purchase-card">
        <div className="card-header">
          <h2>
            <Package size={24} />
            New Product Purchase
          </h2>
          <div className="status-indicator">
            <div className="status-dot active"></div>
            <span>Ready to add</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="purchase-form">
          {/* Product Details Section */}
          <div className="form-section">
            <div className="section-header">
              <Package size={20} />
              <h3>Product Information</h3>
            </div>
            
            <div className="input-group">
              <label>
                <span className="label-icon">📦</span>
                Product Name
              </label>
              <div className="input-wrapper">
                <input
                  name="product_name"
                  placeholder="Enter product name"
                  value={form.product_name}
                  onChange={handleChange}
                  required
                  className="modern-input"
                />
                <span className="input-hint">Required</span>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>
                  <Hash size={16} />
                  Quantity
                </label>
                <div className="input-wrapper">
                  <input
                    name="quantity"
                    type="number"
                    placeholder="0"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    className="modern-input"
                    min="1"
                  />
                  <span className="unit">units</span>
                </div>
              </div>

              <div className="input-group">
                <label>
                  <DollarSign size={16} />
                  Purchase Price
                </label>
                <div className="input-wrapper">
                  <input
                    name="purchase_price"
                    type="number"
                    placeholder="0.00"
                    value={form.purchase_price}
                    onChange={handleChange}
                    required
                    className="modern-input"
                    step="0.01"
                    min="0"
                  />
                  <span className="currency">৳</span>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Details Section */}
          <div className="form-section">
            <div className="section-header">
              <Truck size={20} />
              <h3>Supplier Details</h3>
            </div>

            <div className="input-group">
              <label>
                <User size={16} />
                Supplier Name
              </label>
              <input
                name="supplier_name"
                placeholder="Enter supplier name"
                value={form.supplier_name}
                onChange={handleChange}
                className="modern-input"
              />
            </div>

            <div className="input-group">
              <label>
                <Mail size={16} />
                Supplier Email
              </label>
              <input
                name="supplier_email"
                type="email"
                placeholder="supplier@example.com"
                value={form.supplier_email}
                onChange={handleChange}
                className="modern-input"
              />
            </div>
          </div>

          {/* Shop Location Section */}
          <div className="form-section">
            <div className="section-header">
              <MapPin size={20} />
              <h3>Shop Location</h3>
            </div>
            
            <div className="location-display">
              <div className="location-content">
                <MapPin size={18} />
                <span>Akhalia,sylhet</span>
              </div>
              <div className="location-badge">Fixed Location</div>
            </div>
            
            <input
              name="shop_location"
              value={form.shop_location}
              onChange={handleChange}
              hidden
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Processing...
              </>
            ) : (
              <>
                <PlusCircle size={20} />
                Add Purchase to Inventory
              </>
            )}
          </button>

          {/* Form Stats */}
          <div className="form-stats">
            <div className="stat-item">
              <span className="stat-label">Total Cost</span>
              <span className="stat-value">
                ৳{(form.quantity && form.purchase_price) 
                  ? (parseFloat(form.quantity) * parseFloat(form.purchase_price)).toFixed(2)
                  : "0.00"}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Items</span>
              <span className="stat-value">{form.quantity || 0}</span>
            </div>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="help-text">
        <p>💡 <strong>Note:</strong> All purchases will automatically update the stock levels in your inventory.</p>
      </div>
    </div>
  );
};
export default PendingOrders;