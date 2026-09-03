import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart
} from "recharts";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Award,
  RefreshCw,
  Clock,
  TrendingUp as TrendingUpIcon
} from "lucide-react";
import "./performance.css";

const Performance = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    orders_handled: 0,
    total_sales: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [animatedOrders, setAnimatedOrders] = useState(0);
  const [animatedSales, setAnimatedSales] = useState(0);

  const token = localStorage.getItem("token");

  const fetchPerformance = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/sales/performance/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSummary(res.data);
      setLastUpdated(new Date());
      
      // Animate numbers
      animateValue(animatedOrders, res.data.orders_handled, 800, setAnimatedOrders);
      animateValue(animatedSales, res.data.total_sales, 800, setAnimatedSales);

      // Add to chart data
      setData((prev) => {
        const newData = [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            coins: res.data.orders_handled,
            sales: res.data.total_sales
          }
        ];
        // Keep only last 10 data points
        return newData.slice(-10);
      });
    } catch (error) {
      console.error("Error fetching performance:", error);
    } finally {
      setLoading(false);
    }
  };

  const animateValue = (start, end, duration, setValue) => {
    if (start === end) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      setValue(value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // 🔁 Real-time (polling every 5 sec)
  useEffect(() => {
    fetchPerformance();
    const interval = setInterval(fetchPerformance, 5000);
    return () => clearInterval(interval);
  }, []);

  const statsCards = [
    {
      title: "Orders Handled",
      value: animatedOrders.toLocaleString(),
      icon: <ShoppingBag size={24} />,
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      prefix: "",
      change: "+12%"
    },
    {
      title: "Total Sales",
      value: formatCurrency(animatedSales),
      icon: <DollarSign size={24} />,
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      prefix: "৳",
      change: "+18%"
    },
    {
      title: "Coins Earned",
      value: animatedOrders.toLocaleString(),
      icon: <Award size={24} />,
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      prefix: "",
      change: "+12%"
    },
    {
      title: "Performance",
      value: "98%",
      icon: <TrendingUp size={24} />,
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      prefix: "",
      change: "+5%"
    }
  ];

  return (
    <div className="performance-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>
            <TrendingUpIcon size={28} />
            Performance Analytics
          </h1>
          <p className="header-subtitle">
            Real-time tracking of your sales performance and rewards
          </p>
        </div>
        <div className="header-right">
          <div className="update-info">
            <Clock size={16} />
            <span>Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <button className="refresh-btn" onClick={fetchPerformance}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon" style={{ background: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-title">{stat.title}</span>
              <div className="stat-value">
                <span className="stat-prefix">{stat.prefix}</span>
                {loading ? (
                  <div className="stat-skeleton"></div>
                ) : (
                  <h3>{stat.value}</h3>
                )}
              </div>
              <div className="stat-change">
                <span className="change-badge">
                  <TrendingUp size={14} />
                  {stat.change}
                </span>
                <span className="change-label">from yesterday</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Coins Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <Award size={20} />
              Coins Growth Tracker
            </h3>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color coins"></div>
                <span>Coins Earned</span>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="coinsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4caf50" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: '#edf3e6', fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fill: 'rgb(248, 247, 247)', fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="coins" 
                  stroke="#4caf50" 
                  strokeWidth={3}
                  fill="url(#coinsGradient)"
                  dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                  activeDot={{ r: 6, fill: '#4caf50' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-footer">
            <div className="chart-stats">
              <div className="stat-item">
                <span className="stat-label">Current Coins</span>
                <span className="stat-number">{animatedOrders}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Rate</span>
                <span className="stat-number">1 coin/order</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <DollarSign size={20} />
              Sales Performance
            </h3>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color sales"></div>
                <span>Sales Amount</span>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: 'rgb(244, 244, 244)', fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fill: '#f7f7f7', fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value) => [`৳${formatCurrency(value)}`, 'Sales']}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#667eea"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                  activeDot={{ r: 6, fill: '#667eea' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-footer">
            <div className="chart-stats">
              <div className="stat-item">
                <span className="stat-label">Today's Sales</span>
                <span className="stat-number">৳{formatCurrency(animatedSales)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg/Order</span>
                <span className="stat-number">
                  ৳{animatedOrders > 0 ? formatCurrency(Math.round(animatedSales / animatedOrders)) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-card">
          <h4>Performance Insights</h4>
          <div className="insights-list">
            <div className="insight-item positive">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <span className="insight-title">Consistent Performance</span>
                <span className="insight-desc">
                  You're maintaining a steady order processing rate
                </span>
              </div>
            </div>
            <div className="insight-item positive">
              <div className="insight-icon">🚀</div>
              <div className="insight-content">
                <span className="insight-title">Growth Trend</span>
                <span className="insight-desc">
                  Sales have increased by 18% compared to yesterday
                </span>
              </div>
            </div>
            <div className="insight-item neutral">
              <div className="insight-icon">📊</div>
              <div className="insight-content">
                <span className="insight-title">Coins Progress</span>
                <span className="insight-desc">
                  Earn 10 more coins to unlock the next reward tier
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <h4>Quick Stats</h4>
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="stat-label">Session Duration</span>
              <span className="stat-value">4h 32m</span>
            </div>
            <div className="quick-stat">
              <span className="stat-label">Peak Hour</span>
              <span className="stat-value">2:00 PM</span>
            </div>
            <div className="quick-stat">
              <span className="stat-label">Best Selling</span>
              <span className="stat-value">Foods</span>
            </div>
            <div className="quick-stat">
              <span className="stat-label">Reward Progress</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(100, (animatedOrders / 100) * 100)}%` }}
                ></div>
              </div>
              <span className="progress-text">{animatedOrders}/100 coins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;