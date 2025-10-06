import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function AdminSignup() {
  const [formData, setFormData] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      setMessage("✅ " + data.message);
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="admin-auth-form">
      <h2>Admin Sign Up</h2>
      <input
        type="text"
        name="studentNumber"
        placeholder="Student Number"
        value={formData.studentNumber}
        onChange={handleChange}
      />
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      <button onClick={handleSignup}>Sign Up</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminSignup;
