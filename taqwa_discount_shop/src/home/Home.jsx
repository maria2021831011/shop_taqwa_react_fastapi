import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Taqwa Discount Shop</h1>
      <p>Welcome to our management system</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/login">
          <button>Login</button>
        </Link>

        <Link to="/register" style={{ marginLeft: "10px" }}>
          <button>Register</button>
        </Link>

        <Link to="/forgot-password" style={{ marginLeft: "10px" }}>
          <button>Forgot Password</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
