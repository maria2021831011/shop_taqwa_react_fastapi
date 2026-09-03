import { useEffect, useState } from "react";
import "./Target.css";

const Target = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DAILY_TARGET = 20000;

  const fetchTodaysSales = (date) => {
    setLoading(true);
    fetch(`https://shop-taqwa-react-fastapi-2.onrender.com/manager/daily-sales?date=${date}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setSalesData(data);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch sales data");
        setLoading(false);
      });
  };

  useEffect(() => {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Fetch today's sales
    fetchTodaysSales(today);

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchTodaysSales(today);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Calculate metrics
  const achieved = salesData?.grand_total_sales || 0;
  const percentage = (achieved / DAILY_TARGET) * 100;
  const remaining = Math.max(0, DAILY_TARGET - achieved);
  const status = percentage >= 100 ? "exceeded" : percentage >= 80 ? "on-track" : "behind";

  // Get status text and emoji
  const getStatusInfo = () => {
    if (percentage >= 100) return { text: "Target Exceeded!", emoji: "🎉", status: "exceeded" };
    if (percentage >= 90) return { text: "Almost there!", emoji: "⚡", status: "almost" };
    if (percentage >= 80) return { text: "On Track", emoji: "✅", status: "on-track" };
    if (percentage >= 50) return { text: "Keep Going!", emoji: "💪", status: "behind" };
    return { text: "More Effort Needed", emoji: "⚠️", status: "critical" };
  };

  const statusInfo = getStatusInfo();

  // Generate SVG curve path data for visualization
  const generateCurvePath = () => {
    const chartWidth = 500;
    const chartHeight = 200;
    const maxValue = DAILY_TARGET * 1.2;

    // Simulate sales curve throughout the day (for visualization)
    const points = [];
    for (let i = 0; i <= 24; i++) {
      const x = (i / 24) * chartWidth;
      // Create a realistic sales curve (slow start, peak mid-day, taper off)
      const normalizedSales = Math.sin((i / 24) * Math.PI) * (achieved * 0.8) + (achieved * 0.2);
      const y = chartHeight - (normalizedSales / maxValue) * chartHeight;
      points.push(`${x},${y}`);
    }

    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="target-container">
      {/* Header */}
      <div className="target-header">
        <div>
          <h2>📈 Today's Sales Target</h2>
          <p className="target-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className={`status-badge ${statusInfo.status}`}>
          <span className="status-emoji">{statusInfo.emoji}</span>
          <span className="status-text">{statusInfo.text}</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="loading-message">Loading today's sales data...</div>}

      {/* Error State */}
      {error && <div className="error-message">{error}</div>}

      {/* Main Content */}
      {!loading && (
        <div className="target-content">
          {/* Circular Progress */}
          <div className="progress-section">
            <div className="circular-progress-wrapper">
              <svg className="circular-progress" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={status === "exceeded" ? "#4CAF50" : status === "on-track" ? "#2196F3" : "#ff9800"}
                  strokeWidth="8"
                  strokeDasharray={`${Math.min(percentage, 100) * 2.827} 282.7`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
              </svg>
              <div className="progress-text">
                <span className="percentage">{Math.min(Math.round(percentage), 100)}%</span>
                <span className="progress-label">Achieved</span>
              </div>
            </div>

            <div className="metrics-box">
              <div className="metric-item target">
                <span className="metric-label">Daily Target</span>
                <span className="metric-value">৳{DAILY_TARGET.toLocaleString()}</span>
              </div>
              <div className="metric-item achieved">
                <span className="metric-label">Achieved</span>
                <span className="metric-value">৳{Math.round(achieved).toLocaleString()}</span>
              </div>
              <div className={`metric-item ${remaining > 0 ? 'remaining' : 'surplus'}`}>
                <span className="metric-label">{remaining > 0 ? 'Remaining' : 'Surplus'}</span>
                <span className="metric-value">৳{Math.abs(Math.round(remaining)).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-section">
            <h3>Sales Performance Curve</h3>
            <div className="chart-wrapper">
              <svg className="sales-chart" viewBox="0 0 550 250" preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                <line x1="40" y1="20" x2="40" y2="220" stroke="#ddd" strokeWidth="1" />
                <line x1="40" y1="220" x2="520" y2="220" stroke="#ddd" strokeWidth="1" />

                {/* Y-axis labels */}
                <text x="35" y="25" fontSize="12" textAnchor="end" fill="#999">
                  ৳{(DAILY_TARGET * 1.2).toLocaleString()}
                </text>
                <text x="35" y="120" fontSize="12" textAnchor="end" fill="#999">
                  ৳{DAILY_TARGET.toLocaleString()}
                </text>
                <text x="35" y="225" fontSize="12" textAnchor="end" fill="#999">
                  ৳0
                </text>

                {/* Target line */}
                <line x1="40" y1={220 - (DAILY_TARGET / (DAILY_TARGET * 1.2)) * 200} x2="520" y2={220 - (DAILY_TARGET / (DAILY_TARGET * 1.2)) * 200}
                  stroke="#ff9800" strokeWidth="2" strokeDasharray="5,5" />
                <text x="525" y={220 - (DAILY_TARGET / (DAILY_TARGET * 1.2)) * 200 + 4} fontSize="11" fill="#ff9800" fontWeight="bold">
                  Target
                </text>

                {/* Achieved curve */}
                <path
                  d={generateCurvePath()}
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))" }}
                />

                {/* Curve fill */}
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`${generateCurvePath()} L 500 220 L 40 220 Z`}
                  fill="url(#curveGradient)"
                />

                {/* X-axis time labels */}
                <text x="40" y="240" fontSize="11" textAnchor="start" fill="#999">
                  12am
                </text>
                <text x="280" y="240" fontSize="11" textAnchor="middle" fill="#999">
                  12pm
                </text>
                <text x="520" y="240" fontSize="11" textAnchor="end" fill="#999">
                  12am
                </text>
              </svg>
            </div>
          </div>

          {/* Details Grid */}
          <div className="details-grid">
            <div className="detail-card">
              <span className="detail-icon">🛒</span>
              <div className="detail-content">
                <span className="detail-label">Total Orders</span>
                <span className="detail-value">{salesData?.grand_total_orders || 0}</span>
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-icon">💰</span>
              <div className="detail-content">
                <span className="detail-label">Average Order</span>
                <span className="detail-value">
                  ৳{salesData?.grand_total_orders > 0 
                    ? Math.round(achieved / salesData.grand_total_orders).toLocaleString() 
                    : '0'}
                </span>
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-icon">👥</span>
              <div className="detail-content">
                <span className="detail-label">Staff Count</span>
                <span className="detail-value">{salesData?.staff_sales?.length || 0}</span>
              </div>
            </div>
            {remaining > 0 && (
              <div className="detail-card target-gap">
                <span className="detail-icon">🎯</span>
                <div className="detail-content">
                  <span className="detail-label">Still Need</span>
                  <span className="detail-value">৳{Math.round(remaining).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Staff Performance (if available) */}
          {salesData?.staff_sales && salesData.staff_sales.length > 0 && (
            <div className="staff-performance">
              <h3>Top Performers</h3>
              <div className="staff-list">
                {[...salesData.staff_sales]
                  .sort((a, b) => b.total_sales - a.total_sales)
                  .slice(0, 5)
                  .map((staff, index) => (
                    <div key={staff.staff_id} className="staff-item">
                      <span className="staff-rank">#{index + 1}</span>
                      <div className="staff-info">
                        <span className="staff-name">{staff.staff_name}</span>
                        <span className="staff-orders">{staff.total_orders} orders</span>
                      </div>
                      <span className="staff-sales">৳{Math.round(staff.total_sales).toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Target;
