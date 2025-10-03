import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import "../../styles/StaffDashboard.css"; // Assuming this CSS file is used

const API_URL = "http://localhost:5000/api";

const specialtyOptions = [
  "Yoga", "Pilates", "Cardio", "Strength Training", 
  "Dance", "HIIT", "Cycling", "Other",
];
const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", 
  "Friday", "Saturday", "Sunday",
];


// Helper component for Tab content
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

// ----------------------------------------------------------------------
// Class Utilities and Form Component
// ----------------------------------------------------------------------

// Validate minimal required fields
const validateClass = (c) => {
  if (!((c.classId || "").toString().trim())) return "Class ID is required";
  if (!((c.name || "").toString().trim())) return "Class name is required";
  if (!c.date) return "Date is required";
  if (!c.capacity || Number(c.capacity) <= 0) return "Capacity must be > 0";
  if (!((c.category?.primary || "").toString().trim())) return "Category primary is required";
  if (!((c.instructor?.name || "").toString().trim())) return "Instructor name is required";
  if (!((c.schedule?.time || "").toString().trim())) return "Schedule time is required";
  if (!c.schedule?.duration || Number(c.schedule?.duration) <= 0) return "Schedule duration must be > 0";
  return null;
};

// Prepare minimal payload matching backend schema
const prepareClassPayload = (c) => ({
  classId: (c.classId || "").trim(),
  name: (c.name || "").trim(),
  description: (c.description || "").trim(),
  date: c.date ? new Date(c.date).toISOString() : undefined,
  capacity: Number(c.capacity),
  category: {
    primary: (c.category?.primary || "").trim(),
    level: c.category?.level || "Beginner",
    intensity: c.category?.intensity || "Low"
  },
  instructor: {
    name: (c.instructor?.name || "").trim(),
    contact: (c.instructor?.contact || "").trim(),
    specialty: c.instructor?.specialty || "Other",
    photo: c.instructor?.photo || "",
    rating: c.instructor?.rating !== undefined && c.instructor?.rating !== "" ? Number(c.instructor.rating) : undefined,
    totalRatings: c.instructor?.totalRatings !== undefined && c.instructor?.totalRatings !== "" ? Number(c.instructor.totalRatings) : undefined
  },
  schedule: {
    days: Array.isArray(c.schedule?.days) ? c.schedule.days.map(d => String(d)) : [],
    type: c.schedule?.type || "In-Person",
    frequency: c.schedule?.frequency || "Once",
    time: c.schedule?.time || "",
    duration: Number(c.schedule?.duration || 0)
  }
});

