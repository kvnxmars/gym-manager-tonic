import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../styles/dashboard.css";
import { Html5QrcodeScanner } from "html5-qrcode";

const API_URL = "http://localhost:5000/api";

const specialtyOptions = [
  "Yoga",
  "Pilates",
  "Cardio",
  "Strength Training",
  "Dance",
  "HIIT",
  "Cycling",
  "Other",
];
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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
  const [saving, setSaving] = useState(false);

  // Add a ref to the main scrollable container
  const containerRef = useRef(null);

  // Enable page/container scrolling if something disabled it
  const enableScrolling = () => {
    try {
      // Ensure document can scroll
      document.documentElement.style.overflowY = "auto";
      document.body.style.overflowY = "auto";
      // Ensure the dashboard container itself scrolls
      if (containerRef.current) {
        containerRef.current.style.overflowY = "auto";
        containerRef.current.style.maxHeight = "100vh";
      }
    } catch (err) {
      console.warn("enableScrolling error:", err);
    }
  };

  // Smooth scroll helpers
  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  // Call enableScrolling on mount and after layout changes
  useEffect(() => {
    enableScrolling();
    // Re-enable if user toggles form or editing state
  }, [showClassForm, editingClass]);

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
      // GET /api/classes (public generic list)
      const res = await axios.get(`${API_URL}/classes`);
      console.log("Fetched classes:", res.data);
      // backend may return array or { classes: [...] }
      setClasses(res.data?.classes || res.data || [] );
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  }; 
  /*const fetchClasses = async () => {
  try {
    const res = await axios.get("/api/classes");
    console.log("Fetched classes:", res.data); //  debug
    setClasses(res.data);
  } catch (err) {
    console.error("Error fetching classes:", err);
  }
}; */

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

  // validate minimal required fields before sending (safe checks)
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

  // prepare minimal payload matching backend schema (campus removed)
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

  // Create/Edit class
  // Edit or Create class
const handleClassSubmit = async (classData) => {
  setError("");
  const payload = prepareClassPayload(classData);

  setSaving(true);
  try {
    if (editingClass) {
      // always use Mongo _id for update
      const id = editingClass._id;
      await axios.put(`${API_URL}/classes/update/${id}`, payload);
    } else {
      await axios.post(`${API_URL}/classes/create`, payload);
    }
    setShowClassForm(false);
    setEditingClass(null);
    fetchClasses();
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
  if (!window.confirm("Delete this class?")) return;
  try {
    await axios.delete(`${API_URL}/classes/delete/${classId}`);
    fetchClasses();
  } catch (err) {
    console.error("Delete class error:", err);
    const serverMsg = err.response?.data?.message || err.response?.data || err.message;
    alert("Failed to delete class: " + (typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg)));
  }
};

  

  return (
    // Attach the ref to the top container so JS can scroll it
    <div ref={containerRef} className="dashboard-container">
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
            )
            }
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
                  saving={saving}
                />
              </div>
            )}
            <div className="class-list" style={{ display: "grid", gap: "1rem" }}>
              {classes.length > 0 ? (
                classes.map((cls) => (
                                  <div key={cls._id} className="class-card">
                    <strong>{cls.name}</strong> - {cls.category?.level} ({cls.category?.intensity})<br />
                    Instructor: {cls.instructor?.name} | Capacity: {cls.capacity}<br />
                    Schedule: {cls.schedule?.days?.join(", ")} {cls.schedule?.time} ({cls.schedule?.type})

                    <div style={{ marginTop: "0.5rem" }}>
                      <button
                        className="dashboard-btn small"
                        onClick={() => {
                          setEditingClass(cls);
                          setShowClassForm(true);
                        }}
                      >
                        ✏️ Update
                      </button>
                      <button
                        className="dashboard-btn small danger"
                        onClick={async () => {
                          if (!window.confirm(`Delete class "${cls.name}"?`)) return;
                          try {
                            await axios.delete(`${API_URL}/classes/delete/${cls._id}`);
                            setClasses(prev => prev.filter(c => c._id !== cls._id));
                            alert("✅ Class deleted successfully!");
                          } catch (err) {
                            console.error(err);
                            alert("❌ Failed to delete class");
                          }
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No classes found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Place quick-scroll controls */}
      <div className="scroll-controls" aria-hidden="false">
        <button type="button" className="scroll-btn" onClick={scrollToTop} title="Scroll to top">↑</button>
        <button type="button" className="scroll-btn" onClick={scrollToBottom} title="Scroll to bottom">↓</button>
      </div>
    </div>
  );
};

// validate minimal required fields before sending (safe checks)
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

// prepare minimal payload matching backend schema (clean primitives, arrays, numbers)
// backward-compat prepareClassPayload kept for other modules

// Improved ClassForm with normalization to avoid runtime errors
function ClassForm({ initialData, onSubmit, onCancel, saving = false }) {
  const normalize = (data) => ({
    classId: data?.classId ?? "",
    name: data?.name ?? "",
    description: data?.description ?? "",
    date: data?.date
      ? (typeof data.date === "string" ? data.date.substring(0,10) : (data.date instanceof Date ? data.date.toISOString().substring(0,10) : ""))
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
          {/* Campus removed — backend no longer tracks campus */}
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
        <button type="submit" disabled={saving} className="dashboard-btn success">{saving ? "Saving..." : "💾 Save"}</button>
        <button type="button" className="dashboard-btn danger" onClick={onCancel}>Cancel</button>
      </div>
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
  onClick={() => handleDeleteClass(cls._id)} // pass _id only
>
  🗑️ Delete
</button>

    </form>
  );
}

export default StaffDashboard;