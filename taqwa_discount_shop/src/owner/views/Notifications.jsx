/*import { useEffect, useState } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/owner/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (!notifications) return <p>Loading...</p>;

  return (
    <div>
      <h2>Important Notifications</h2>

      {notifications.length === 0 && <p>No notifications</p>}

      {notifications.map((note, idx) => (
        <div key={idx} className={`card alert`}>
          {note.icon} {note.message}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
*/
import { useEffect, useState } from "react";
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  Clock,
  X,
  Check
} from "lucide-react";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/owner/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'critical':
        return <AlertTriangle size={24} />;
      case 'high':
        return <AlertCircle size={24} />;
      case 'medium':
        return <Info size={24} />;
      case 'low':
        return <CheckCircle size={24} />;
      default:
        return <Bell size={24} />;
    }
  };

  const getNotificationType = (message) => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('critical') || lowerMsg.includes('urgent') || lowerMsg.includes('error')) {
      return 'critical';
    } else if (lowerMsg.includes('warning') || lowerMsg.includes('attention')) {
      return 'high';
    } else if (lowerMsg.includes('info') || lowerMsg.includes('update')) {
      return 'medium';
    } else {
      return 'low';
    }
  };

  const formatTime = (timestamp) => {
    const time = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDismiss = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
    setUnreadCount(prev => prev - 1);
  };

  const handleMarkAsRead = (index) => {
    setNotifications(prev => prev.map((note, i) => 
      i === index ? { ...note, read: true } : note
    ));
    setUnreadCount(prev => prev - 1);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(note => ({ ...note, read: true })));
    setUnreadCount(0);
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(note => getNotificationType(note.message) === filter);

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="notifications-header">
          <h2>Important Notifications</h2>
          <div className="notifications-count">
            <Bell size={14} />
            Loading...
          </div>
        </div>
        <div className="loading-skeleton">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Important Notifications</h2>
        {unreadCount > 0 && (
          <div className="notifications-count">
            <Bell size={14} />
            {unreadCount} New
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="notification-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <Bell size={14} />
          All ({notifications.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'critical' ? 'active critical' : ''}`}
          onClick={() => setFilter('critical')}
        >
          <AlertTriangle size={14} />
          Critical
        </button>
        <button 
          className={`filter-btn ${filter === 'high' ? 'active high' : ''}`}
          onClick={() => setFilter('high')}
        >
          <AlertCircle size={14} />
          High
        </button>
        <button 
          className={`filter-btn ${filter === 'medium' ? 'active medium' : ''}`}
          onClick={() => setFilter('medium')}
        >
          <Info size={14} />
          Medium
        </button>
        <button 
          className={`filter-btn ${filter === 'low' ? 'active low' : ''}`}
          onClick={() => setFilter('low')}
        >
          <CheckCircle size={14} />
          Low
        </button>
      </div>

      {/* Mark All as Read */}
      {unreadCount > 0 && (
        <div className="mark-all-read">
          <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
            <Check size={16} />
            Mark all as read
          </button>
        </div>
      )}

      {/* Notifications Grid */}
      <div className="notifications-grid">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <p>No notifications found</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              {filter !== 'all' ? `No ${filter} priority notifications` : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((note, idx) => {
            const type = getNotificationType(note.message);
            const icon = getNotificationIcon(type);
            const isUnread = !note.read;

            return (
              <div key={idx} className={`notification-card ${type} ${isUnread ? 'unread' : ''}`}>
                {/* Dismiss Button */}
                <button className="dismiss-btn" onClick={() => handleDismiss(idx)}>
                  <X size={16} />
                </button>

                {/* Notification Icon */}
                <div className="notification-icon">
                  {icon}
                </div>

                {/* Notification Content */}
                <div className="notification-content">
                  <div className="notification-header">
                    <div>
                      <div className="notification-title">
                        {note.title || 'Notification'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span className="priority-badge">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                        {isUnread && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#ef4444',
                            animation: 'pulse 2s infinite'
                          }}></span>
                        )}
                      </div>
                    </div>
                    <div className="notification-time">
                      <Clock size={12} style={{ marginRight: '4px' }} />
                      {formatTime(note.time || Date.now())}
                    </div>
                  </div>

                  <div className="notification-message">
                    {note.message}
                  </div>

                  {/* Action Buttons */}
                  <div className="notification-actions">
                    {isUnread && (
                      <button 
                        className="action-btn primary"
                        onClick={() => handleMarkAsRead(idx)}
                      >
                        <Check size={14} style={{ marginRight: '6px' }} />
                        Mark as Read
                      </button>
                    )}
                    {note.action && (
                      <button className="action-btn secondary">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Summary */}
      {notifications.length > 0 && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>Summary:</span>
              <span style={{ marginLeft: '8px' }}>
                {unreadCount} unread • {notifications.length} total
              </span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }}></div>
                <span>
                  {notifications.filter(n => getNotificationType(n.message) === 'critical').length} Critical
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '2px' }}></div>
                <span>
                  {notifications.filter(n => getNotificationType(n.message) === 'high').length} High
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;