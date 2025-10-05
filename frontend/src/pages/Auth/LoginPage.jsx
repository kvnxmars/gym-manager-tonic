import { useState } from "react";
import "../../styles/Auth.css"; 
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;


export default function SignInPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
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

      //determine if input is email or student number
      const isEmail = formData.identifier.includes("@");


      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: isEmail ? formData.identifier: undefined,
          studentNumber: !isEmail ? formData.identifier : undefined,
          password: formData.password,
        }),
      });

      const data = await res.json();

      // If login failed
      if (!res.ok) {
        throw new Error(data.message || "Signin failed");
      }

      // Save token + student info in localStorage (so PWA can persist login)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role)
      localStorage.getItem("student", JSON.stringify(data.user));
      

      //save profile info
      if (data.role === "student" && data.user && typeof data.user === "object") {
        localStorage.setItem("student", JSON.stringify(data.user));
      } else {
        localStorage.removeItem("student");
      }

      console.log("login successful: ", data);
      console.log("Saved student:", data.user);
      console.log("Role:", data.role);

      // ✅ Navigate based on role
      
     if (data.role === "student")
     {
      console.log("Navigating to student-dashboard, token:", localStorage.getItem("token"));
      navigate("/student-dashboard");
     } else if (data.role === "admin")
     {
      navigate("/staff-dashboard");
     }
     else {
      console.warn("Unexpected role, reddirecting to root:", data.role);
      //navigate("/");
     }

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
              name="identifier"
              placeholder="Email or Student Number"
              value={formData.identifier}
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
