import { useEffect, useState } from "react";
import { Calendar, Clock, User, RefreshCw } from "lucide-react";
import "./Schedule.css";

const MySchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [staffName, setStaffName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    fetchStaffSchedule();
    const interval = setInterval(fetchStaffSchedule, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStaffSchedule = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }
      
      // Decode JWT to get user info (basic decoding)
      const parts = token.split(".");
      if (parts.length !== 3) {
        setError("Invalid token format");
        setLoading(false);
        return;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      const userId = payload.id;
      
      setStaffName(payload.name || "Staff Member");

      const response = await fetch(`https://shop-taqwa-react-fastapi-2.onrender.com/schedule/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSchedule(data);
        setError(null);
      } else {
        const errorData = await response.text();
        setError(`Failed: ${response.status} - ${errorData || "Could not fetch schedule"}`);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error("Schedule fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getShiftColor = (shift) => {
    if (shift === "Off") return "#eacecc";
    if (shift.includes("Morning")) return "#4CAF50";
    if (shift.includes("Afternoon")) return "#2196F3";
    if (shift.includes("Evening")) return "#ff9800";
    if (shift === "Full Day") return "#9C27B0";
    return "#140c0c";
  };

  const getShiftEmoji = (shift) => {
    if (shift === "Off") return "😴";
    if (shift.includes("Morning")) return "🌅";
    if (shift.includes("Afternoon")) return "☀️";
    if (shift.includes("Evening")) return "🌙";
    if (shift === "Full Day") return "💼";
    return "📅";
  };

  if (loading) {
    return (
      <div className="schedule-staff-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-staff-container">
      {/* Header */}
      <div className="schedule-header">
        <div className="header-content">
          <div className="header-title">
            <Calendar size={32} />
            <div>
              <h2>📅 My Weekly Schedule</h2>
              <h3 className="header-subtitle">Your assigned shifts for the week</h3>
            </div>
          </div>
          <button className="refresh-btn" onClick={fetchStaffSchedule} disabled={loading} title="Refresh schedule">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Staff Info Card */}
      <div className="staff-info-card">
        <div className="info-icon">
          <User size={24} />
        </div>
        <div className="info-content">
          <h3>{staffName}</h3>
          <p>Employee Schedule</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Schedule Grid */}
      {schedule ? (
        <div className="weekly-schedule">
          <div className="schedule-grid">
            {daysOfWeek.map((day) => {
              const dayKey = day.toLowerCase();
              const shift = schedule[dayKey] || "Off";
              const isOff = shift === "Off";

              return (
                <div
                  key={day}
                  className={`day-card ${isOff ? "off-day" : "working-day"}`}
                  style={{ borderLeftColor: getShiftColor(shift) }}
                >
                  <div className="day-name">{day}</div>
                  
                  <div className="shift-emoji">{getShiftEmoji(shift)}</div>
                  
                  <div className="shift-content">
                    <div className="shift-badge" style={{ backgroundColor: getShiftColor(shift) }}>
                      {shift}
                    </div>
                  </div>

                  {!isOff && (
                    <div className="shift-icon">
                      <Clock size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Schedule Summary */}
          <div className="schedule-summary">
            <div className="summary-card">
              <span className="summary-label">Working Days</span>
              <span className="summary-value">
                {daysOfWeek.filter(day => schedule[day.toLowerCase()] !== "Off").length}
              </span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Off Days</span>
              <span className="summary-value">
                {daysOfWeek.filter(day => schedule[day.toLowerCase()] === "Off").length}
              </span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Last Updated</span>
              <span className="summary-value">
                {schedule.updated_at 
                  ? new Date(schedule.updated_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Shift Legend */}
          <div className="shift-legend">
            <h4>📝 Shift Types</h4>
            <div className="legend-grid">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#4CAF50" }}></div>
                <span>Morning (6AM - 2PM)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#2196F3" }}></div>
                <span>Afternoon (2PM - 10PM)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#ff9800" }}></div>
                <span>Evening (6PM - 2AM)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#9C27B0" }}></div>
                <span>Full Day</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#f44336" }}></div>
                <span>Off Day</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="info-box">
            <p>📋 <strong>Note:</strong> Your schedule is updated by the manager. Check back regularly for any changes.</p>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <Calendar size={48} />
          <p>No schedule found</p>
          <small>Please contact your manager to set up your schedule</small>
        </div>
      )}
    </div>
  );
};

export default MySchedule;
