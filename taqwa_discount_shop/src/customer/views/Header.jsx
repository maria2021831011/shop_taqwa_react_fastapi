/*const Header = ({ setActivePage }) => {
  return (
    <nav className="customer-header">
      <button onClick={() => setActivePage("loyalty")}>Loyalty</button>
      <button onClick={() => setActivePage("orders")}>Orders</button>
      <button onClick={() => setActivePage("products")}>Offers</button>
      <button onClick={() => setActivePage("profile")}>Profile</button>
      <button onClick={() => setActivePage("logout")}>Logout</button>
    </nav>
  );
};

export default Header;
*/
// Header.js
// src/customer/views/Header.jsx
import React from 'react';

const Header = ({ activePage }) => {
  const pageTitles = {
    loyalty: 'Loyalty Program',
    message: 'Messages',
    products: 'Products',
    profile: 'My Profile',
    logout: 'Logout',
  };

  const pageSubtitles = {
    loyalty: 'Earn points and redeem rewards',
    message: 'Your notifications and messages',
    products: 'Browse and shop products',
    profile: 'Manage your account settings',
    logout: 'Sign out from your account',
  };

  return (
    <div className="customer-header">
      <div className="header-title">
        <h1>{pageTitles[activePage]}</h1>
        <p>{pageSubtitles[activePage]}</p>
      </div>
      
      <div className="header-actions">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search..." 
          />
        </div>
        
        <button className="notification-btn">
          <span>🔔</span>
          <span className="notification-badge"></span>
        </button>
      </div>
    </div>
  );
};

export default Header;