function ClassForm({ initialData, onSubmit, onCancel, saving = false }) {
  const normalize = (data) => ({
    classId: data?.classId ?? "",
    name: data?.name ?? "",
    description: data?.description ?? "",
    date: data?.date
      ? (typeof data.date === "string" ? data.date.substring(0, 10) : (data.date instanceof Date ? data.date.toISOString().substring(0, 10) : ""))
      : "",
    capacity: data?.capacity ?? "",
    category: {
      primary: data?.category?.primary ?? "",
      level: data?.category?.level ?? "Beginner",
      intensity: data?.category?.intensity ?? "Low"
    },
    instructor: {
      name: data?.instructor?.name ?? "",
      contact: data?.instructor?.contact ?? "",
      specialty: data?.instructor?.specialty ?? "Other",
      photo: data?.instructor?.photo ?? "",
      rating: data?.instructor?.rating ?? "",
      totalRatings: data?.instructor?.totalRatings ?? ""
    },
    schedule: {
      days: Array.isArray(data?.schedule?.days) ? data.schedule.days.map(d => String(d)) : [],
      type: data?.schedule?.type ?? "In-Person",
      frequency: data?.schedule?.frequency ?? "Once",
      time: data?.schedule?.time ?? "",
      duration: data?.schedule?.duration ?? ""
    }
  });

  const [form, setForm] = useState(normalize(initialData));

  useEffect(() => {
    setForm(normalize(initialData));
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateClass(form);
    if (validationError) {
      alert("Validation Error: " + validationError);
      return;
    }
    onSubmit(form);
  };

  const fieldSetStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1rem",
    marginTop: "1rem"
  };

  return (
    <form onSubmit={handleSubmit} className="class-form-container">
      <h3>{initialData ? "✏️ Edit Class" : "➕ Add New Class"}</h3>

      <div className="equipment-form class-form-fields">
        <fieldset style={fieldSetStyle}>
          <legend>Basic Info</legend>
          <label>Class ID <input className="input-field" value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })} required /></label>
          <label>Class Name <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Date <input className="input-field" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></label>
          <label>Capacity <input className="input-field" type="number" min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} required /></label>
        </fieldset>

        <fieldset style={fieldSetStyle}>
          <legend>Category</legend>
          <label>Primary Type <input className="input-field" value={form.category.primary} onChange={e => setForm({ ...form, category: { ...form.category, primary: e.target.value } })} required /></label>
          <label>Level
            <select className="input-field" value={form.category.level} onChange={e => setForm({ ...form, category: { ...form.category, level: e.target.value } })}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </label>
          <label>Intensity
            <select className="input-field" value={form.category.intensity} onChange={e => setForm({ ...form, category: { ...form.category, intensity: e.target.value } })}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </label>
        </fieldset>

        <fieldset style={fieldSetStyle}>
          <legend>Instructor</legend>
          <label>Name <input className="input-field" value={form.instructor.name} onChange={e => setForm({ ...form, instructor: { ...form.instructor, name: e.target.value } })} required /></label>
          <label>Specialty
            <select className="input-field" value={form.instructor.specialty} onChange={e => setForm({ ...form, instructor: { ...form.instructor, specialty: e.target.value } })}>
              {specialtyOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Contact <input className="input-field" value={form.instructor.contact} onChange={e => setForm({ ...form, instructor: { ...form.instructor, contact: e.target.value } })} /></label>
          <label>Rating <input className="input-field" type="number" min="0" max="5" step="0.1" value={form.instructor.rating} onChange={e => setForm({ ...form, instructor: { ...form.instructor, rating: e.target.value } })} /></label>
        </fieldset>

        <fieldset style={fieldSetStyle}>
          <legend>Schedule</legend>
          <label>Time <input className="input-field" value={form.schedule.time} onChange={e => setForm({ ...form, schedule: { ...form.schedule, time: e.target.value } })} placeholder="e.g. 17:00" required /></label>
          <label>Duration (min) <input className="input-field" type="number" min="1" value={form.schedule.duration} onChange={e => setForm({ ...form, schedule: { ...form.schedule, duration: e.target.value } })} required /></label>
          <label>Type
            <select className="input-field" value={form.schedule.type} onChange={e => setForm({ ...form, schedule: { ...form.schedule, type: e.target.value } })}>
              <option>In-Person</option><option>Virtual</option><option>Hybrid</option>
            </select>
          </label>
          <label>Frequency
            <select className="input-field" value={form.schedule.frequency} onChange={e => setForm({ ...form, schedule: { ...form.schedule, frequency: e.target.value } })}>
              <option>Once</option><option>Weekly</option><option>Bi-Weekly</option><option>Monthly</option>
            </select>
          </label>
        </fieldset>
      </div>

      <div className="day-checkboxes" style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", marginTop: "1rem" }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Days:</label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {daysOfWeek.map(day => (
            <label key={day} className="checkbox-label" style={{ fontWeight: 'normal' }}>
              <input
                type="checkbox"
                checked={form.schedule.days.includes(day)}
                onChange={e => {
                  const days = form.schedule.days.includes(day)
                    ? form.schedule.days.filter(d => d !== day)
                    : [...form.schedule.days, day];
                  setForm({ ...form, schedule: { ...form.schedule, days } });
                }}
              />
              {day}
            </label>
          ))}
        </div>
      </div>

      <label style={{ marginTop: '1rem' }}>Description <textarea className="input-field" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ height: '60px' }} /></label>

      <div className="form-actions" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button type="submit" disabled={saving} className="dashboard-btn success">{saving ? "Saving..." : "💾 Save Class"}</button>
        <button type="button" className="dashboard-btn danger" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}


// ----------------------------------------------------------------------
// Equipment Form Component (NEW)
// ----------------------------------------------------------------------

// Minimal validation for equipment
const validateEquipment = (e) => {
    if (!((e.name || "").toString().trim())) return "Equipment name is required";
    if (!e.quantity || Number(e.quantity) <= 0) return "Quantity must be > 0";
    return null;
};

