const SupplierHeader = ({ setActive }) => {
  return (
    <aside className="supplier-sidebar">
      <h1>Supplier Panel</h1>
      <button onClick={() => setActive("notifications")}>New Orders</button>
      <button onClick={() => setActive("orders")}>Orders List</button>
      <button onClick={() => setActive("shop")}>Shop Info</button>
      <button onClick={() => setActive("invoice")}>Upload Invoice</button>
      
      <button className="logout-btn" onClick={() => setActive("logout")}>
        Logout
      </button>
    </aside>
  );
};

export default SupplierHeader;
