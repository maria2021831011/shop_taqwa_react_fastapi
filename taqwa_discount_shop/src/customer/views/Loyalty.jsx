import { useEffect, useState } from "react";
import axios from "axios";
import "./Loyalty.css";

const Loyalty = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/loyalty/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching loyalty data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyalty();
  }, []);

  // Calculate discount tiers
  const calculateDiscount = (coinPoints) => {
    const tiers = Math.floor(coinPoints / 10);
    const discount = tiers * 5;
    const nextTier = (tiers + 1) * 10;
    const coinsNeeded = nextTier - coinPoints;
    const progress = (coinPoints % 10) / 10 * 100;
    
    return {
      currentDiscount: Math.min(discount, 50), // Max 50% discount
      nextTierDiscount: Math.min((tiers + 1) * 5, 50),
      coinsNeeded,
      progress,
      tier: tiers + 1
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading loyalty data...</p>
      </div>
    );
  }

  if (!data) return <p className="error-message">Unable to load loyalty data.</p>;

  const { currentDiscount, nextTierDiscount, coinsNeeded, progress, tier } = 
    calculateDiscount(data.customer.coin_points);

  return (
    <div className="loyalty-container">
      {/* Header */}
      <div className="loyalty-header">
        <h1>🎯 Loyalty Dashboard</h1>
        <div className="user-badge">
          <span className="badge-icon">👑</span>
          Tier {tier} Member
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card coin-card">
          <div className="stat-icon">🪙</div>
          <div className="stat-content">
            <h3>Coin Points</h3>
            <div className="stat-value">{data.customer.coin_points}</div>
            <p className="stat-subtitle">Total coins earned</p>
          </div>
        </div>

        <div className="stat-card offer-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Offer Points</h3>
            <div className="stat-value">{data.customer.offer_points}</div>
            <p className="stat-subtitle">Available for offers</p>
          </div>
        </div>

        <div className="stat-card discount-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>Current Discount</h3>
            <div className="stat-value">{currentDiscount}%</div>
            <p className="stat-subtitle">On all products</p>
          </div>
        </div>
      </div>

      {/* Discount Progress */}
      <div className="discount-section">
        <div className="section-header">
          <h2>🎯 Discount Progress</h2>
          <span className="next-tier">Next: {nextTierDiscount}% off</span>
        </div>
        
        <div className="progress-container">
          <div className="progress-labels">
            <span>Current: {currentDiscount}% off</span>
            <span>Next Tier: {nextTierDiscount}% off</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="progress-info">
            <p>
              <strong>{coinsNeeded} more coins</strong> needed for next {nextTierDiscount}% discount tier
            </p>
            <div className="tier-info">
              <div className="tier">
                <span className="tier-number">Tier 1</span>
                <span className="tier-discount">5% off</span>
              </div>
              <div className="tier">
                <span className="tier-number">Tier 2</span>
                <span className="tier-discount">10% off</span>
              </div>
              <div className="tier">
                <span className="tier-number">Tier 3</span>
                <span className="tier-discount">15% off</span>
              </div>
              <div className="tier">
                <span className="tier-number">Tier 4</span>
                <span className="tier-discount">20% off</span>
              </div>
              <div className="tier">
                <span className="tier-number">Tier 5</span>
                <span className="tier-discount">25% off</span>
              </div>
            </div>
          </div>
        </div>

        <div className="discount-explanation">
          <h4>🎁 How It Works:</h4>
          <ul>
            <li>Every 10 coins = 5% additional discount on all products</li>
            <li>Maximum discount capped at 50%</li>
            <li>1 coin = 1 BDT spent on purchases</li>
            <li>Discount applies automatically at checkout</li>
          </ul>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="section-header">
          <h2>📈 Recent Activity</h2>
          <span className="activity-count">{data.transactions.length} transactions</span>
        </div>

        <div className="activity-list">
          {data.transactions.map((t, i) => (
            <div key={i} className="activity-card">
              <div className="activity-icon">
                {t.type === 'PURCHASE' ? '🛒' : 
                 t.type === 'BONUS' ? '🎁' : 
                 t.type === 'REDEEM' ? '🔄' : '💰'}
              </div>
              <div className="activity-details">
                <div className="activity-header">
                  <h4>{t.type.replace('_', ' ')}</h4>
                  <span className={`amount ${t.amount >= 0 ? 'positive' : 'negative'}`}>
                    {t.amount >= 0 ? '+' : ''}৳{Math.abs(t.amount)}
                  </span>
                </div>
                <p className="activity-description">{t.description}</p>
                {t.coins_earned && (
                  <div className="coins-earned">
                    <span className="coin-icon">🪙</span>
                    +{t.coins_earned} coins
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loyalty;