function EquipmentForm({ initialData, onSubmit, onCancel, saving = false }) {
    const normalize = (data) => ({
        _id: data?._id ?? null, // Keep ID for updates
        name: data?.name ?? "",
        category: data?.category ?? "",
        quantity: data?.quantity ?? 1,
        location: data?.location ?? "",
        notes: data?.notes ?? "",
    });

    const [form, setForm] = useState(normalize(initialData));

    useEffect(() => {
        setForm(normalize(initialData));
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationError = validateEquipment(form);
        if (validationError) {
            alert("Validation Error: " + validationError);
            return;
        }
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="class-form-container" style={{padding: '1rem', border: '1px solid #ccc', borderRadius: '8px'}}>
            <h3>{initialData?._id ? "✏️ Edit Equipment" : "➕ Add New Equipment"}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <label>Name <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
                <label>Category <input className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></label>
                <label>Quantity <input className="input-field" type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value || 1) })} required /></label>
                <label>Location <input className="input-field" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></label>
            </div>
            
            <label>Notes <textarea className="input-field" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ height: '60px' }} /></label>

            <div className="form-actions" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" disabled={saving} className="dashboard-btn success">{saving ? "Saving..." : "💾 Save Equipment"}</button>
                <button type="button" className="dashboard-btn danger" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}

// ----------------------------------------------------------------------
// StaffDashboard Component
// ----------------------------------------------------------------------

