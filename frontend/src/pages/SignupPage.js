// src/pages/SignupPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const API_URL = "http://localhost:5000/api";

export default function SignupPage() {
  const navigate = useNavigate();

  // Signup form state
  const [formData, setFormData] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit signup form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      alert("Signup successful! Please sign in.");
      navigate("/"); // go to login
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
          <h2 className="title">Fit@NWU Signup</h2>

          <form className="form" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              name="studentNumber"
              placeholder="Student Number"
              value={formData.studentNumber}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="email"
              name="email"
              placeholder="University Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Password with toggle */}
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

            <input
              className="input"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password 🔑"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {error && <p className="error-text">{error}</p>}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="switch-link">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
