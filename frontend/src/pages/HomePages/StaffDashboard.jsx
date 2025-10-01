import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/dashboard.css";
import { Html5QrcodeScanner } from "html5-qrcode";

const API_URL = "http://localhost:5000/api";

const StaffDashboard = () => {
  const [occupancy, setOccupancy] = useState(0);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [classes, setClasses] = useState([]);
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      const [occRes, checkinRes, activeRes] = await Promise.all([
        axios.get(`${API_URL}/gym/occupancy`),
        axios.get(`${API_URL}/admin/checkins`),
        axios.get(`${API_URL}/admin/active`),
      ]);

      setOccupancy(occRes.data.currentOccupancy || 0);
      setRecentCheckins(checkinRes.data?.slice(0, 5) || []);
      setActiveStudents(activeRes.data || []);
    } catch (err) {
      console.error("Error loading staff insights:", err);
      setError("Failed to load dashboard data. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/classes`);
      setClasses(res.data || []);
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchClasses();
  }, []);

  // Manual check-out
  const handleCheckout = async (studentNumber) => {
    try {
      await axios.post(`${API_URL}/admin/checkout`, { studentNumber });
      alert(`✅ Student ${studentNumber} checked out successfully!`);
      fetchData(); // refresh dashboard
    } catch (err) {
      console.error("Checkout error:", err);
      alert("❌ Failed to check out student");
    }
  };

  // QR Scanner
  useEffect(() => {
    if (!showScanner) return;

    const scanner = new Html5QrcodeScanner("staff-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      async (decodedText) => {
        try {
          const studentData = JSON.parse(decodedText);

          await axios.post(`${API_URL}/admin/checkin-qr`, {
            studentNumber: studentData.studentNumber,
          });

          alert(`✅ Checked in: ${studentData.name} (${studentData.studentNumber})`);
          setShowScanner(false);
          fetchData();
        } catch (err) {
          alert("❌ Invalid QR Code or Check-in failed");
          console.error(err);
        }
      },
      (error) => {
        console.warn("QR scan error:", error);
      }
    );

    return () => {
      scanner.clear().catch((err) => console.error("Scanner clear error:", err));
    };
  }, [showScanner]);

  // Create/Edit class
  const handleClassSubmit = async (classData) => {
    try {
      if (editingClass) {
        await axios.put(`${API_URL}/admin/classes/${editingClass._id}`, classData);
      } else {
        await axios.post(`${API_URL}/admin/classes`, classData);
      }
      setShowClassForm(false);
      setEditingClass(null);
      fetchClasses();
    } catch (err) {
      alert("Failed to save class");
    }
  };

  // Delete class
  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await axios.delete(`${API_URL}/admin/classes/${classId}`);
      fetchClasses();
    } catch (err) {
      alert("Failed to delete class");
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Staff Dashboard</h1>

      {loading ? (
        <div className="loading">Loading insights...</div>
      ) : error ? (
        <div className="error-text">{error}</div>
      ) : (
        <div className="dashboard-grid">
          {/* Occupancy */}
          <div className="dashboard-card">
            <h2>Gym Occupancy</h2>
            <p>{occupancy} students currently inside</p>
          </div>

          {/* Active Students */}
          <div className="dashboard-card">
            <h2>Active Students</h2>
            {activeStudents.length > 0 ? (
              <ul>
                {activeStudents.map((s) => (
                  <li key={s._id}>
                    {s.studentId?.firstName} {s.studentId?.lastName} (
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
          </div>

          {/* QR Scanner */}
          <div className="dashboard-card">
            <h2>QR Scanner</h2>
            {showScanner ? (
              <div id="staff-reader" style={{ width: "100%" }}></div>
            ) : (
              <button onClick={() => setShowScanner(true)} className="dashboard-btn">
                📷 Scan QR Code
              </button>
            )}
          </div>

          {/* Recent Check-ins */}
          <div className="dashboard-card">
            <h2>Recent Check-ins</h2>
            {recentCheckins.length > 0 ? (
              <ul>
                {recentCheckins.map((c) => (
                  <li key={c._id}>
                    {c.studentId?.firstName} {c.studentId?.lastName} -{" "}
                    {new Date(c.checkInTime).toLocaleTimeString()}{" "}
                    {c.checkOutTime ? "" : "(Still inside)"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent check-ins.</p>
            )}
          </div>

          {/* Gym Class Management */}
          <div className="dashboard-card">
            <h2>Gym Classes</h2>
            <div style={{ marginBottom: "1rem" }}>
              <button
                className="dashboard-btn"
                onClick={() => { setShowClassForm(true); setEditingClass(null); }}
                style={{ marginRight: "1rem" }}
              >
                ➕ Add New Class
              </button>
              {editingClass && (
                <span style={{ color: "#1976d2", fontWeight: "bold" }}>
                  Editing: {editingClass.name}
                </span>
              )}
            </div>
            {showClassForm && (
              <div className="class-form-container" style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px", marginBottom: "2rem" }}>
                <ClassForm
                  initialData={editingClass}
                  onSubmit={handleClassSubmit}
                  onCancel={() => { setShowClassForm(false); setEditingClass(null); }}
                />
              </div>
            )}
            <div className="class-list" style={{ display: "grid", gap: "1rem" }}>
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <div key={cls._id} className="class-card" style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "1rem",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ fontSize: "1.2rem" }}>{cls.name}</strong>
                        <span style={{ marginLeft: "0.5rem", color: "#888" }}>
                          ({cls.category?.level}, {cls.category?.intensity})
                        </span>
                      </div>
                      <div>
                        <button
                          className="dashboard-btn small"
                          style={{ marginRight: "0.5rem" }}
                          onClick={() => {
                            setEditingClass(cls);
                            setShowClassForm(true);
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="dashboard-btn small danger"
                          onClick={() => handleDeleteClass(cls._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: "0.5rem" }}>
                      <span>Instructor: <b>{cls.instructor?.name}</b></span> | 
                      <span> Capacity: <b>{cls.capacity}</b></span>
                    </div>
                    <div style={{ marginTop: "0.5rem", color: "#555" }}>
                      <span>Schedule: {cls.schedule?.days?.join(", ")} {cls.schedule?.time} ({cls.schedule?.type})</span>
                    </div>
                    <details style={{ marginTop: "0.5rem" }}>
                      <summary style={{ cursor: "pointer" }}>More Details</summary>
                      <div style={{ marginTop: "0.5rem" }}>
                        <p>Description: {cls.description}</p>
                        <p>Campus: {cls.campus}</p>
                        <p>Instructor Specialty: {cls.instructor?.specialty}</p>
                        <p>Instructor Contact: {cls.instructor?.contact}</p>
                        <p>Instructor Rating: {cls.instructor?.rating} ({cls.instructor?.totalRatings} ratings)</p>
                        <p>Schedule Frequency: {cls.schedule?.frequency}</p>
                        <p>Duration: {cls.schedule?.duration} min</p>
                        <p>Date: {cls.date ? new Date(cls.date).toLocaleDateString() : ""}</p>
                      </div>
                    </details>
                  </div>
                ))
              ) : (
                <p>No classes found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Improved ClassForm with grouped sections and labels
function ClassForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initialData || {
      classId: "",
      name: "",
      description: "",
      date: "",
      capacity: "",
      campus: "",
      category: { primary: "", level: "Beginner", intensity: "Low" },
      instructor: { name: "", contact: "", specialty: "Other", photo: "", rating: 0, totalRatings: 0 },
      schedule: { days: [], type: "In-Person", frequency: "Once", time: "", duration: "" }
    }
  );

  const campusOptions = ["NWU01", "NWU02", "NWU03"];
  const specialtyOptions = ['Yoga', 'Pilates', 'Cardio', 'Strength Training', 'Dance', 'HIIT', 'Cycling', 'Other'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit(form); }}
      style={{ display: "grid", gap: "1rem" }}
    >
      <fieldset style={{ border: "1px solid #e0e0e0", borderRadius: "6px", padding: "1rem" }}>
        <legend style={{ fontWeight: "bold" }}>Basic Info</legend>
        <label>
          Class ID
          <input value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })} required />
        </label>
        <label>
          Class Name
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label>
          Description
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </label>
        <label>
          Date
          <input type="date" value={form.date ? form.date.substring(0,10) : ""} onChange={e => setForm({ ...form, date: e.target.value })} required />
        </label>
        <label>
          Capacity
          <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} required />
        </label>
        <label>
          Campus
          <select value={form.campus} onChange={e => setForm({ ...form, campus: e.target.value })} required>
            <option value="">Select Campus</option>
            {campusOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </fieldset>

      <fieldset style={{ border: "1px solid #e0e0e0", borderRadius: "6px", padding: "1rem" }}>
        <legend style={{ fontWeight: "bold" }}>Category</legend>
        <label>
          Primary
          <input value={form.category.primary} onChange={e => setForm({ ...form, category: { ...form.category, primary: e.target.value } })} required />
        </label>
        <label>
          Level
          <select value={form.category.level} onChange={e => setForm({ ...form, category: { ...form.category, level: e.target.value } })}>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </label>
        <label>
          Intensity
          <select value={form.category.intensity} onChange={e => setForm({ ...form, category: { ...form.category, intensity: e.target.value } })}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </label>
      </fieldset>

      <fieldset style={{ border: "1px solid #e0e0e0", borderRadius: "6px", padding: "1rem" }}>
        <legend style={{ fontWeight: "bold" }}>Instructor</legend>
        <label>
          Name
          <input value={form.instructor.name} onChange={e => setForm({ ...form, instructor: { ...form.instructor, name: e.target.value } })} required />
        </label>
        <label>
          Contact
          <input value={form.instructor.contact} onChange={e => setForm({ ...form, instructor: { ...form.instructor, contact: e.target.value } })} />
        </label>
        <label>
          Specialty
          <select value={form.instructor.specialty} onChange={e => setForm({ ...form, instructor: { ...form.instructor, specialty: e.target.value } })}>
            {specialtyOptions.map(s => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Photo URL
          <input value={form.instructor.photo} onChange={e => setForm({ ...form, instructor: { ...form.instructor, photo: e.target.value } })} />
        </label>
        <label>
          Rating
          <input type="number" min="0" max="5" value={form.instructor.rating} onChange={e => setForm({ ...form, instructor: { ...form.instructor, rating: e.target.value } })} />
        </label>
        <label>
          Total Ratings
          <input type="number" min="0" value={form.instructor.totalRatings} onChange={e => setForm({ ...form, instructor: { ...form.instructor, totalRatings: e.target.value } })} />
        </label>
      </fieldset>

      <fieldset style={{ border: "1px solid #e0e0e0", borderRadius: "6px", padding: "1rem" }}>
        <legend style={{ fontWeight: "bold" }}>Schedule</legend>
        <div>
          <label>Days:</label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {daysOfWeek.map(day => (
              <label key={day} style={{ fontWeight: "normal" }}>
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
        <label>
          Type
          <select value={form.schedule.type} onChange={e => setForm({ ...form, schedule: { ...form.schedule, type: e.target.value } })}>
            <option>In-Person</option><option>Virtual</option><option>Hybrid</option>
          </select>
        </label>
        <label>
          Frequency
          <select value={form.schedule.frequency} onChange={e => setForm({ ...form, schedule: { ...form.schedule, frequency: e.target.value } })}>
            <option>Once</option><option>Weekly</option><option>Bi-Weekly</option><option>Monthly</option>
          </select>
        </label>
        <label>
          Time
          <input value={form.schedule.time} onChange={e => setForm({ ...form, schedule: { ...form.schedule, time: e.target.value } })} placeholder="e.g. 17:00" required />
        </label>
        <label>
          Duration (min)
          <input type="number" value={form.schedule.duration} onChange={e => setForm({ ...form, schedule: { ...form.schedule, duration: e.target.value } })} required />
        </label>
      </fieldset>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button type="submit" className="dashboard-btn success">💾 Save</button>
        <button type="button" className="dashboard-btn danger" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default StaffDashboard;
