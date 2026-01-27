import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/register", form);
    alert("Registered successfully");
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <select name="role" onChange={handleChange}>
        <option value="customer">Customer</option>
        <option value="staff">Staff</option>
        <option value="supplier">Supplier</option>
        <option value="manager">Manager</option>
        <option value="owner">Owner</option>
      </select>

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
