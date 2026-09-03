import { useState } from "react";
import ManagerHeader from "./views/ManagerHeader";
import DailySales from "./views/DailySales";
import LiveStock from "./views/LiveStock";
import Target from "./views/Target";
import Schedule from "./views/Schedule";
import Feedback from "./views/Feedback";
import PendingOrders from "./views/PendingOrders";
import Logout from "./views/Logout";
import "./styles/manager.css";

const ManagerDashboard = () => {
  const [active, setActive] = useState("sales");

  const renderView = () => {
    switch (active) {
      case "sales":
        return <DailySales />;
      case "stock":
        return <LiveStock />;
      case "target":
        return <Target />;
      case "schedule":
        return <Schedule />;
      case "feedback":
        return <Feedback />;
      case "orders":
        return <PendingOrders />;
      case "logout":
        return <Logout />;
      default:
        return <DailySales />;
    }
  };

  return (
    <div className="manager-dashboard">
      <ManagerHeader setActive={setActive} />
      <div className="manager-content">{renderView()}</div>
    </div>
  );
};

export default ManagerDashboard;
