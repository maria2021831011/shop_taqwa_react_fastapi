/*import { useEffect, useState } from "react";

const ProfitLoss = () => {
  const [data, setData] = useState(null);

  const fetchProfitLoss = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://127.0.0.1:8000/owner/profit-loss",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchProfitLoss();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profit & Loss</h2>

      <div className="card">
        <p>Total Revenue: ৳{data.revenue.toLocaleString()}</p>
        <p>Purchases: ৳{data.purchase_expenses.toLocaleString()}</p>
        <p>Staff Salaries: ৳{data.staff_salaries.toLocaleString()}</p>
        <p>Manager Salaries: ৳{data.manager_salaries.toLocaleString()}</p>
        <hr />
        <p>
          <strong>
            Net Profit: ৳{data.profit.toLocaleString()}
          </strong>
        </p>
      </div>
    </div>
  );
};

export default ProfitLoss;

*/
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Users, Briefcase, Package } from "lucide-react";
import "./ProfitLoss.css";

const ProfitLoss = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfitLoss = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/owner/profit-loss",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching profit/loss:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfitLoss();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('BDT', '৳');
  };

  const calculateProfitMargin = () => {
    if (!data || data.revenue === 0) return 0;
    return (data.profit / data.revenue) * 100;
  };

  const calculateExpenses = () => {
    if (!data) return 0;
    return data.purchase_expenses + data.staff_salaries + data.manager_salaries;
  };

  if (loading) {
    return (
      <div className="profitloss-container">
        <h2>Profit & Loss Statement</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p style={{ color: '#6b7280' }}>Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="profitloss-container">
        <h2>Profit & Loss Statement</h2>
        <div className="loading-container">
          <TrendingDown size={48} color="#9ca3af" />
          <p style={{ color: '#6b7280' }}>Unable to load financial data</p>
        </div>
      </div>
    );
  }

  const profitMargin = calculateProfitMargin();
  const totalExpenses = calculateExpenses();

  return (
    <div className="profitloss-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Profit & Loss Statement</h2>
        <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={16} />
          <span>Monthly Financial Report</span>
        </div>
      </div>

      <div className="profitloss-dashboard">
        {/* Summary Banner */}
        <div className="summary-banner">
          <div className="summary-label">Net Profit</div>
          <div className="summary-value">{formatCurrency(data.profit)}</div>
          <div className="summary-period">Current Month</div>
        </div>

        {/* Main Metrics */}
        <div className="details-grid">
          {/* Revenue Card */}
          <div className="category-card revenue">
            <div className="category-header">
              <div className="category-title">Total Revenue</div>
              <div className="category-icon">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="category-amount">{formatCurrency(data.revenue)}</div>
            <div className="category-percentage positive">
              +100% Base
            </div>
          </div>

          {/* Expenses Card */}
          <div className="category-card expenses">
            <div className="category-header">
              <div className="category-title">Total Expenses</div>
              <div className="category-icon">
                <TrendingDown size={20} />
              </div>
            </div>
            <div className="category-amount">{formatCurrency(totalExpenses)}</div>
            <div className="category-percentage negative">
              -{((totalExpenses / data.revenue) * 100).toFixed(1)}% of Revenue
            </div>
          </div>

          {/* Profit Card */}
          <div className="category-card profit">
            <div className="category-header">
              <div className="category-title">Profit Margin</div>
              <div className="category-icon">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="category-amount">{profitMargin.toFixed(1)}%</div>
            <div className="category-percentage positive">
              {profitMargin > 20 ? 'Excellent' : profitMargin > 10 ? 'Good' : 'Moderate'}
            </div>
          </div>
        </div>

        {/* Profit Visual Bar */}
        <div className="profit-bar">
          <div 
            className="profit-fill" 
            style={{ width: `${profitMargin > 0 ? profitMargin : 0}%` }}
          ></div>
        </div>
        <div className="profit-text">
          <span>Expenses: {formatCurrency(totalExpenses)}</span>
          <span>Profit Margin: {profitMargin.toFixed(1)}%</span>
          <span>Revenue: {formatCurrency(data.revenue)}</span>
        </div>

        {/* Expense Breakdown */}
        <div className="expense-breakdown">
          <h3>Expense Breakdown</h3>
          <div className="expense-list">
            <div className="expense-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Package size={18} color="#ef4444" />
                <div>
                  <div className="expense-label">Purchase Expenses</div>
                  <div className="expense-value">{formatCurrency(data.purchase_expenses)}</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>
                {((data.purchase_expenses / totalExpenses) * 100).toFixed(0)}%
              </div>
            </div>

            <div className="expense-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={18} color="#f59e0b" />
                <div>
                  <div className="expense-label">Staff Salaries</div>
                  <div className="expense-value">{formatCurrency(data.staff_salaries)}</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '600' }}>
                {((data.staff_salaries / totalExpenses) * 100).toFixed(0)}%
              </div>
            </div>

            <div className="expense-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Briefcase size={18} color="#8b5cf6" />
                <div>
                  <div className="expense-label">Manager Salaries</div>
                  <div className="expense-value">{formatCurrency(data.manager_salaries)}</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '600' }}>
                {((data.manager_salaries / totalExpenses) * 100).toFixed(0)}%
              </div>
            </div>

            <div className="expense-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <DollarSign size={18} color="#10b981" />
                <div>
                  <div className="expense-label">Net Profit</div>
                  <div className="expense-value" style={{ color: '#10b981' }}>
                    {formatCurrency(data.profit)}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
                {profitMargin.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div style={{
          padding: '24px 32px',
          background: '#f8fafc',
          borderTop: '1px solid #e5e7eb',
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span>Revenue:</span>
            <span style={{ fontWeight: '600', color: '#1f2937' }}>{formatCurrency(data.revenue)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span>Total Expenses:</span>
            <span style={{ fontWeight: '600', color: '#ef4444' }}>-{formatCurrency(totalExpenses)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            paddingTop: '12px',
            borderTop: '2px solid #e5e7eb',
            marginTop: '12px',
            fontWeight: '700',
            fontSize: '16px',
            color: profitMargin >= 0 ? '#059669' : '#ef4444'
          }}>
            <span>Net Profit:</span>
            <span>{formatCurrency(data.profit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLoss;