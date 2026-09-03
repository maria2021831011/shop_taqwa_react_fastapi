import { useEffect, useState } from "react";
import "./DailySales.css";

const DailySales = () => {
  const [data, setData] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://shop-taqwa-react-fastapi-2.onrender.com/manager/daily-sales?date=${date}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const result = await response.json();
        setData(result);
      } catch (_err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  return (
    <div className="daily-sales-container">
      <div className="daily-sales-header">
        <h2>Daily Sales Report</h2>
        <div className="date-picker-wrapper">
          <label htmlFor="date-input">Select Date:</label>
          <input
            id="date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      {!date && <p className="info-message">Please select a date to view sales data</p>}

      {loading && <p className="loading-message">Loading...</p>}

      {error && <p className="error-message">{error}</p>}

      {data && (
        <div className="sales-content">
          {/* Staff-wise sales */}
          <div className="sales-table-wrapper">
            <h3>Staff Performance</h3>
            <div className="table-container">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Total Orders</th>
                    <th>Total Sales (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.staff_sales && data.staff_sales.length > 0 ? (
                    data.staff_sales.map((staff) => (
                      <tr key={staff.staff_id}>
                        <td>{staff.staff_name}</td>
                        <td>{staff.total_orders}</td>
                        <td>৳{staff.total_sales.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No sales data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final summary */}
          <div className="summary-card">
            <h3>Daily Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total Orders:</span>
                <span className="summary-value">{data.grand_total_orders}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Sales:</span>
                <span className="summary-value">৳{data.grand_total_sales.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySales;
