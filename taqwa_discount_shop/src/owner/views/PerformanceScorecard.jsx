/*import { useEffect, useState } from "react";

const PerformanceScorecard = () => {
  const [employees, setEmployees] = useState([]);

  const fetchPerformance = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://shop-taqwa-react-fastapi-2.onrender.com/owner/employee-performance",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const renderStars = (count) => {
    return "⭐".repeat(count) + "☆".repeat(5 - count);
  };

  return (
    <div>
      <h2>Employee Performance</h2>

      <div className="card">
        {employees.map((emp, index) => (
          <p key={index}>
            {emp.name} – {renderStars(emp.rating)} – ৳
            {emp.sales.toLocaleString()} Sales
          </p>
        ))}
      </div>
    </div>
  );
};

export default PerformanceScorecard;
*/
import { useEffect, useState } from "react";
import { TrendingUp, Award, Star } from "lucide-react";
import "./PerformanceScorecard.css";

const PerformanceScorecard = () => {
  const [employees, setEmployees] = useState([]);

  const fetchPerformance = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://shop-taqwa-react-fastapi-2.onrender.com/owner/employee-performance",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const renderStars = (count) => {
    return "⭐".repeat(count) + "☆".repeat(5 - count);
  };

  const getPerformanceLevel = (rating) => {
    if (rating >= 4.5) return { label: "Excellent", class: "badge-excellent" };
    if (rating >= 4.0) return { label: "Good", class: "badge-good" };
    if (rating >= 3.0) return { label: "Average", class: "badge-average" };
    return { label: "Needs Improvement", class: "badge-poor" };
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Sort employees by sales (descending)
  const sortedEmployees = [...employees].sort((a, b) => b.sales - a.sales);

  if (employees.length === 0) {
    return (
      <div className="performance-container">
        <h2>Employee Performance</h2>
        <div className="empty-state">
          <Star size={48} />
          <p>No performance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Employee Performance Scorecard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
          <Award size={16} />
          <span>Top Performers</span>
        </div>
      </div>

      <div className="performance-card">
        <table className="performance-table">
          <thead className="table-header">
            <tr>
              <th>Rank</th>
              <th>Employee</th>
              <th>Rating</th>
              <th>Sales</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {sortedEmployees.map((emp, index) => {
              const performance = getPerformanceLevel(emp.rating);
              const initials = getInitials(emp.name);
              
              return (
                <tr key={index} className={`rank-${index + 1}`}>
                  <td className="rank-cell">
                    <div className="rank-badge">
                      {index + 1}
                    </div>
                  </td>
                  <td className="name-cell">
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{emp.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Employee ID: #{emp.id || index + 1001}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="rating-cell">
                    <span className="star-rating">{renderStars(emp.rating)}</span>
                    <span className="rating-value">{emp.rating.toFixed(1)}</span>
                  </td>
                  <td className="sales-cell">
                    <div className="sales-amount">
                      <TrendingUp size={16} className="sales-icon" />
                      <span>৳{emp.sales.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="performance-cell">
                    <span className={`performance-badge ${performance.class}`}>
                      {performance.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div style={{
        marginTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        background: '#f8fafc',
        padding: '16px 24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Total Employees</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            {employees.length}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Avg. Rating</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>
            {(employees.reduce((sum, emp) => sum + emp.rating, 0) / employees.length).toFixed(1)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Total Sales</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
            ৳{employees.reduce((sum, emp) => sum + emp.sales, 0).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceScorecard;
