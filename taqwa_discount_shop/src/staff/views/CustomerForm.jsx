import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User,
  Phone,
  Mail,
  Coins,
  Tag,
  Plus,
  Minus,
  Users,
  History
} from 'lucide-react';
import './CustomerForm.css';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    coin_points: 0,
    offer_points: 0
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState('coin_add');
  const [adjustmentPoints, setAdjustmentPoints] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem('token');

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/customers', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm }
      });
      setCustomers(res.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch customer transactions
  const fetchTransactions = async (customerId) => {
    try {
      const res = await axios.get(`http://localhost:8000/customers/${customerId}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'coin_points' || name === 'offer_points' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mobile (Bangladeshi format: 01XXXXXXXXX)
    const mobileRegex = /^01[3-9]\d{8}$/;
    if (!mobileRegex.test(formData.mobile)) {
      alert('Please enter a valid Bangladeshi mobile number (01XXXXXXXXX)');
      return;
    }

    try {
      const url = 'http://localhost:8000/customers';
      
      const response = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Customer created successfully!');
      // Reset form
      setFormData({ 
        name: '', 
        email: '', 
        mobile: '', 
        coin_points: 0, 
        offer_points: 0 
      });
      // Refresh customer list
      fetchCustomers();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error creating customer';
      alert(errorMsg);
    }
  };

  const handleAdjustPoints = async () => {
    if (!selectedCustomer) {
      alert('Please select a customer first');
      return;
    }

    if (!adjustmentPoints || parseInt(adjustmentPoints) <= 0) {
      alert('Please enter valid points');
      return;
    }

    if (!adjustmentReason.trim()) {
      alert('Please enter a reason for adjustment');
      return;
    }

    try {
      await axios.post('http://localhost:8000/customers/adjust-points', 
        {
          customer_id: selectedCustomer.id,
          adjustment_type: adjustmentType,
          points: parseInt(adjustmentPoints),
          reason: adjustmentReason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Points adjusted successfully!');
      // Clear adjustment fields
      setAdjustmentPoints('');
      setAdjustmentReason('');
      // Refresh data
      fetchCustomers();
      if (selectedCustomer) {
        fetchTransactions(selectedCustomer.id);
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Error adjusting points');
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    fetchTransactions(customer.id);
  };

  const handleQuickAdjust = (type, customer) => {
    setSelectedCustomer(customer);
    setAdjustmentType(type === 'coin' ? 'coin_add' : 'offer_add');
    setAdjustmentPoints('10');
    setAdjustmentReason('Quick adjustment');
  };

  return (
    <div className="customer-form-container">
      {/* Header */}
      <div className="form-header">
        <h2><User size={28} /> Customer Information Management</h2>
        <p>Add new customers and manage their points in real-time</p>
      </div>

      <div className="form-layout">
        {/* Left Column: Customer Form */}
        <div className="form-section">
          <div className="section-header">
            <h3><Plus size={20} /> Add New Customer</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="customer-entry-form">
            <div className="form-group">
              <label>
                <User size={16} /> Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter customer name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>
                <Phone size={16} /> Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                required
                placeholder="01XXXXXXXXX"
                className="form-input"
              />
             
            </div>

            <div className="form-group">
              <label>
                <Mail size={16} /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="customer@example.com"
                className="form-input"
              />
            </div>

            <div className="points-row">
              <div className="form-group">
                <label>
                  <Coins size={16} /> Initial Coin Points
                </label>
                <input
                  type="number"
                  name="coin_points"
                  value={formData.coin_points}
                  onChange={handleInputChange}
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <Tag size={16} /> Initial Offer Points
                </label>
                <input
                  type="number"
                  name="offer_points"
                  value={formData.offer_points}
                  onChange={handleInputChange}
                  min="0"
                  className="form-input"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <Plus size={18} /> Save Customer
            </button>
          </form>
        </div>

        {/* Right Column: Customer List & Management */}
        <div className="management-section">
          {/* Search */}
          <div >
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Customers List */}
          <div className="customers-list-section">
            <div className="section-header">
              <h3><Users size={20} /> Customer List</h3>
              <span className="count-badge">{customers.length} customers</span>
            </div>
            
            {loading ? (
              <div className="loading">Loading customers...</div>
            ) : customers.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <p>No customers found</p>
              </div>
            ) : (
              <div className="customers-list">
                {customers.map(customer => (
                  <div 
                    key={customer.id} 
                    className={`customer-item ${selectedCustomer?.id === customer.id ? 'selected' : ''}`}
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="customer-avatar">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="customer-info">
                      <h4>{customer.name}</h4>
                      <p className="customer-mobile">
                        <Phone size={12} /> {customer.mobile}
                      </p>
                      <div className="customer-points">
                        <span className="point-badge coin">
                          <Coins size={12} /> {customer.coin_points}
                        </span>
                        <span className="point-badge offer">
                          <Tag size={12} /> {customer.offer_points}
                        </span>
                      </div>
                    </div>
                    <div className="customer-actions">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdjust('coin', customer);
                        }}
                        className="action-btn add"
                        title="Add 10 coins"
                      >
                        <Plus size={14} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdjust('offer', customer);
                        }}
                        className="action-btn add"
                        title="Add 10 offers"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Points Adjustment Section */}
          {selectedCustomer && (
            <div className="adjustment-section">
              <div className="section-header">
                <h3>Adjust Points for {selectedCustomer.name}</h3>
              </div>
              
              <div className="adjustment-form">
                <div className="adjustment-controls">
                  <div className="control-group">
                    <label>Adjustment Type</label>
                    <select 
                      value={adjustmentType}
                      onChange={(e) => setAdjustmentType(e.target.value)}
                      className="adjustment-select"
                    >
                      <option value="coin_add">Add Coins</option>
                      <option value="coin_subtract">Subtract Coins</option>
                      <option value="offer_add">Add Offers</option>
                      <option value="offer_subtract">Subtract Offers</option>
                    </select>
                  </div>

                  <div className="control-group">
                    <label>Points Amount</label>
                    <input
                      type="number"
                      value={adjustmentPoints}
                      onChange={(e) => setAdjustmentPoints(e.target.value)}
                      min="1"
                      placeholder="Enter points"
                      className="adjustment-input"
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>Reason for Adjustment</label>
                  <input
                    type="text"
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    placeholder="Enter reason..."
                    className="adjustment-input"
                  />
                </div>

                <button 
                  onClick={handleAdjustPoints}
                  className="adjust-btn"
                  disabled={!adjustmentPoints || !adjustmentReason}
                >
                  {adjustmentType.includes('add') ? (
                    <>
                      <Plus size={16} /> Add Points
                    </>
                  ) : (
                    <>
                      <Minus size={16} /> Subtract Points
                    </>
                  )}
                </button>
              </div>

              {/* Current Points Display */}
              <div className="current-points">
                <div className="point-display">
                  <Coins size={20} />
                  <div>
                    <span className="point-label">Current Coins</span>
                    <span className="point-value">{selectedCustomer.coin_points}</span>
                  </div>
                </div>
                <div className="point-display">
                  <Tag size={20} />
                  <div>
                    <span className="point-label">Current Offers</span>
                    <span className="point-value">{selectedCustomer.offer_points}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions History */}
          {selectedCustomer && transactions.length > 0 && (
            <div className="transactions-section">
              <div className="section-header">
                <h3><History size={20} /> Recent Transactions</h3>
              </div>
              <div className="transactions-list">
                {transactions.slice(0, 5).map(tx => (
                  <div key={tx.id} className="transaction-item">
                    <div className="transaction-type">
                      {tx.type === 'coin_adjustment' ? (
                        <Coins size={14} />
                      ) : (
                        <Tag size={14} />
                      )}
                      <span>{tx.type.replace('_', ' ')}</span>
                    </div>
                    <div className={`transaction-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </div>
                    <div className="transaction-reason">{tx.description}</div>
                    <div className="transaction-date">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;