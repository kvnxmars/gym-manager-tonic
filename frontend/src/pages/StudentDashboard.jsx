import React, { useEffect, useState } from "react";
import QRCanvas from "workout.jsx";
import "../styles/StudentDashboard.css"; // note: capitalized to match earlier

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    // Fetch logged-in student from backend session (replace URL with your API)
    const fetchStudent = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include", // send session cookie
        });
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setStudent(data);

        // Create QR payload
        const payload = {
          studentId: data.id,
          timestamp: Date.now(),
        };
        setQrData(JSON.stringify(payload));
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    fetchStudent();
  }, []);

  if (!student) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {student.name}</h1>
      <p>Student ID: {student.id}</p>

      <h2>Your QR Code</h2>
      {qrData ? <QRCanvas value={qrData} /> : <p>Generating QR...</p>}
    </div>
  );
};

export default StudentDashboard;
