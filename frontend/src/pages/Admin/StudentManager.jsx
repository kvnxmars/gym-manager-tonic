import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function StudentManager() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/student`)
      .then(res => setStudents(res.data))
      .catch(err => console.error("Load students error:", err));
  }, []);

  const handleStatusChange = async (studentNumber, status) => {
    try {
      const res = await axios.put(`${API_URL}/student/${studentNumber}/membership`, { status });
      setStudents(prev =>
        prev.map(s => (s.studentNumber === studentNumber ? res.data : s))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Student Profiles</h2>
      <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.studentNumber}</td>
              <td>{s.name.first} {s.name.last}</td>
              <td>{s.email}</td>
              <td>
                <select
                  value={s.membershipStatus}
                  onChange={e => handleStatusChange(s.studentNumber, e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
