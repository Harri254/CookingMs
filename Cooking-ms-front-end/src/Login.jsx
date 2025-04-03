import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.css';

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      console.log("Captured values:", id, password);
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        id,
        password,
      });

      console.log(response);

      if (response.data.role === "admin") {
        navigate("/admin"); // Redirect to admin dashboard
      } else if (response.data.role === "chef") {
        navigate("/admin/cook-mode"); // Redirect to user dashboard
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.error || error.message
      ); // Log the full error
      setError(error.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Sign In</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setError("");
              }}
              required
              className="form-input"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
              className="form-input"
            />
          </div>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          {/* Submit Button */}
          <button type="submit" className="login-button">
            Log In
          </button>

          {/* Additional Links */}
          <div className="login-links">
            <p className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
            <p className="create-account">
              <Link to="/create-account">Create Account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;