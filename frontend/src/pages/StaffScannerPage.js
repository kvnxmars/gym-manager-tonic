// src/pages/StaffQrScanner.js
import React, { useState } from "react";
import { QrReader } from "react-qr-reader"; // Camera-based scanner
import axios from "axios";
import "../styles/Auth.css";

const StaffQrScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [message, setMessage] = useState("");

  // Handle scan success
  const handleScan = async (result) => {
    if (result?.text) {
      setScanResult(result.text);

      try {
        // Try check-in first
        const res = await axios.post("http://localhost:5000/api/checkin", {
          qrData: result.text,
        });
        setMessage(res.data.message);
      } catch (err) {
        // If already checked in, maybe they're checking out
        if (err.response?.status === 400) {
          try {
            const res2 = await axios.post("http://localhost:5000/api/checkout", {
              qrData: result.text,
            });
            setMessage(res2.data.message);
          } catch (checkoutErr) {
            setMessage("Error during checkout.");
            console.error(checkoutErr);
          }
        } else {
          setMessage("Invalid QR or server error.");
          console.error(err);
        }
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-form">
          <h2 className="title">Staff QR Scanner</h2>
          <p>Use this to check students in/out of the gym.</p>

          {/* QR Reader */}
          <div style={{ width: "100%", marginTop: "20px" }}>
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={handleScan}
              style={{ width: "100%" }}
            />
          </div>

          {scanResult && (
            <p style={{ marginTop: "20px" }}>Scanned: {scanResult}</p>
          )}

          {message && (
            <p
              style={{
                marginTop: "10px",
                color: message.includes("successful") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffQrScanner;