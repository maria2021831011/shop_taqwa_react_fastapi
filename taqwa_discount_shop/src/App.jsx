import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./home/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";

import CustomerDashboard from "./customer/CustomerDashboard";
import StaffDashboard from "./staff/StaffDashboard";
import SupplierDashboard from "./supplier/SupplierDashboard";
import ManagerDashboard from "./manager/ManagerDashboard";
import OwnerDashboard from "./owner/OwnerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Role based dashboards */}
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/supplier" element={<SupplierDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
