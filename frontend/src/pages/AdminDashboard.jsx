import React, { useState } from "react";
import QRScanner from "../components/QRScanner";
import "./../styles/admin.css";

const AdminDashboard = () => {
  const [manualStudent, setManualStudent] = useState("");
  const [history, setHistory] = useState(null);
  const [message, setMessage] = useState("");

  const manualCheckin = async () => {
    if (!manualStudent) return alert("Enter student number");
    try {
      const res = await fetch("http://localhost:5000/api/admin/checkin-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNumber: manualStudent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");
      setMessage("Check-in successful");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const fetchHistory = async (studentNumber) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/checkins/${studentNumber}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");
      setHistory(data.history);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const onQRScanned = async (decodedText) => {
    // assuming QR encodes studentNumber
    setMessage("Scanned: " + decodedText);
    try {
      const res = await fetch("http://localhost:5000/api/admin/checkin-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNumber: decodedText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error");
      setMessage("Check-in success for " + decodedText);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin — Check-in / Activity</h2>

      <section className="admin-scan">
        <h3>QR Scan Check-in</h3>
        <QRScanner onScan={onQRScanned} />
        <p>{message}</p>
      </section>

      <section className="admin-manual">
        <h3>Manual Check-in</h3>
        <input value={manualStudent} onChange={(e)=>setManualStudent(e.target.value)} placeholder="Student Number" />
        <button onClick={manualCheckin}>Check-in</button>
      </section>

      <section className="admin-history">
        <h3>View Student Activity</h3>
        <input placeholder="Student Number" id="hist" />
        <button onClick={()=>fetchHistory(document.getElementById("hist").value)}>Get History</button>

        {history && (
          <ul>
            {history.map(h => (
              <li key={h._id}>
                In: {new Date(h.checkInTime).toLocaleString()} 
                {h.checkOutTime && ` • Out: ${new Date(h.checkOutTime).toLocaleString()}`}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
