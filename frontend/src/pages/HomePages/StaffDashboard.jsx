import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import "../../styles/dashboard.css";

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
  const [form, setForm] = useState({ name: "", category: "", quantity: 1, location: "", notes: "" });
  const [showScanner, setShowScanner] = useState(false);

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      const [occRes, checkinRes, activeRes, classRes, equipRes] = await Promise.all([
        axios.get(`${API_URL}/gym/occupancy`),
        axios.get(`${API_URL}/admin/checkins?limit=10`),
        axios.get(`${API_URL}/admin/active`),
        axios.get(`${API_URL}/classes`),
        axios.get(`${API_URL}/equipment`),
      ]);
      setOccupancy(occRes.data.currentOccupancy || 0);
      setRecentCheckins(checkinRes.data || []);
      setActiveStudents(activeRes.data || []);
      setClasses(classRes.data?.classes || classRes.data || []);
      setEquipment(equipRes.data || []);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manual checkout
  const handleCheckout = async (studentNumber) => {
    try {
      await axios.post(`${API_URL}/admin/checkout`, { studentNumber });
      alert(`✅ Student ${studentNumber} checked out successfully!`);
      fetchData();
    } catch {
      alert("❌ Failed to check out student");
    }
  };

  // QR Scanner
  useEffect(() => {
    if (!showScanner) return;
    const scanner = new Html5QrcodeScanner("staff-reader", { fps: 10, qrbox: 250 });
    scanner.render(
      async (decodedText) => {
        try {
          let payload;
          try {
            payload = JSON.parse(decodedText);
          } catch {
            payload = { studentNumber: decodedText };
          }
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

  // Equipment Management
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
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Typography variant="h4" sx={{ mb: 2, p: 2 }}>
        Staff Dashboard
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, newTab) => setTab(newTab)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Overview" />
        <Tab label="Check-ins" />
        <Tab label="Classes" />
        <Tab label="Equipment" />
      </Tabs>

      {/* Overview Tab */}
      <TabPanel value={tab} index={0}>
        <h2>Gym Occupancy</h2>
        <p>{occupancy} students currently inside</p>

        <h2>Active Students</h2>
        {activeStudents.length > 0 ? (
          <ul>
            {activeStudents.map((s) => (
              <li key={s._id}>
                {s.studentId?.name?.first} {s.studentId?.name?.last} (
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

        <h2>QR Scanner</h2>
        {showScanner ? (
          <div id="staff-reader" style={{ width: "100%" }}></div>
        ) : (
          <button onClick={() => setShowScanner(true)} className="dashboard-btn">
            📷 Scan QR Code
          </button>
        )}
      </TabPanel>

      {/* Check-ins Tab */}
      <TabPanel value={tab} index={1}>
        <h2>Recent Check-ins</h2>
        {recentCheckins.length > 0 ? (
          <ul>
            {recentCheckins.map((c) => (
              <li key={c._id}>
                {c.studentId?.name?.first} {c.studentId?.name?.last} -{" "}
                {new Date(c.checkInTime).toLocaleTimeString()}{" "}
                {c.checkOutTime ? "" : "(Still inside)"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent check-ins.</p>
        )}
      </TabPanel>

      {/* Classes Tab */}
      <TabPanel value={tab} index={2}>
        <h2>Gym Classes</h2>
        {classes.length > 0 ? (
          <div className="class-grid">
            {classes.map((cls) => (
              <div key={cls._id} className="class-card">
                <strong>{cls.name}</strong> ({cls.category?.level})<br />
                Instructor: {cls.instructor?.name}<br />
                Capacity: {cls.capacity}
              </div>
            ))}
          </div>
        ) : (
          <p>No classes available.</p>
        )}
        <button className="dashboard-btn">➕ Add New Class</button>
      </TabPanel>

      {/* Equipment Tab */}
      <TabPanel value={tab} index={3}>
        <h2>Manage Equipment</h2>
        <form onSubmit={handleAddEquipment} className="equipment-form">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: parseInt(e.target.value || 1) })
            }
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <button type="submit">Add</button>
        </form>

        {equipment.length > 0 ? (
          <ul className="equipment-list">
            {equipment.map((eq) => (
              <li key={eq._id}>
                <strong>{eq.name}</strong> — {eq.category || "general"} — qty: {eq.quantity} —{" "}
                {eq.location || "-"}
                <p>{eq.notes}</p>
                <button onClick={() => handleDeleteEquipment(eq._id)}>🗑️ Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No equipment yet.</p>
        )}
      </TabPanel>
    </Box>
  );
}
