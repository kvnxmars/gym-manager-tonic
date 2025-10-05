import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/student";

export default function QRCodePage({ studentNumber }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/${studentNumber}/qrcode`);
        setStudent(res.data);
      } catch (err) {
        console.error("Error loading QR code", err);
      }
    };
    load();
  }, [studentNumber]);

  if (!student) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Hi {student.name.first}, here is your Gym QR Code</h2>
      <img src={student.qrImage} alt="QR Code" style={{ width: 250 }} />
      <p>Student Number: {student.studentNumber}</p>
      <button
        onClick={() => {
          const link = document.createElement("a");
          link.href = student.qrImage;
          link.download = `${student.studentNumber}-qrcode.png`;
          link.click();
        }}
      >
        Download QR Code
      </button>
    </div>
  );
}
