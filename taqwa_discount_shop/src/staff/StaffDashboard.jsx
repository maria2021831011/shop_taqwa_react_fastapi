/*
import { useState } from "react";
import StaffHeader from "./views/StaffHeader";
import POS from "./views/POS";
import ProductSearch from "./views/ProductSearch";
import CustomerForm from "./views/CustomerForm";
import SalesSummary from "./views/SalesSummary";
import Performance from "./views/Performance";
import Stock from "./views/Stock";
import Logout from "./views/Logout";
import "./styles/staff.css";

const StaffDashboard = () => {
  const [active, setActive] = useState("pos");

  const renderPage = () => {
    switch (active) {
      case "pos":
        return <POS />;
      case "search":
        return <ProductSearch />;
      case "customer":
        return <CustomerForm />;
      case "sales":
        return <SalesSummary />;
      case "performance":
        return <Performance />;
      case "stock":
        return <Stock />;
      case "logout":
        return <Logout />;
      default:
        return <POS />;
    }
  };

  return (
    <div className="staff-dashboard">
      <StaffHeader setActive={setActive} />
      <div className="staff-content">{renderPage()}</div>
    </div>
  );
};

export default StaffDashboard;

*/
import { useState } from "react";
import StaffHeader from "./views/StaffHeader";
import POS from "./views/POS";
import MySchedule from "./views/Schedule";
import CustomerForm from "./views/CustomerForm";
import SalesSummary from "./views/SalesSummary";
import Performance from "./views/Performance";
import Stock from "./views/Stock";
import Logout from "./views/Logout";
import "./styles/staff.css";

const StaffDashboard = () => {
  const [active, setActive] = useState("pos");

  const renderPage = () => {
    switch (active) {
      case "pos":
        return (
          <div>
            <div className="page-header">
              <h1>POS System</h1>
              <p>Process sales and manage transactions</p>
            </div>
            <POS />
          </div>
        );
      case "schedule":
        return (
          <div>
            <div className="page-header">
              <h1>My Schedule</h1>
              <p>Your assigned shifts for the week</p>
            </div>
            <MySchedule />
          </div>
        );


      case "customer":
        return (
          <div>
            <div className="page-header">
              <h1>Customer Management</h1>
              <p>Add and manage customer information</p>
            </div>
            <CustomerForm />
          </div>
        );
      case "sales":
        return (
          <div>
            <div className="page-header">
              <h1>Sales Summary</h1>
              <p>Today's sales overview and analytics</p>
            </div>
            <SalesSummary />
          </div>
        );
      case "performance":
        return (
          <div>
            <div className="page-header">
              <h1>Performance Dashboard</h1>
              <p>Track your sales performance and targets</p>
            </div>
            <Performance />
          </div>
        );
      case "stock":
        return (
          <div>
            <div className="page-header">
              <h1>Stock Management</h1>
              <p>Monitor and manage inventory levels</p>
            </div>
            <Stock />
          </div>
        );
      case "logout":
        return <Logout />;
      default:
        return <POS />;
    }
  };

  return (
    <div className="staff-dashboard">
      <StaffHeader setActive={setActive} active={active} />
      <div className="staff-content">
        {renderPage()}
      </div>
    </div>
  );
};

export default StaffDashboard;
