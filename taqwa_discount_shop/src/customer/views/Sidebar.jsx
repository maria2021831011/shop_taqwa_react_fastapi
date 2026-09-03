// Sidebar.jsx
const Sidebar = ({ activePage, onPageChange, isOpen, onClose }) => {
  const navItems = [
    { id: 'loyalty', label: 'Loyalty Program', icon: '🏆' },
    { id: 'message', label: 'Messages', icon: '💬' },
    { id: 'products', label: 'Products', icon: '🛍️' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
  ];

  return (
    <aside className={`customer-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h2>Customer Portal</h2>
        </div>
        
        <nav className="menu-items">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-btn ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <span style={{ marginRight: '12px', fontSize: '20px' }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
          
          <button 
            className="sidebar-btn logout-btn"
            onClick={() => onPageChange('logout')}
          >
            <span style={{ marginRight: '12px', fontSize: '20px' }}>
              🚪
            </span>
            Logout
          </button>
        </nav>
        
        <div className="sidebar-footer">
          
          <p className="current-time">
            🕐 {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
