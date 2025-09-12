// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const LoginPage = () => {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        studentNumber,
        password,
      });

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      // Navigate based on role
      if (res.data.role === "student") {
        navigate("/student-dashboard");
      } else if (res.data.role === "staff") {
        navigate("/staff-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-form">
          <h1 className="title">Sign In</h1>
          <form onSubmit={handleLogin} className="form">
            <input
              type="text"
              placeholder="Student Number"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            {error && <p className="error-text">{error}</p>}
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>
          <p className="switch-link">
            Don’t have an account?{" "}
            <a href="/signup" className="link">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
