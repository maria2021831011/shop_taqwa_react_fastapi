/*import { useState } from "react";
import Header from "./views/Header";
import Loyalty from "./views/Loyalty";
import OrderHistory from "./views/OrderHistory";
import Profile from "./views/Profile";
import Products from "./views/Products";
import Logout from "./views/Logout";
import "./styles/customer.css";

const CustomerDashboard = () => {
  const [activePage, setActivePage] = useState("loyalty");

  const renderPage = () => {
    switch (activePage) {
      case "loyalty":
        return <Loyalty />;
      case "orders":
        return <OrderHistory />;
      case "profile":
        return <Profile />;
      case "products":
        return <Products />;
      case "logout":
        return <Logout />;
      default:
        return <Loyalty />;
    }
  };

  return (
    <div className="customer-dashboard">
      <Header setActivePage={setActivePage} />
      <div className="customer-content">{renderPage()}</div>
    </div>
  );
};

export default CustomerDashboard;
*/
// CustomerDashboard.js
// CustomerDashboard.jsx
import { useState, useEffect } from "react";
import Header from "./views/Header";
import Sidebar from "./views/Sidebar";
import Loyalty from "./views/Loyalty";
import Message from "./views/Message";
import Profile from "./views/Profile";
import Products from "./views/Products";
import Logout from "./views/Logout";
import "./styles/customer.css";

const CustomerDashboard = () => {
  const [activePage, setActivePage] = useState("loyalty");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false); // Auto close sidebar on desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "loyalty":
        return <Loyalty />;
      case "message":
        return <Message />;
      case "profile":
        return <Profile />;
      case "products":
        return <Products />;
      case "logout":
        return <Logout />;
      default:
        return <Loyalty />;
    }
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="customer-dashboard">
      {isMobile && (
        <>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          {sidebarOpen && (
            <div 
              className="mobile-overlay active"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}
      
      <Sidebar 
        activePage={activePage}
        onPageChange={handlePageChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="customer-main">
        <Header activePage={activePage} />
        <div className="customer-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;