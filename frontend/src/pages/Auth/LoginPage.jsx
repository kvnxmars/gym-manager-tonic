import React, { useState } from "react";
import "../../styles/Auth.css"; // shared CSS
import { Link, useNavigate } from "react-router-dom";

// Backend API base URL (adjust if needed)
const API_URL = "http://localhost:5000/api";

export default function SignInPage() {
  const navigate = useNavigate();

  // Form state for login
  const [formData, setFormData] = useState({
    studentNumber: "",
    password: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send POST request to backend /signin
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // If login failed
      if (!res.ok) {
        throw new Error(data.message || "Signin failed");
      }

      // Save token + student info in localStorage (so PWA can persist login)
      localStorage.setItem("token", data.token);
      localStorage.setItem("student", JSON.stringify(data.student));

      // Redirect to dashboard (once created)
      //alert("Login successful! 🎉");
      navigate("/student-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-form">
          <h2 className="title">Fit@NWU Signin</h2>

          {/* Signin form */}
          <form className="form" onSubmit={handleSubmit}>
            {/* Student Number */}
            <input
              className="input"
              type="text"
              name="studentNumber"
              placeholder="Student Number"
              value={formData.studentNumber}
              onChange={handleChange}
              required
            />

            {/* Password with emoji toggle */}
            <div className="input-container">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password 🔑"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Error message */}
            {error && <p className="error-text">{error}</p>}

            {/* Submit button */}
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Switch to Signup */}
          <p className="switch-link">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
