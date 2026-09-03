/*const StaffHeader = ({ setActive }) => {
  return (
    <aside className="staff-sidebar">
      <h2>Staff Panel</h2>

      <button onClick={() => setActive("pos")}>POS</button>
      <button onClick={() => setActive("search")}>Product Search</button>
      <button onClick={() => setActive("customer")}>Customer Entry</button>
      <button onClick={() => setActive("sales")}>Today Sales</button>
      <button onClick={() => setActive("performance")}>My Performance</button>
      <button onClick={() => setActive("stock")}>Stock</button>

      <button className="logout-btn" onClick={() => setActive("logout")}>
        Logout
      </button>
    </aside>
  );
};


export default StaffHeader;
*/
import { useState, useEffect } from "react";

const StaffHeader = ({ setActive, active }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuClick = (page) => {
    setActive(page);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Close menu when clicking outside (mobile)
  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.staff-sidebar') && !e.target.closest('.mobile-menu-toggle')) {
          setMobileMenuOpen(false);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen, isMobile]);

  return (
    <>
      {isMobile && (
        <>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          
          {mobileMenuOpen && (
            <div 
              className="mobile-overlay active"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </>
      )}
      
      <aside className={`staff-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Staff Panel</h2>
          {isMobile && (
            <button 
              className="close-menu"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              ✕
            </button>
          )}
        </div>

        <nav className="menu-items">
          <button 
            onClick={() => handleMenuClick("pos")}
            className={active === "pos" ? "active" : ""}
            aria-label="POS System"
          >
            📊 POS System
          </button>
          
          <button
            onClick={() => handleMenuClick("schedule")}
            className={active === "schedule" ? "active" : ""}
            aria-label="My Schedule"
          >
            📅 My Schedule
          </button>

          
          <button 
            onClick={() => handleMenuClick("customer")}
            className={active === "customer" ? "active" : ""}
            aria-label="Customer Entry"
          >
            👥 Customer Entry
          </button>
          
          <button 
            onClick={() => handleMenuClick("sales")}
            className={active === "sales" ? "active" : ""}
            aria-label="Today Sales"
          >
            💰 Today Sales
          </button>
          
          <button 
            onClick={() => handleMenuClick("performance")}
            className={active === "performance" ? "active" : ""}
            aria-label="My Performance"
          >
            📈 My Performance
          </button>
          
          <button 
            onClick={() => handleMenuClick("stock")}
            className={active === "stock" ? "active" : ""}
            aria-label="Stock Management"
          >
            📦 Stock Management
          </button>

          <button 
            className="logout-btn" 
            onClick={() => handleMenuClick("logout")}
            aria-label="Logout"
          >
            🚪 Logout
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <p className="user-info">👤 Staff User</p>
          <p className="current-time">🕐 {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
      </aside>
    </>
  );
};

export default StaffHeader;