import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import "../../styles/StaffDashboard.css";

const API_URL = "http://localhost:5000/api";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function StaffDashboard() {
  const [tab, setTab] = useState(0);
  const [occupancy, setOccupancy] = useState(0);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", quantity: 1, location: "", notes: "" });
  const [showScanner, setShowScanner] = useState(false);
  const [usageData, setUsageData] = useState([]);

  // Fetch data
  const fetchData = async () => {
    try {
      const [occRes, checkinRes, activeRes, classRes, equipRes, studentRes] = await Promise.all([
        axios.get(`${API_URL}/gym/occupancy`),
        axios.get(`${API_URL}/admin/checkins?limit=10`),
        axios.get(`${API_URL}/admin/active`),
        axios.get(`${API_URL}/classes`),
        axios.get(`${API_URL}/equipment`),
        axios.get(`${API_URL}/student`),
      ]);
      setOccupancy(occRes.data.currentOccupancy || 0);
      setRecentCheckins(checkinRes.data || []);
      setActiveStudents(activeRes.data || []);
      setClasses(classRes.data?.classes || classRes.data || []);
      setEquipment(equipRes.data || []);
      setStudents(studentRes.data || []);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // QR Scanner
  useEffect(() => {
    if (!showScanner) return;
    const scanner = new Html5QrcodeScanner("staff-reader", { fps: 10, qrbox: 250 });
    scanner.render(
      async (decodedText) => {
        try {
          const payload = JSON.parse(decodedText);
          await axios.post(`${API_URL}/admin/checkin-qr`, { studentNumber: payload.studentNumber });
          alert(`✅ Checked in: ${payload.studentNumber}`);
          setShowScanner(false);
          fetchData();
        } catch {
          alert("❌ Invalid QR or check-in failed");
        }
      },
      (err) => console.warn("QR scan error:", err)
    );
    return () => scanner.clear().catch(console.error);
  }, [showScanner]);

  // Equipment management
  const handleAddEquipment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/equipment`, form);
      setEquipment((prev) => [res.data, ...prev]);
      setForm({ name: "", category: "", quantity: 1, location: "", notes: "" });
    } catch {
      alert("Failed to add equipment");
    }
  };
  const handleDeleteEquipment = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;
    try {
      await axios.delete(`${API_URL}/equipment/${id}`);
      setEquipment((prev) => prev.filter((e) => e._id !== id));
    } catch { alert("Delete failed"); }
  };

  // Update membership status
  const handleStatusChange = async (studentNumber, status) => {
    try {
      const res = await axios.put(`${API_URL}/student/${studentNumber}`, { membershipStatus: status });
      setStudents(prev => prev.map(s => s.studentNumber === studentNumber ? res.data : s));
    } catch {
      alert("Failed to update membership");
    }
  };

  // Dummy usage trends
  useEffect(() => {
    setUsageData([
      { day: "Mon", checkins: 15 },
      { day: "Tue", checkins: 20 },
      { day: "Wed", checkins: 10 },
      { day: "Thu", checkins: 25 },
      { day: "Fri", checkins: 18 },
      { day: "Sat", checkins: 30 },
      { day: "Sun", checkins: 12 },
    ]);
  }, []);

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" sx={{ mb: 2 }}>Staff Dashboard</Typography>

      <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} variant="scrollable" scrollButtons="auto">
        <Tab label="Overview" />
        <Tab label="Check-ins" />
        <Tab label="Classes" />
        <Tab label="Equipment" />
        <Tab label="Students" />
        <Tab label="Reports" />
      </Tabs>

      {/* Overview */}
      <TabPanel value={tab} index={0}>
        <h2>Gym Occupancy</h2>
        <p>{occupancy} students currently inside</p>

        <h2>Active Students</h2>
        {activeStudents.length ? (
          <ul>
            {activeStudents.map((s) => (
              <li key={s._id}>{s.studentId?.name?.first} {s.studentId?.name?.last}</li>
            ))}
          </ul>
        ) : <p>No active students.</p>}

        <h2>QR Scanner</h2>
        {showScanner ? <div id="staff-reader" style={{ width: "100%" }}></div> :
          <button onClick={() => setShowScanner(true)} className="dashboard-btn">📷 Scan QR Code</button>}
      </TabPanel>

      {/* Check-ins */}
      <TabPanel value={tab} index={1}>
        <h2>Recent Check-ins</h2>
        {recentCheckins.length ? (
          <ul>
            {recentCheckins.map((c) => (
              <li key={c._id}>{c.studentId?.name?.first} {c.studentId?.name?.last} - {new Date(c.checkInTime).toLocaleTimeString()}</li>
            ))}
          </ul>
        ) : <p>No recent check-ins.</p>}
      </TabPanel>

      {/* Classes */}
      <TabPanel value={tab} index={2}>
        <h2>Gym Classes</h2>
        {classes.length ? classes.map((cls) => (
          <div key={cls._id} className="class-card">
            <strong>{cls.name}</strong> — {cls.category?.level} <br />
            Instructor: {cls.instructor?.name}
          </div>
        )) : <p>No classes available.</p>}
      </TabPanel>

      {/* Equipment */}
      <TabPanel value={tab} index={3}>
        <h2>Manage Equipment</h2>
        <form onSubmit={handleAddEquipment} className="equipment-form">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value || 1) })} />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button type="submit">Add</button>
        </form>
        <ul>
          {equipment.map((eq) => (
            <li key={eq._id}><strong>{eq.name}</strong> — {eq.category} — qty: {eq.quantity}
              <button onClick={() => handleDeleteEquipment(eq._id)}>🗑️ Delete</button>
            </li>
          ))}
        </ul>
      </TabPanel>

      {/* Students */}
      <TabPanel value={tab} index={4}>
        <h2>Student Profiles</h2>
        <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr><th>Student Number</th><th>Name</th><th>Email</th><th>Status</th></tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.studentNumber}</td>
                <td>{s.name?.first} {s.name?.last}</td>
                <td>{s.email}</td>
                <td>
                  <select value={s.membershipStatus} onChange={e => handleStatusChange(s.studentNumber, e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TabPanel>

      {/* Reports */}
      <TabPanel value={tab} index={5}>
        <h2>Usage Reports</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="checkins" stroke="#1976d2" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </TabPanel>
    </Box>
  );
}
