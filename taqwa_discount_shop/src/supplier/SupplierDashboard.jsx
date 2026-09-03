import { useState } from "react";
import SupplierHeader from "./views/SupplierHeader";
import Notifications from "./views/Notifications";
import Orders from "./views/Orders";
import ShopInfo from "./views/ShopInfo";
import InvoiceUpload from "./views/InvoiceUpload";
import Logout from "./views/Logout";
import "./styles/supplier.css";

const SupplierDashboard = () => {
  const [active, setActive] = useState("notifications");

  const renderView = () => {
    switch (active) {
      case "notifications":
        return <Notifications />;
      case "orders":
        return <Orders />;
      case "shop":
        return <ShopInfo />;
      case "invoice":
        return <InvoiceUpload />;
     
      case "logout":
        return <Logout />;
      default:
        return <Notifications />;
    }
  };

  return (
    <div className="supplier-dashboard">
      <SupplierHeader setActive={setActive} />
      <div className="supplier-content">{renderView()}</div>
    </div>
  );
};

export default SupplierDashboard;
