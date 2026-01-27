import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://127.0.0.1:8000/login", form);

    const { token, role } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // Role based redirect
    if (role === "customer") navigate("/customer");
    else if (role === "staff") navigate("/staff");
    else if (role === "supplier") navigate("/supplier");
    else if (role === "manager") navigate("/manager");
    else if (role === "owner") navigate("/owner");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
