const OwnerHeader = ({ setActive }) => {
  return (
    <aside className="owner-sidebar">
      <h1>Owner Panel</h1>

      <button onClick={() => setActive("overview")}>Business Overview</button>
      <button onClick={() => setActive("sales")}>Sales Graph</button>
      <button onClick={() => setActive("performance")}>Staff Performance</button>
      <button onClick={() => setActive("profit")}>Profit & Loss</button>
      <button onClick={() => setActive("stock")}>Stock Overview</button>
      <button onClick={() => setActive("activity")}>Activity Log</button>
      <button onClick={() => setActive("notifications")}>Notifications</button>

      <button className="logout-btn" onClick={() => setActive("logout")}>
        Logout
      </button>
    </aside>
  );
};

export default OwnerHeader;
