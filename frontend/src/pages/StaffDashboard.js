// src/pages/StaffDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css"; // note: capitalized to match earlier
import { Html5QrcodeScanner } from "html5-qrcode";
const API_URL = "http://localhost:5000/api"; // official backend URL

const StaffDashboard = () => {
  const [occupancy, setOccupancy] = useState(0);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);

  // Fetch insights on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get gym occupancy
        const occRes = await axios.get("{API_URL}/occupancy");
        setOccupancy(occRes.data.currentOccupancy);

        // Get recent check-ins (for now hardcoded student)
        const checkinRes = await axios.get("http://localhost:5000/api/checkins/12345678");
        setRecentCheckins(checkinRes.data.checkIns.slice(0, 5));
      } catch (error) {
        console.error("Error loading staff insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize QR scanner only when showScanner is true
  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("staff-reader", {
        fps: 10,
        qrbox: 250,
      });

      scanner.render(
        (decodedText) => {
          try {
            const studentData = JSON.parse(decodedText);
            alert(`✅ Checked in: ${studentData.name} (${studentData.studentNumber})`);

            // Example: call backend check-in
            // axios.post("http://localhost:5000/api/checkin", studentData);

            setShowScanner(false); // hide scanner after success
          } catch (err) {
            alert("Invalid QR Code");
          }
        },
        (error) => {
          console.warn("QR scan error:", error);
        }
      );

      return () => {
        scanner.clear().catch((err) => console.error("Scanner clear error:", err));
      };
    }
  }, [showScanner]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Staff Dashboard</h1>

      {loading ? (
        <p>Loading insights...</p>
      ) : (
        <div className="dashboard-grid">
          {/* Gym occupancy */}
          <div className="dashboard-card">
            <h2>Gym Occupancy</h2>
            <p>{occupancy} students currently inside</p>
          </div>

          {/* Membership insights (placeholder) */}
          <div className="dashboard-card">
            <h2>Membership Status</h2>
            <p>All active students: Coming soon</p>
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
            <ul>
              {recentCheckins.map((c) => (
                <li key={c._id}>
                  Checked in at {new Date(c.checkInTime).toLocaleTimeString()}{" "}
                  {c.isActive ? "(Still inside)" : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
