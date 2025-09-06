import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "../styles/dashboard.css";

const StaffQrScanner = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("staff-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        try {
          const studentData = JSON.parse(decodedText);
          alert(`✅ Checked in: ${studentData.name} (${studentData.studentNumber})`);

          // TODO: call backend API to log check-in
          // fetch("/api/checkin", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify(studentData),
          // });
        } catch (err) {
          alert("Invalid QR Code");
        }
      },
      (error) => {
        console.warn("QR scan error:", error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>👩‍🏫 Fit@NWU – Staff QR Scanner</h1>
      </header>

      <main className="dashboard-main">
        <p className="welcome-text">Scan a student QR code to log attendance</p>
        <div id="staff-reader" className="qr-box"></div>
      </main>
    </div>
  );
};

export default StaffQrScanner;
