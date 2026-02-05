import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function AdminAuth({ setIsLoggedIn, setUserType }) {
  const [formData, setFormData] = useState({
    email: "",
    pass: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/admin/login",
        formData,
        {
          withCredentials: true,
        },
      );

      console.log("Admin auth response:", response.data);

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("userType", "admin");
        setIsLoggedIn(true);
        setUserType("admin");
        // Use setTimeout to ensure state updates before navigation
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      }
    } catch (err) {
      console.log("Admin auth error:", err);
      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Admin login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Admin Login</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pass">Password</label>
            <input
              id="pass"
              name="pass"
              type="password"
              placeholder="Enter admin password"
              value={formData.pass}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Processing..." : "Admin Login"}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            User?
            <a href="/login" className="toggle-btn">
              User Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
