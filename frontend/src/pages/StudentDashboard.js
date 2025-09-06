import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const API_URL = "http://localhost:5000/api"; // Adjust if needed

const MIN_CHECKOUT_MINUTES = 2; // Minimum minutes before checkout

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [canCheckout, setCanCheckout] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedStudent = JSON.parse(localStorage.getItem("student"));
    if (savedStudent) {
      setStudent(savedStudent);
    }
    // Check if checkinTime exists and if enough time has passed
    const checkinTime = localStorage.getItem("checkinTime");
    if (checkinTime) {
      const now = Date.now();
      const diffMinutes = (now - parseInt(checkinTime, 10)) / 60000;
      setCanCheckout(diffMinutes >= MIN_CHECKOUT_MINUTES);
    }
  }, []);

  // When QR is shown, set checkinTime
  const handleShowQR = () => {
    setShowQR(true);
    if (!localStorage.getItem("checkinTime")) {
      localStorage.setItem("checkinTime", Date.now().toString());
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    localStorage.removeItem("checkinTime");
    navigate("/");
  };

  // Checkout handler
  const handleCheckout = async () => {
    setCheckoutMsg("");
    if (!canCheckout) {
      setCheckoutMsg(`You can only checkout after ${MIN_CHECKOUT_MINUTES} minutes.`);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNumber: student.studentNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");
      setCheckoutMsg("✅ Checked out successfully!");
      localStorage.removeItem("checkinTime");
    } catch (err) {
      setCheckoutMsg(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🎓 Fit@NWU – Student Panel</h1>
      </header>

      <main className="dashboard-main">
        {student ? (
          <>
            <p className="welcome-text">
              Welcome, {student.name?.first} {student.name?.last}!
            </p>

            {!showQR ? (
              <button
                className="scan-btn"
                onClick={handleShowQR}
              >
                🎟 Show My QR Code
              </button>
            ) : (
              <div className="qr-box">
                <QRCodeCanvas
                  value={JSON.stringify({
                    studentNumber: student.studentNumber,
                    name: `${student.name?.first} ${student.name?.last}`,
                  })}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
                <p className="qr-hint">
                  Present this QR to staff at the gym entrance
                </p>
              </div>
            )}

            {/* MVP Staff QR Scanner Button */}
            <button
              style={{
                marginTop: "16px",
                padding: "6px 12px",
                fontSize: "0.9rem",
                background: "#eee",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer"
              }}
              onClick={() => navigate("/staff-qr")}
            >
              Go to Staff QR Scanner
            </button>

            {/* Checkout Button */}
            <button
              style={{
                marginTop: "16px",
                padding: "6px 12px",
                fontSize: "0.9rem",
                background: canCheckout ? "#2575fc" : "#aaa",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: canCheckout ? "pointer" : "not-allowed"
              }}
              onClick={handleCheckout}
              disabled={!canCheckout}
            >
              Checkout
            </button>
            {checkoutMsg && (
              <p style={{ marginTop: "8px", color: checkoutMsg.startsWith("✅") ? "lime" : "yellow" }}>
                {checkoutMsg}
              </p>
            )}

            {/* Logout Button */}
            <button
              style={{
                marginTop: "16px",
                padding: "6px 12px",
                fontSize: "0.9rem",
                background: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading your info...</p>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
