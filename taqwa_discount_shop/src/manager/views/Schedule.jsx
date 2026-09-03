import { useEffect, useState } from "react";
import { Plus, Edit, Save, X, Trash2, Users, Calendar } from "lucide-react";
import "./Schedule.css";

const Schedule = () => {
  const [staff, setStaff] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const shiftOptions = ["Morning (6AM-2PM)", "Afternoon (2PM-10PM)", "Evening (6PM-2AM)", "Full Day", "Off"];

  useEffect(() => {
    fetchStaffAndSchedules();
  }, []);

  const fetchStaffAndSchedules = async () => {
    setLoading(true);
    try {
      const [staffRes, scheduleRes] = await Promise.all([
        fetch("http://localhost:8000/schedule/staff", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }),
        fetch("http://localhost:8000/schedule/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
      ]);

      const staffData = await staffRes.json();
      const scheduleData = await scheduleRes.json();

      setStaff(staffData || []);
      
      // Create schedule map by staff_id
      const scheduleMap = {};
      scheduleData.forEach(s => {
        scheduleMap[s.staff_id] = s;
      });
      setSchedules(scheduleMap);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (staffId, day, value) => {
    const key = day.toLowerCase();
    setSchedules(prev => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        [key]: value
      }
    }));
  };

  const handleSaveSchedule = async (staffId) => {
    const schedule = schedules[staffId];
    if (!schedule) return;

    try {
      const response = await fetch("http://localhost:8000/schedule/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          staff_id: staffId,
          staff_name: schedule.staff_name || getStaffName(staffId),
          monday: schedule.monday || "Off",
          tuesday: schedule.tuesday || "Off",
          wednesday: schedule.wednesday || "Off",
          thursday: schedule.thursday || "Off",
          friday: schedule.friday || "Off",
          saturday: schedule.saturday || "Off",
          sunday: schedule.sunday || "Off"
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setSuccessMessage("Schedule saved successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        setEditingStaffId(null);
        fetchStaffAndSchedules();
      }
    } catch (err) {
      setError("Failed to save schedule: " + err.message);
      console.error(err);
    }
  };

  const handleDeleteSchedule = async (staffId) => {
    if (!window.confirm("Delete this schedule?")) return;

    try {
      const response = await fetch(`http://localhost:8000/schedule/${staffId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (response.ok) {
        setSuccessMessage("Schedule deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchStaffAndSchedules();
      }
    } catch (_err) {
      setError("Failed to delete schedule");
    }
  };

  const getStaffName = (staffId) => {
    const person = staff.find(s => s.id === staffId);
    return person?.name || "Unknown";
  };

  if (loading) {
    return <div className="schedule-container"><div className="loading-message">Loading schedule data...</div></div>;
  }

  return (
    <div className="schedule-container">
      {/* Header */}
      <div className="schedule-header">
        <div className="header-content">
          <h2><Calendar size={28} /> Staff Scheduling Management</h2>
          <p className="header-subtitle">Manage weekly shifts for all staff members</p>
        </div>
        <button className="refresh-btn" onClick={fetchStaffAndSchedules} disabled={loading}>
          🔄 Refresh
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-banner">
          <span>✅</span>
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon"><Users size={20} /></span>
          <div>
            <span className="stat-label">Total Staff</span>
            <span className="stat-value">{staff.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon"><Calendar size={20} /></span>
          <div>
            <span className="stat-label">Scheduled</span>
            <span className="stat-value">{Object.keys(schedules).length}</span>
          </div>
        </div>
      </div>

      {/* Staff Schedule Grid */}
      {staff.length > 0 ? (
        <div className="schedule-grid">
          {staff.map(person => {
            const schedule = schedules[person.id] || {
              staff_id: person.id,
              staff_name: person.name,
              monday: "Off",
              tuesday: "Off",
              wednesday: "Off",
              thursday: "Off",
              friday: "Off",
              saturday: "Off",
              sunday: "Off"
            };
            
            const isEditing = editingStaffId === person.id;

            return (
              <div key={person.id} className="schedule-card">
                {/* Card Header */}
                <div className="card-header">
                  <div className="staff-info">
                    <div className="avatar">{person.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3>{person.name}</h3>
                      <p>{person.email}</p>
                    </div>
                  </div>
                  <div className="card-actions">
                    {isEditing ? (
                      <>
                        <button
                          className="btn-action save"
                          onClick={() => handleSaveSchedule(person.id)}
                          title="Save schedule"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          className="btn-action cancel"
                          onClick={() => setEditingStaffId(null)}
                          title="Cancel editing"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-action edit"
                          onClick={() => setEditingStaffId(person.id)}
                          title="Edit schedule"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-action delete"
                          onClick={() => handleDeleteSchedule(person.id)}
                          title="Delete schedule"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Schedule Days */}
                <div className="days-grid">
                  {daysOfWeek.map(day => {
                    const dayKey = day.toLowerCase();
                    const value = schedule[dayKey] || "Off";

                    return (
                      <div key={day} className="day-item">
                        <label>{day.slice(0, 3)}</label>
                        {isEditing ? (
                          <select
                            value={value}
                            onChange={(e) => handleScheduleChange(person.id, day, e.target.value)}
                            className="day-select"
                          >
                            {shiftOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`day-value ${value === "Off" ? "off" : "working"}`}>
                            {value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Last Updated */}
                <div className="card-footer">
                  {schedule.updated_at && (
                    <small>Updated: {new Date(schedule.updated_at).toLocaleDateString()}</small>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Users size={48} />
          <p>No staff members found</p>
          <small>Add staff members to start scheduling</small>
        </div>
      )}
    </div>
  );
};

export default Schedule;
