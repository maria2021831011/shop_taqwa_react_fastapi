/*import { useEffect, useState } from "react";
import "./Overview.css";
const Overview = () => {
  const [data, setData] = useState({
    total_sales: 0,
    net_profit: 0,
    total_employees: 0,
    active_products: 0
  });

  const fetchOverview = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://shop-taqwa-react-fastapi-2.onrender.com/owner/overview", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchOverview();

    const interval = setInterval(fetchOverview, 5000); // 🔄 real-time
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Business Overview</h2>

      <div className="grid">
        <div className="card">
          Total Sales: ৳{data.total_sales.toLocaleString()}
        </div>

        <div className="card">
          Net Profit: ৳{data.net_profit.toLocaleString()}
        </div>

        <div className="card">
          Total Employees: {data.total_employees}
        </div>

        <div className="card">
          Active Products: {data.active_products}
        </div>
      </div>
    </div>
  );
};

export default Overview;

*/
import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Users, Package, RefreshCw } from "lucide-react";
import "./Overview.css";

const Overview = () => {
  const [data, setData] = useState({
    total_sales: 0,
    net_profit: 0,
    total_employees: 0,
    active_products: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://shop-taqwa-react-fastapi-2.onrender.com/owner/overview", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchOverview();

    const interval = setInterval(fetchOverview, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-BD');
  };

  if (loading) {
    return (
      <div className="overview-container">
        <div className="overview-header">
          <h4>Business Overview</h4>
        </div>
        <div className="grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card" style={{ minHeight: '180px' }}>
              <div className="card-content">
                <div className="card-icon">
                  <div className="loading-shimmer" style={{ width: '32px', height: '32px', borderRadius: '8px' }}></div>
                </div>
                <div className="loading-shimmer" style={{ width: '80px', height: '16px', borderRadius: '4px', marginBottom: '12px' }}></div>
                <div className="loading-shimmer" style={{ width: '120px', height: '32px', borderRadius: '6px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h4>Business Overview</h4>
        <div className="live-indicator">
          <div className="live-dot"></div>
          <span>Live Updates</span>
          <RefreshCw size={14} />
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <TrendingUp size={24} />
            </div>
            <div className="card-title">
              Total Sales
            </div>
            <div className="card-value">
              <span >{formatCurrency(data.total_sales)}</span>
            </div>
            <div className="card-subtitle">
              All-time revenue
            </div>
            <div className="card-progress"></div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <DollarSign size={24} />
            </div>
            <div className="card-title">
              Net Profit
            </div>
            <div className="card-value">
              <span >{formatCurrency(data.net_profit)}</span>
            </div>
            <div className="card-subtitle">
              After expenses
            </div>
            <div className="card-progress"></div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <Users size={24} />
            </div>
            <div className="card-title">
              Total Employees
            </div>
            <div className="card-value">
              {data.total_employees}
            </div>
            <div className="card-subtitle">
              Active team members
            </div>
            <div className="card-progress"></div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="card-icon">
              <Package size={24} />
            </div>
            <div className="card-title">
              Active Products
            </div>
            <div className="card-value">
              {data.active_products}
            </div>
            <div className="card-subtitle">
              Currently available
            </div>
            <div className="card-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
