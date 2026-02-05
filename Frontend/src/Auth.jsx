import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Auth({ setIsLoggedIn, setUserType }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
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
      const endpoint = isSignup ? "/auth/user/signup" : "/auth/user/login";
      const payload = isSignup
        ? formData
        : { email: formData.email, pass: formData.pass };

      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        payload,
        {
          withCredentials: true,
        },
      );

      console.log("Auth response:", response.data);

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userType", "user");
        setIsLoggedIn(true);
        setUserType("user");
        navigate("/");
      }
    } catch (err) {
      console.log("Auth error:", err);
      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Authentication failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isSignup ? "Create Account" : "Login"}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              value={formData.pass}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
              }}
              className="toggle-btn"
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>

        <div className="demo-info">
          <p>
            <strong>Demo Admin:</strong>
          </p>
          <p>Email: admin@example.com | Pass: admin123</p>
        </div>
      </div>
    </div>
  );
}
