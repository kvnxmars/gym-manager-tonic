import React, { useState } from "react";
import "../../styles/Auth.css"; 
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function SignInPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentNumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.studentNumber.includes("@")
            ? formData.studentNumber
            : undefined,
          studentNumber: formData.studentNumber.includes("@")
            ? undefined
            : formData.studentNumber,
          password: formData.password,
        }),
      });

      const data = await res.json();

      // If login failed
      if (!res.ok) {
        throw new Error(data.message || "Signin failed");
      }

      // Save token + student info in localStorage (so PWA can persist login)
      window.sessionStorage.setItem("token", data.token);
      //window.sessionStorage.setItem("student", JSON.stringify(data.student));
      window.sessionStorage.setItem("userRole", data.role);

      // ✅ Navigate based on role
      navigate(data.role === "admin" ? "/staff-dashboard" : "/student-dashboard");
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

            {error && <p className="error-text">{error}</p>}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="switch-link">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
