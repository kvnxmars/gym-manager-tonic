import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import "../../styles/dashboard.css";

const API_URL = "http://localhost:5000/api";

// Utility to create a class payload (simple implementation for this context)
const prepareClassPayload = (classData) => {
  // Assuming classData contains fields like { name, instructor, category, capacity }
  // You might need to adjust this based on your actual server schema
  return {
    name: classData.name,
    instructor: classData.instructor, // Assuming instructor is just a string name/ID for the form
    category: classData.category,
    capacity: classData.capacity,
    // Add other fields as necessary (e.g., schedule)
  };
};


function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

// Simple Class Form Component (Inline definition for simplicity)
const ClassForm = ({ onSubmit, onCancel, editingClass, saving }) => {
  const [formData, setFormData] = useState(
    editingClass || {
      classId: "",
      name: "",
      description: "",
      date: "",
      capacity: 15,
      categoryPrimary: "Yoga",
      categoryLevel: "Beginner",
      categoryIntensity: "Medium",
      instructorName: "",
      instructorContact: "",
      instructorSpecialty: "Other",
      instructorPhoto: "",
      scheduleDays: [],
      scheduleType: "In-Person",
      scheduleFrequency: "Weekly",
      scheduleTime: "09:00",
      scheduleDuration: 60,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" || name === "scheduleDuration"
        ? parseInt(value, 10)
        : value,
    }));
  };

  const handleMultiSelect = (e) => {
    const options = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({ ...prev, scheduleDays: options }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.capacity < 1) {
      alert("Capacity must be at least 1.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="class-form-container">
      <h3>{editingClass ? "Edit Class" : "Add New Class"}</h3>

      <input name="classId" placeholder="Class ID" value={formData.classId} onChange={handleChange} required />
      <input name="name" placeholder="Class Name" value={formData.name} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
      <input name="date" type="date" value={formData.date} onChange={handleChange} required />
      <input name="capacity" type="number" min="1" value={formData.capacity} onChange={handleChange} required />

      <h4>Category</h4>
      <input name="categoryPrimary" placeholder="Primary Category (e.g. Yoga)" value={formData.categoryPrimary} onChange={handleChange} />
      <select name="categoryLevel" value={formData.categoryLevel} onChange={handleChange}>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
      <select name="categoryIntensity" value={formData.categoryIntensity} onChange={handleChange}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <h4>Instructor</h4>
      <input name="instructorName" placeholder="Name" value={formData.instructorName} onChange={handleChange} required />
      <input name="instructorContact" placeholder="Contact" value={formData.instructorContact} onChange={handleChange} />
      <select name="instructorSpecialty" value={formData.instructorSpecialty} onChange={handleChange}>
        <option>Yoga</option>
        <option>Pilates</option>
        <option>Cardio</option>
        <option>Strength Training</option>
        <option>Dance</option>
        <option>HIIT</option>
        <option>Cycling</option>
        <option>Other</option>
      </select>
      <input name="instructorPhoto" placeholder="Photo URL" value={formData.instructorPhoto} onChange={handleChange} />

      <h4>Schedule</h4>
      <select name="scheduleDays" multiple value={formData.scheduleDays} onChange={handleMultiSelect}>
        {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
      <select name="scheduleType" value={formData.scheduleType} onChange={handleChange}>
        <option>In-Person</option>
        <option>Virtual</option>
        <option>Hybrid</option>
      </select>
      <select name="scheduleFrequency" value={formData.scheduleFrequency} onChange={handleChange}>
        <option>Once</option>
        <option>Weekly</option>
        <option>Bi-Weekly</option>
        <option>Monthly</option>
      </select>
      <input type="time" name="scheduleTime" value={formData.scheduleTime} onChange={handleChange} required />
      <input type="number" name="scheduleDuration" min="15" value={formData.scheduleDuration} onChange={handleChange} required />

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : editingClass ? "Update Class" : "Create Class"}
      </button>
      <button type="button" onClick={onCancel} className="dashboard-btn danger">Cancel</button>
    </form>
  );
};



export default function StaffDashboard() {
  const [tab, setTab] = useState(0);
  const [occupancy, setOccupancy] = useState(0);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", quantity: 1, location: "", notes: "" });
  const [showScanner, setShowScanner] = useState(false);
  
  // New state for class management
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [saving, setSaving] = useState(false);

  // Function to fetch ONLY classes (for re-fetching after add/edit/delete)
  const fetchClasses = async () => {
    try {
      const classRes = await axios.get(`${API_URL}/classes`);
      setClasses(classRes.data?.classes || classRes.data || []);
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  };

  // Fetch all dashboard data (now uses fetchClasses)
  const fetchData = async () => {
    try {
      const [occRes, checkinRes, activeRes, equipRes] = await Promise.all([
        axios.get(`${API_URL}/gym/occupancy`),
        axios.get(`${API_URL}/admin/checkins?limit=10`),
        axios.get(`${API_URL}/admin/active`),
        axios.get(`${API_URL}/equipment`),
      ]);
      setOccupancy(occRes.data.currentOccupancy || 0);
      setRecentCheckins(checkinRes.data || []);
      setActiveStudents(activeRes.data || []);
      setEquipment(equipRes.data || []);
      // Call dedicated class fetch
      fetchClasses();
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manual checkout (no change)
  const handleCheckout = async (studentNumber) => {
    try {
      await axios.post(`${API_URL}/admin/checkout`, { studentNumber });
      alert(`✅ Student ${studentNumber} checked out successfully!`);
      fetchData();
    } catch {
      alert("❌ Failed to check out student");
    }
  };

  // QR Scanner (no change)
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

  // Equipment Management (no change)
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


  // --- Class Management Functions ---

  const handleClassSubmit = async (classData) => {
    const payload = prepareClassPayload(classData);

    setSaving(true);
    try {
      if (editingClass) {
        // always use Mongo _id for update
        const id = editingClass._id;
        await axios.put(`${API_URL}/classes/update/${id}`, payload);
        alert("Class updated successfully!");
      } else {
        await axios.post(`${API_URL}/classes/create`, payload);
        alert("Class created successfully!");
      }
      setShowClassForm(false);
      setEditingClass(null);
      fetchClasses(); // Re-fetch classes list
    } catch (err) {
      console.error("Save class error:", err);
      const serverMsg = err.response?.data?.message || err.response?.data || err.message;
      alert("Failed to save class: " + (typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg)));
    } finally {
      setSaving(false);
    }
  };

  // Delete class
  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to permanently delete this class?")) return;
    try {
      await axios.delete(`${API_URL}/classes/delete/${classId}`);
      alert("Class deleted successfully!");
      fetchClasses(); // Re-fetch classes list
    } catch (err) {
      console.error("Delete class error:", err);
      const serverMsg = err.response?.data?.message || err.response?.data || err.message;
      alert("Failed to delete class: " + (typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg)));
    }
  };


  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Typography variant="h4" sx={{ mb: 2, p: 2 }}>
        Staff Dashboard
      </Typography>

      {/* Tabs (Sidebar from CSS) */}
      <Tabs
        value={tab}
        onChange={(e, newTab) => {
          setTab(newTab);
          setShowClassForm(false); // Close form when changing tabs
          setEditingClass(null);
        }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Overview" />
        <Tab label="Check-ins" />
        <Tab label="Classes" />
        <Tab label="Equipment" />
      </Tabs>

      {/* Overview Tab (Index 0) */}
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

      {/* Check-ins Tab (Index 1) */}
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

      {/* Classes Tab (Index 2) */}
      <TabPanel value={tab} index={2}>
        <h2>Gym Classes</h2>
        
        {showClassForm ? (
          <ClassForm
            onSubmit={handleClassSubmit}
            onCancel={() => {
              setShowClassForm(false);
              setEditingClass(null);
            }}
            editingClass={editingClass}
            saving={saving}
          />
        ) : (
          <>
            <button 
              onClick={() => {
                setShowClassForm(true);
                setEditingClass(null); // Clear editing state for Add
              }}
              className="dashboard-btn"
            >
              ➕ Add New Class
            </button>
            
            {classes.length > 0 ? (
              <div className="class-grid">
                {classes.map((cls) => (
                  <div key={cls._id} className="class-card">
                    <strong>{cls.name}</strong> ({cls.category?.level || cls.category})<br />
                    Instructor: {cls.instructor?.name || cls.instructor}<br />
                    Capacity: {cls.capacity}
                    <div className="class-actions">
                      <button 
                        onClick={() => {
                          setEditingClass(cls);
                          setShowClassForm(true);
                        }}
                        className="dashboard-btn small"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClass(cls._id)}
                        className="dashboard-btn small danger"
                      >
                        ❌ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No classes available.</p>
            )}
          </>
        )}
      </TabPanel>

      {/* Equipment Tab (Index 3) */}
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