const ManagerHeader = ({ setActive }) => {
  return (
    <aside className="manager-sidebar">
      <h3>Manager Panel</h3>

      <button onClick={() => setActive("sales")}>Daily Sales</button>
      <button onClick={() => setActive("stock")}>Live Stock</button>
      <button onClick={() => setActive("target")}>Target</button>
      <button onClick={() => setActive("schedule")}>Staff Schedule</button>
      <button onClick={() => setActive("feedback")}>Customer Feedback</button>
      <button onClick={() => setActive("orders")}> Orders</button>

      <button className="logout-btn" onClick={() => setActive("logout")}>
        Logout
      </button>
    </aside>
  );
};

export default ManagerHeader;
