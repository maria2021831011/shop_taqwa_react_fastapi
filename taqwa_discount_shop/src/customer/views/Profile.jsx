import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [customerData, setCustomerData] = useState({
    coin_points: 0,
    offer_points: 0,
    total_purchases: 0,
    last_purchase_date: null,
    created_at: null,
    total_transactions: 0
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  // 🔹 Load profile and customer data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, loyaltyRes, transactionsRes] = await Promise.all([
          axios.get("https://shop-taqwa-react-fastapi-2.onrender.com/customers/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://shop-taqwa-react-fastapi-2.onrender.com/loyalty/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://shop-taqwa-react-fastapi-2.onrender.com/customers/transactions", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setForm(profileRes.data);
        
        // Extract customer data from responses
        setCustomerData({
          coin_points: loyaltyRes.data?.customer?.coin_points || 0,
          offer_points: loyaltyRes.data?.customer?.offer_points || 0,
          total_purchases: loyaltyRes.data?.customer?.total_purchases || 0,
          last_purchase_date: loyaltyRes.data?.customer?.last_purchase_date,
          created_at: profileRes.data?.created_at,
          total_transactions: transactionsRes.data?.length || 0
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // 🔹 Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      await axios.put(
        "https://shop-taqwa-react-fastapi-2.onrender.com/customers/profile",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess("✅ Profile updated successfully!");
      setUpdating(false);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update profile");
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateMembershipDuration = () => {
    if (!customerData.created_at) return "0 days";
    const created = new Date(customerData.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1>👤 My Profile</h1>
          <div className="member-badge">
            <span className="badge-icon">🌟</span>
            Member for {calculateMembershipDuration()}
          </div>
        </div>
        <p className="header-subtitle">Manage your account information and preferences</p>
      </div>

      <div className="profile-layout">
        {/* Left Column - Profile Info */}
        <div className="profile-card">
          <div className="card-header">
            <h2>📝 Personal Information</h2>
            <div className="status-indicator">
              <div className="status-dot active"></div>
              <span>Active</span>
            </div>
          </div>

          {error && (
            <div className="alert error">
              <span className="alert-icon"></span>
              {error}
            </div>
          )}

          {success && (
            <div className="alert success">
              <span className="alert-icon">✅</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>
                <span className="label-icon">👤</span>
                Full Name
              </label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={updating}
                  placeholder="Enter your full name"
                />
                
              </div>
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <div className="input-with-icon">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={updating}
                  placeholder="your.email@example.com"
                />
          
              </div>
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">📱</span>
                Phone Number
              </label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                  disabled={updating}
                  placeholder="+880 1XXX-XXXXXX"
                />
                
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-update"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <span className="button-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="button-icon">💾</span>
                    Update Profile
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => window.location.reload()}
                disabled={updating}
              >
                <span className="button-icon">🔄</span>
                Refresh Data
              </button>
            </div>
          </form>
        </div>

      
         
          </div>


        
        </div>
      
  );
};

export default Profile;
