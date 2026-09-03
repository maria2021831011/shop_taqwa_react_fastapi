import { useState } from "react";
import OwnerHeader from "./views/OwnerHeader";
import Overview from "./views/Overview";
import SalesGraph from "./views/SalesGraph";
import PerformanceScorecard from "./views/PerformanceScorecard";
import ProfitLoss from "./views/ProfitLoss";
import StockOverview from "./views/StockOverview";
import ActivityLog from "./views/ActivityLog";
import Notifications from "./views/Notifications";
import Logout from "./views/Logout";
import "./styles/owner.css";

const OwnerDashboard = () => {
  const [active, setActive] = useState("overview");

  const renderView = () => {
    switch (active) {
      case "overview":
        return <Overview />;
      case "sales":
        return <SalesGraph />;
      case "performance":
        return <PerformanceScorecard />;
      case "profit":
        return <ProfitLoss />;
      case "stock":
        return <StockOverview />;
      case "activity":
        return <ActivityLog />;
      case "notifications":
        return <Notifications />;
      case "logout":
        return <Logout />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="owner-dashboard">
      <OwnerHeader setActive={setActive} />
      <div className="owner-content">{renderView()}</div>
    </div>
  );
};

export default OwnerDashboard;