export default function StaffDashboard() {
  const [tab, setTab] = useState(0);
  const [occupancy, setOccupancy] = useState(0);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [students, setStudents] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [usageData, setUsageData] = useState([]);

  // Class Management States
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [classSaving, setClassSaving] = useState(false); // Renamed for clarity

  // Equipment Management States (NEW)
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [equipmentSaving, setEquipmentSaving] = useState(false); // NEW state

  
  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/classes`);
      setClasses(res.data?.classes || res.data || []);
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  };

  // Fetch equipment
  const fetchEquipment = async () => {
    try {
      const res = await axios.get(`${API_URL}/equipment`);
      setEquipment(res.data || []);
    } catch (err) {
      console.error("Error loading equipment:", err);
    }
  };


  // Fetch data
  const fetchData = async () => {
    try {
      const [occRes, checkinRes, activeRes, studentRes] = await Promise.all([
        axios.get(`${API_URL}/gym/occupancy`),
        axios.get(`${API_URL}/admin/checkins?limit=10`),
        axios.get(`${API_URL}/admin/active`),
        axios.get(`${API_URL}/student`),
      ]);
      setOccupancy(occRes.data.currentOccupancy || 0);
      setRecentCheckins(checkinRes.data || []);
      setActiveStudents(activeRes.data || []);
      setStudents(studentRes.data || []);
      fetchClasses(); 
      fetchEquipment(); // Fetch equipment separately
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

  
  // --- Equipment Management Logic (Refactored) ---

  const handleEquipmentSubmit = async (equipmentData) => {
    setEquipmentSaving(true);
    try {
        const payload = {
            name: equipmentData.name,
            category: equipmentData.category,
            quantity: Number(equipmentData.quantity),
            location: equipmentData.location,
            notes: equipmentData.notes
        };

        if (editingEquipment) {
            const id = editingEquipment._id;
            await axios.put(`${API_URL}/equipment/${id}`, payload);
        } else {
            await axios.post(`${API_URL}/equipment`, payload);
        }
        setShowEquipmentForm(false);
        setEditingEquipment(null);
        fetchEquipment();
        alert(`✅ Equipment ${editingEquipment ? 'updated' : 'added'} successfully!`);
    } catch (err) {
        console.error("Save equipment error:", err);
        const serverMsg = err.response?.data?.message || err.message;
        alert("Failed to save equipment: " + serverMsg);
    } finally {
        setEquipmentSaving(false);
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    try {
      await axios.delete(`${API_URL}/equipment/${id}`);
      setEquipment((prev) => prev.filter((e) => e._id !== id));
      alert("✅ Equipment deleted successfully!");
    } catch { 
      alert("❌ Delete failed"); 
    }
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
  
  // Class Management Logic
  const handleClassSubmit = async (classData) => {
    const payload = prepareClassPayload(classData);

    setClassSaving(true);
    try {
      if (editingClass) {
        const id = editingClass._id;
        await axios.put(`${API_URL}/classes/update/${id}`, payload);
      } else {
        await axios.post(`${API_URL}/classes/create`, payload);
      }
      setShowClassForm(false);
      setEditingClass(null);
      fetchClasses();
      alert(`✅ Class ${editingClass ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      console.error("Save class error:", err);
      const serverMsg = err.response?.data?.message || err.response?.data || err.message;
      alert("Failed to save class: " + (typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg)));
    } finally {
      setClassSaving(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/classes/delete/${classId}`);
      setClasses(prev => prev.filter(c => c._id !== classId));
      alert("✅ Class deleted successfully!");
    } catch (err) {
      console.error("Delete class error:", err);
      const serverMsg = err.response?.data?.message || err.response?.data || err.message;
      alert("Failed to delete class: " + (typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg)));
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

      <Tabs 
        value={tab} 
        onChange={(e, newTab) => {
          setTab(newTab);
          // Reset forms when changing tabs
          setShowClassForm(false); setEditingClass(null);
          setShowEquipmentForm(false); setEditingEquipment(null);
        }} 
        variant="scrollable" 
        scrollButtons="auto"
      >
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

      {/* Classes (Index 2) */}
      <TabPanel value={tab} index={2}>
        <h2>Gym Classes</h2>
        
        {showClassForm ? (
          // Display the ClassForm when adding or editing
          <ClassForm
            initialData={editingClass}
            onSubmit={handleClassSubmit}
            onCancel={() => {
              setShowClassForm(false);
              setEditingClass(null);
            }}
            saving={classSaving}
          />
        ) : (
          // Display the Class List and Add button
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
              <div className="class-grid" style={{marginTop: '1rem', display: 'grid', gap: '10px'}}>
                {classes.map((cls) => (
                  <div key={cls._id} className="class-card" style={{border: '1px solid #ddd', padding: '10px', borderRadius: '4px'}}>
                    <strong>{cls.name}</strong> — {cls.category?.primary || cls.category?.level} <br />
                    Instructor: {cls.instructor?.name || 'N/A'}
                    <p style={{fontSize: '12px', color: '#666'}}>Schedule: {cls.schedule?.days?.join(", ") || 'N/A'} @ {cls.schedule?.time || 'N/A'}</p>

                    <div className="class-actions" style={{ marginTop: "0.5rem" }}>
                      <button 
                        onClick={() => {
                          setEditingClass(cls);
                          setShowClassForm(true);
                        }}
                        className="dashboard-btn small"
                        style={{marginRight: '10px'}}
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
              <p style={{marginTop: '1rem'}}>No classes available.</p>
            )}
          </>
        )}
      </TabPanel>

      {/* Equipment (Index 3) (Refactored) */}
      <TabPanel value={tab} index={3}>
        <h2>Manage Equipment</h2>
        
        {showEquipmentForm ? (
          // Display the EquipmentForm when adding or editing
          <EquipmentForm
            initialData={editingEquipment}
            onSubmit={handleEquipmentSubmit}
            onCancel={() => {
              setShowEquipmentForm(false);
              setEditingEquipment(null);
            }}
            saving={equipmentSaving}
          />
        ) : (
          // Display the Equipment List and Add button
          <>
            <button 
              onClick={() => {
                setShowEquipmentForm(true);
                setEditingEquipment(null); // Clear editing state for Add
              }}
              className="dashboard-btn"
            >
              ➕ Add New Equipment
            </button>

            {equipment.length > 0 ? (
                <ul className="equipment-list" style={{listStyle: 'none', padding: 0, marginTop: '1rem', display: 'grid', gap: '10px'}}>
                    {equipment.map((eq) => (
                        <li key={eq._id} style={{border: '1px solid #ddd', padding: '10px', borderRadius: '4px'}}>
                            <div style={{fontWeight: 'bold'}}>
                                {eq.name} 
                            </div>
                            <div style={{fontSize: '14px', color: '#666', marginTop: '5px'}}>
                                Category: {eq.category || 'General'} | Quantity: {eq.quantity} | Location: {eq.location || 'N/A'}
                            </div>
                            {eq.notes && <p style={{fontSize: '12px', color: '#999', marginTop: '5px'}}>Notes: {eq.notes}</p>}
                            
                            <div className="equipment-actions" style={{ marginTop: "0.5rem" }}>
                                <button 
                                    onClick={() => {
                                        setEditingEquipment(eq);
                                        setShowEquipmentForm(true);
                                    }}
                                    className="dashboard-btn small"
                                    style={{marginRight: '10px'}}
                                >
                                    ✏️ Edit
                                </button>
                                <button 
                                    onClick={() => handleDeleteEquipment(eq._id)}
                                    className="dashboard-btn small danger"
                                >
                                    ❌ Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{marginTop: '1rem'}}>No equipment logged.</p>
            )}
          </>
        )}
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