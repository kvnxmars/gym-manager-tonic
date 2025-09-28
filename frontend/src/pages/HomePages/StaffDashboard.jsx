// src/pages/HomePages/StaffDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/dashboard.css";
import { Html5QrcodeScanner } from "html5-qrcode";

const API_URL = "http://localhost:5000/api";

const StaffDashboard = () => {
  const [occupancy, setOccupancy] = useState(0);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  // Fetch insights on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Added timeout and error handling for each request
        const [occRes, checkinRes] = await Promise.all([
          axios.get(`${API_URL}/gym/occupancy`, { timeout: 5000 }),
          axios.get(`${API_URL}/admin/checkins`, { timeout: 5000 })
        ]);
        
        setOccupancy(occRes.data.currentOccupancy || 0);
        setRecentCheckins(checkinRes.data?.slice(0, 5) || []);
      } catch (err) {
        console.error("Error loading staff insights:", err);
        setError("Failed to load dashboard data. Please check if the server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // QR Scanner
  useEffect(() => {
    if (!showScanner) return;

    let scanner;
    try {
      scanner = new Html5QrcodeScanner("staff-reader", {
        fps: 10,
        qrbox: 250,
      });

      scanner.render(
        (decodedText) => {
          try {
            const studentData = JSON.parse(decodedText);
            alert(`✅ Checked in: ${studentData.name} (${studentData.studentNumber})`);
            
            // Optional: Send to backend
            // axios.post(`${API_URL}/admin/checkin-qr`, { 
            //   studentNumber: studentData.studentNumber 
            // });
            
            setShowScanner(false);
          } catch (err) {
            alert("Invalid QR Code format");
          }
        },
        (scanError) => {
          // Don't show alert for common scanning errors
          if (scanError !== "QR code parse error, error = NotFoundException") {
            console.warn("QR scan error:", scanError);
          }
        }
      );
    } catch (err) {
      console.error("Failed to initialize QR scanner:", err);
      setError("QR scanner failed to initialize");
      setShowScanner(false);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch((err) => 
          console.error("Scanner clear error:", err)
        );
      }
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
            <p className="occupancy-count">{occupancy} students currently inside</p>
          </div>

          {/* Membership */}
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
              <button
                onClick={() => setShowScanner(true)}
                className="dashboard-btn primary"
              >
                📷 Scan QR Code
              </button>
            )}
          </div>

          {/* Recent Check-ins */}
          <div className="dashboard-card">
            <h2>Recent Check-ins</h2>
            {recentCheckins.length > 0 ? (
              <ul className="checkins-list">
                {recentCheckins.map((c, index) => (
                  <li key={c._id || index} className="checkin-item">
                    <span className="time">
                      {new Date(c.checkInTime).toLocaleTimeString()}
                    </span>
                    {!c.checkOutTime && (
                      <span className="active-badge">(Still inside)</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No check-ins yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;