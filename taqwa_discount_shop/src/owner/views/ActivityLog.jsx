/*import { useEffect, useState } from "react";

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/owner/activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (!activities) return <p>Loading...</p>;

  return (
    <div>
      <h2>Recent Activities</h2>

      <ul className="list">
        {activities.length === 0 && <li>No recent activity</li>}
        {activities.map((act, idx) => (
          <li key={idx}>
            {act.user} – {act.action} – {act.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;

*/
import { useEffect, useState } from "react";
import { 
  Clock, 
  ShoppingBag, 
  Package, 
  User, 
  Settings, 
  RefreshCw,
  TrendingUp,
  Calendar,
  Activity
} from "lucide-react";
import "./ActivityLog.css";

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivities = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/owner/activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  const getActivityIcon = (action) => {
    if (action.toLowerCase().includes('sale') || action.toLowerCase().includes('purchase')) {
      return <ShoppingBag size={20} />;
    } else if (action.toLowerCase().includes('stock') || action.toLowerCase().includes('inventory')) {
      return <Package size={20} />;
    } else if (action.toLowerCase().includes('login') || action.toLowerCase().includes('user')) {
      return <User size={20} />;
    } else {
      return <Settings size={20} />;
    }
  };

  const getActivityType = (action) => {
    if (action.toLowerCase().includes('sale') || action.toLowerCase().includes('purchase')) {
      return 'sale';
    } else if (action.toLowerCase().includes('stock') || action.toLowerCase().includes('inventory')) {
      return 'stock';
    } else if (action.toLowerCase().includes('login') || action.toLowerCase().includes('user')) {
      return 'user';
    } else {
      return 'system';
    }
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffInHours = (now - time) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return time.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(act => getActivityType(act.action) === filter);

  const activityStats = {
    total: activities.length,
    today: activities.filter(act => {
      const activityTime = new Date(act.time);
      const today = new Date();
      return activityTime.toDateString() === today.toDateString();
    }).length,
    sales: activities.filter(act => getActivityType(act.action) === 'sale').length,
    system: activities.filter(act => getActivityType(act.action) === 'system').length
  };

  if (loading) {
    return (
      <div className="activity-container">
        <h2>Recent Activities</h2>
        <div className="loading-skeleton">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-item">
              <div className="skeleton-icon"></div>
              <div className="skeleton-content">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line" style={{ width: '40%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="activity-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Recent Activities</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
          <Activity size={16} />
          <span>System Log</span>
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="activity-stats">
        <div className="stat-card">
          <div className="stat-value">{activityStats.total}</div>
          <div className="stat-label">Total Activities</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activityStats.today}</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activityStats.sales}</div>
          <div className="stat-label">Sales Activities</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activityStats.system}</div>
          <div className="stat-label">System Actions</div>
        </div>
      </div>

      {/* Activity Filters */}
      <div className="activity-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Activities
        </button>
        <button 
          className={`filter-btn ${filter === 'sale' ? 'active sale' : ''}`}
          onClick={() => setFilter('sale')}
        >
          <ShoppingBag size={14} style={{ marginRight: '6px' }} />
          Sales
        </button>
        <button 
          className={`filter-btn ${filter === 'stock' ? 'active stock' : ''}`}
          onClick={() => setFilter('stock')}
        >
          <Package size={14} style={{ marginRight: '6px' }} />
          Stock
        </button>
        <button 
          className={`filter-btn ${filter === 'user' ? 'active user' : ''}`}
          onClick={() => setFilter('user')}
        >
          <User size={14} style={{ marginRight: '6px' }} />
          User
        </button>
        <button 
          className={`filter-btn ${filter === 'system' ? 'active system' : ''}`}
          onClick={() => setFilter('system')}
        >
          <Settings size={14} style={{ marginRight: '6px' }} />
          System
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="activity-timeline">
        {filteredActivities.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} />
            <p>No recent activity found</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              {filter !== 'all' ? `No ${filter} activities` : 'Activities will appear here'}
            </p>
          </div>
        ) : (
          filteredActivities.slice(0, 10).map((act, idx) => {
            const type = getActivityType(act.action);
            const icon = getActivityIcon(act.action);
            
            return (
              <div key={idx} className={`timeline-item ${type}`}>
                <div className="timeline-icon">
                  {icon}
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <div className="activity-user">{act.user}</div>
                    <div className="activity-time">
                      <Clock size={12} style={{ marginRight: '4px' }} />
                      {formatTime(act.time)}
                    </div>
                  </div>
                  <div className="activity-action">{act.action}</div>
                  <div className="activity-details">
                    <span className={`detail-badge ${type}`}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                    {act.details && (
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {act.details}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Refresh Button */}
      <button 
        className={`refresh-btn ${refreshing ? 'loading' : ''}`}
        onClick={handleRefresh}
        disabled={refreshing}
      >
        <RefreshCw size={24} />
      </button>

      {/* View More */}
      {filteredActivities.length > 10 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '12px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          Showing 10 of {filteredActivities.length} activities
          <button 
            style={{
              marginLeft: '12px',
              background: 'white',
              border: '1px solid #e5e7eb',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'white'}
          >
            View All
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;