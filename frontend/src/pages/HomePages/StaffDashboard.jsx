import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/dashboard.css";
import { Html5QrcodeScanner } from "html5-qrcode";

const API_URL = "http://localhost:5000/api";

const StaffDashboard = () => {
  const [occupancy, setOccupancy] = useState(0);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      const [occRes, checkinRes, activeRes] = await Promise.all([
        axios.get(`${API_URL}/gym/occupancy`),
        axios.get(`${API_URL}/admin/checkins`),
        axios.get(`${API_URL}/admin/active`),
      ]);

      setOccupancy(occRes.data.currentOccupancy || 0);
      setRecentCheckins(checkinRes.data?.slice(0, 5) || []);
      setActiveStudents(activeRes.data || []);
    } catch (err) {
      console.error("Error loading staff insights:", err);
      setError("Failed to load dashboard data. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manual check-out
  const handleCheckout = async (studentNumber) => {
    try {
      await axios.post(`${API_URL}/admin/checkout`, { studentNumber });
      alert(`✅ Student ${studentNumber} checked out successfully!`);
      fetchData(); // refresh dashboard
    } catch (err) {
      console.error("Checkout error:", err);
      alert("❌ Failed to check out student");
    }
  };

  // QR Scanner
  useEffect(() => {
    if (!showScanner) return;

    const scanner = new Html5QrcodeScanner("staff-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      async (decodedText) => {
        try {
          const studentData = JSON.parse(decodedText);

          await axios.post(`${API_URL}/admin/checkin-qr`, {
            studentNumber: studentData.studentNumber,
          });

          alert(`✅ Checked in: ${studentData.name} (${studentData.studentNumber})`);
          setShowScanner(false);
          fetchData();
        } catch (err) {
          alert("❌ Invalid QR Code or Check-in failed");
          console.error(err);
        }
      },
      (error) => {
        console.warn("QR scan error:", error);
      }
    );

    return () => {
      scanner.clear().catch((err) => console.error("Scanner clear error:", err));
    };
  }, [showScanner]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Staff Dashboard</h1>

      {loading ? (
        <div className="loading">Loading insights...</div>
      ) : error ? (
        <div className="error-text">{error}</div>
      ) : (
        <div className="dashboard-grid">
          {/* Occupancy */}
          <div className="dashboard-card">
            <h2>Gym Occupancy</h2>
            <p>{occupancy} students currently inside</p>
          </div>

          {/* Active Students */}
          <div className="dashboard-card">
            <h2>Active Students</h2>
            {activeStudents.length > 0 ? (
              <ul>
                {activeStudents.map((s) => (
                  <li key={s._id}>
                    {s.studentId?.firstName} {s.studentId?.lastName} (
                    {s.studentId?.studentNumber})
                    <button
                      onClick={() => handleCheckout(s.studentId?.studentNumber)}
                      className="dashboard-btn small danger"
                    >
                      Check-out
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active students.</p>
            )}
          </div>

          {/* QR Scanner */}
          <div className="dashboard-card">
            <h2>QR Scanner</h2>
            {showScanner ? (
              <div id="staff-reader" style={{ width: "100%" }}></div>
            ) : (
              <button onClick={() => setShowScanner(true)} className="dashboard-btn">
                📷 Scan QR Code
              </button>
            )}
          </div>

          {/* Recent Check-ins */}
          <div className="dashboard-card">
            <h2>Recent Check-ins</h2>
            {recentCheckins.length > 0 ? (
              <ul>
                {recentCheckins.map((c) => (
                  <li key={c._id}>
                    {c.studentId?.firstName} {c.studentId?.lastName} -{" "}
                    {new Date(c.checkInTime).toLocaleTimeString()}{" "}
                    {c.checkOutTime ? "" : "(Still inside)"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent check-ins.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
