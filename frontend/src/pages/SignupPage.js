import React, { useState } from "react";
import "../styles/Auth.css"; // Import our shared CSS
import { Link, useNavigate } from "react-router-dom";

// Backend API base URL (adjust if your server runs elsewhere)
const API_URL = "http://localhost:5000/api";

export default function SignUpPage() {
  const navigate = useNavigate();

  // Form state (all signup fields)
  const [formData, setFormData] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI state (show/hide password toggle, error messages, loading)
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form state when input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit (send signup request to backend)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Quick check: password and confirm must match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(""); // clear previous error

    try {
      // Send POST request to backend /signup endpoint
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // If response is not ok → throw error
      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Success → go to signin page
      alert("Signup successful! Please sign in.");
      navigate("/signin");
    } catch (err) {
      // Show error message in UI
      setError(err.message);
    } finally {
      setLoading(false); // always stop loading spinner
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-form">
          <h2 className="title">Fit@NWU Signup</h2>

          {/* Signup form */}
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

            {/* First Name */}
            <input
              className="input"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            {/* Last Name */}
            <input
              className="input"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            {/* Email */}
            <input
              className="input"
              type="email"
              name="email"
              placeholder="University Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Password field with emoji toggle */}
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
              {/* Toggle button (👁️/🙈) */}
              <span
                className="icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Confirm Password */}
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password 🔑"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {/* Error message */}
            {error && <p className="error-text">{error}</p>}

            {/* Submit button */}
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Switch to Signin */}
          <p className="switch-link">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
