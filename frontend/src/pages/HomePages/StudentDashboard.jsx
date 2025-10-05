import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, QrCode, Heart, Settings, Home, Clock, Users } from "lucide-react";
import QRCode from "react-qr-code";
import "../../styles/StudentDashboard.css";

// Mock API calls - replace with your actual API
const API_URL = import.meta.env.VITE_API_URL;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [occupancy, setOccupancy] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [classes, setClasses] = useState([]);

  // Workout template state
  const [workoutName, setWorkoutName] = useState("");
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [workoutStats, setWorkoutStats] = useState(null);

  // Campus classes state
  const [selectedCampus, setSelectedCampus] = useState("Potchefstroom");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedStudent = localStorage.getItem('student');
        if (!storedStudent) {
          console.error("No student data found. Please log in.");
          setLoading(false);
          return;
        }

        const studentData = JSON.parse(storedStudent);
        setStudent(studentData);
        setError(null);

        await Promise.all([
          fetchQRData(studentData.studentNumber),
          fetchCheckins(studentData.studentNumber),
          fetchWorkoutTemplates(studentData.studentNumber),
          fetchWorkoutStats(studentData.studentNumber),
          fetchClasses(selectedCampus)
        ]);

      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCampus]);

  const fetchQRData = async (studentNumber) => {
    try {
      const response = await fetch(`${API_URL}/access/qr/${studentNumber}`);
      if (response.ok) {
        const data = await response.json();
        setQrData(data.qrData);
      } else {
        console.error("Failed to fetch QR data:" + response.statusText);
      }
    } catch (error) {
      console.error("QR fetch error:", error);
    }
  };

  const fetchCheckins = async (studentNumber) => {
    try {
      const response = await fetch(`${API_URL}/access/checkin/${studentNumber}`);
      if (response.ok) {
        const data = await response.json();
        setCheckins(data.checkIns?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error("Checkins fetch error:", error);
    }
  };

  const fetchWorkoutTemplates = async (studentNumber) => {
    try {
      const response = await fetch(`${API_URL}/templates/${studentNumber}`);
      if (response.ok) {
        const data = await response.json();
        setWorkoutTemplates(data.templates || []);
      }
    } catch (error) {
      console.error("Templates fetch error:", error);
    }
  };

  const fetchWorkoutStats = async (studentNumber) => {
    try {
      const response = await fetch(`${API_URL}/workouts/stats/${studentNumber}`);
      if (response.ok) {
        const data = await response.json();
        if (data.stats) {
          setWorkoutStats(data.stats);
        } else {
          console.error("API returned invalid stats data.");
          setWorkoutStats(null);
        }
      } else {
        console.error("Failed to fetch workout stats");
      }
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  const fetchClasses = async (campus) => {
    try {
      const response = await fetch(`${API_URL}/classes?campus=${campus}`);
      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes || []);
      }
    } catch (error) {
      console.error("Classes fetch error:", error);
    }
  };

  const handleAddWorkout = async () => {
    if (!workoutName.trim() || !student) return;
    
    try {
      const response = await fetch(`${API_URL}/templates/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentNumber: student.studentNumber,
          name: workoutName.trim(),
          exercises: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        setWorkoutTemplates([...workoutTemplates, data.template]);
        setWorkoutName("");
        setShowTemplateModal(false);
        alert("Workout template created successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create template'}`);
      }
    } catch (err) {
      console.error("Error adding workout:", err);
      alert("Failed to create workout template. Please try again.");
    }
  };

  const handleEditTemplate = async () => {
    if (!editingTemplate || !editingTemplate.name.trim()) return;

    try {
      const response = await fetch(`${API_URL}/templates/${editingTemplate._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingTemplate.name.trim() })
      });

      if (response.ok) {
        const updatedTemplate = await response.json();
        setWorkoutTemplates(workoutTemplates.map(t =>
          t._id === updatedTemplate.template._id ? updatedTemplate.template : t
        ));
        setEditingTemplate(null);
        setShowTemplateModal(false);
        alert("Workout template updated successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to update template'}`);
      }
    } catch (err) {
      console.error("Error updating template:", err);
      alert("Failed to update workout template. Please try again.");
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`${API_URL}/templates/${templateId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setWorkoutTemplates(workoutTemplates.filter(t => t._id !== templateId));
        alert("Template deleted successfully!");
      } else {
        alert("Failed to delete template");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete template. Please try again.");
    }
  };
  
  const openEditModal = (template) => {
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  const handleModalClose = () => {
    setShowTemplateModal(false);
    setWorkoutName("");
    setEditingTemplate(null);
  };

  if (loading) {
    return (
      <div className="workout-app">
        <div className="status-bar">
          <span className="device-name">Fit@NWU</span>
        </div>
        <div className="app-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center', color: '#888' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid #f0f0f0', 
              borderTop: '3px solid #007AFF', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="workout-app">
        <div className="status-bar">
          <span className="device-name">Fit@NWU</span>
        </div>
        <div className="app-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center', color: '#ff4444' }}>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="workout-app">
        <div className="status-bar">
          <span className="device-name">Fit@NWU</span>
        </div>
        <div className="app-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#888', marginBottom: '16px' }}>Please log in to access your dashboard.</p>
            <button 
              className="primary-button"
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-app">
      {/* Status Bar */}
      <div className="status-bar">
        <span className="device-name">Fit@NWU</span>
        {student?.studentNumber && <span style={{ fontSize: '12px', color: '#888' }}>Student: {student.studentNumber}</span>}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Header */}
      <div style={{ 
        padding: '20px 20px 16px', 
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#333', 
            margin: '0 0 4px 0' 
          }}>
            Welcome, {student?.name?.first}
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#888', 
            margin: '0' 
          }}>
            {student?.name?.last}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowQR(!showQR)}
            style={{
              background: '#f5f5f5',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <QrCode size={20} color="#666" />
          </button>
          <div style={{
            background: '#007AFF',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            {student?.name?.first?.charAt(0)}{student?.name?.last?.charAt(0)}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '320px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>Your QR Code</h3>
            <div style={{ 
              width: '200px', 
              height: '200px', 
              margin: '0 auto 16px', 
              padding: '16px',
              border: '1px solid #eee',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {qrData ? (
                <QRCode 
                  value={qrData}
                  size={168}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              ) : (
                <QrCode size={100} color="#ccc" />
              )}
            </div>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0' }}>
              <strong>Student:</strong> {student?.name?.first} {student?.name?.last}
            </p>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px 0' }}>
              <strong>Number:</strong> {student?.studentNumber}
            </p>
            <p style={{ fontSize: '12px', color: '#999', margin: '0 0 20px 0' }}>
              Show this code at the gym entrance
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="primary-button"
              style={{ width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="app-content">
        {/* Quick Stats */}
        {workoutStats && (
          <div className="workout-section">
            <h2 className="section-title">Your Stats</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid #eee'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#007AFF' }}>
                  {workoutStats.totalWorkouts}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>Total Workouts</div>
              </div>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid #eee'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#34C759' }}>
                  {workoutStats.weeklyWorkouts}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>This Week</div>
              </div>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid #eee'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#AF52DE' }}>
                  {workoutStats.totalTemplates}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>Templates</div>
              </div>
            </div>
          </div>
        )}

        {/* Start Your Workout */}
        <div className="workout-section">
          <h2 className="section-title">Start Your Workout!</h2>
          
          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={16} color="#999" style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)' 
            }} />
            <input
              type="text"
              placeholder="Search workouts..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Today's Goal Card */}
          <div style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                  Today's Goal:
                </h3>
                <p style={{ fontSize: '14px', margin: '0', opacity: 0.9 }}>
                  Achieve a PR!
                </p>
              </div>
              <div style={{ fontSize: '40px', opacity: 0.7 }}>
                ⭐
              </div>
            </div>
          </div>
        </div>

        {/* Classes Section */}
        <div className="workout-section">
          <div className="section-header">
            <h2 className="section-title">Classes</h2>
            <select 
              value={selectedCampus} 
              onChange={(e) => setSelectedCampus(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#007AFF',
                fontSize: '14px',
                fontWeight: '500',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Potchefstroom">Potchefstroom</option>
              <option value="Vaal">Vaal</option>
              <option value="Mafikeng">Mafikeng</option>
            </select>
          </div>
          
          {classes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {classes.slice(0, 2).map((classItem, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#ff9500',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {classItem.name === 'Yoga' ? '🧘‍♀️' : 
                     classItem.name === 'Zumba' ? '💃' : 
                     classItem.name === 'CrossFit' ? '🏋️‍♂️' : '💪'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                      {classItem.name}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#888', margin: '0 0 2px 0' }}>
                      {classItem.time} • {classItem.instructor}
                    </p>
                    <p style={{ fontSize: '12px', color: '#999', margin: '0' }}>
                      {classItem.enrolled}/{classItem.capacity} enrolled
                    </p>
                  </div>
                  <Heart size={20} color="#ddd" />
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>
              No classes available for {selectedCampus}
            </p>
          )}
        </div>

        {/* Workouts Section */}
        <div className="workout-section">
          <div className="section-header">
            <h2 className="section-title">Workouts</h2>
            <button style={{ background: 'none', border: 'none', color: '#007AFF', fontSize: '14px', cursor: 'pointer' }}>
              See all
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {[
              { name: "Body Building", color: "#007AFF", emoji: "💪" },
              { name: "Cardio", color: "#FF9500", emoji: "❤️" },
              { name: "Pilates", color: "#AF52DE", emoji: "🤸‍♀️" }
            ].map((workout, index) => (
              <div key={index} style={{
                background: 'white',
                border: '1px solid #eee',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                ':hover': { transform: 'scale(1.05)' }
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {workout.emoji}
                </div>
                <p style={{ fontSize: '12px', fontWeight: '500', margin: '0', color: '#333' }}>
                  {workout.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* My Workout Templates */}
        <div className="workout-section">
          <div className="section-header">
            <h2 className="section-title">My Workout Templates</h2>
            <button
              onClick={() => { setShowTemplateModal(true); setEditingTemplate(null); }}
              className="add-button"
            >
              + New
            </button>
          </div>
          
          {workoutTemplates.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>
              No templates yet. Create your first one!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {workoutTemplates.map((template) => (
                <div key={template._id} style={{
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>🏋️</span>
                    <div>
                      <span style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                        {template.name}
                      </span>
                      <p style={{ fontSize: '12px', color: '#999', margin: '2px 0 0 0' }}>
                        {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                      onClick={() => openEditModal(template)}
                      title="Edit template"
                    >
                      ✏️
                    </button>
                    <button 
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                      onClick={() => handleDeleteTemplate(template._id)}
                      title="Delete template"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Check-ins */}
        {checkins.length > 0 && (
          <div className="workout-section">
            <h2 className="section-title">Recent Check-ins</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {checkins.map((checkin) => (
                <div key={checkin._id} style={{
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Clock size={16} color="#999" />
                  <span style={{ fontSize: '14px', color: '#666', flex: 1 }}>
                    {new Date(checkin.checkInTime).toLocaleDateString()} at{" "}
                    {new Date(checkin.checkInTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {checkin.isActive && (
                    <span style={{
                      fontSize: '12px',
                      color: '#34C759',
                      background: '#E8F5E8',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      Active
                    </span>
                  )}
                  {checkin.checkOutTime && (
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {Math.round((new Date(checkin.checkOutTime) - new Date(checkin.checkInTime)) / (1000 * 60))} min
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Workout Template Modal */}
      {showTemplateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '320px',
            width: '100%'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              margin: '0 0 16px 0' 
            }}>
              {editingTemplate ? 'Edit Workout Template' : 'Create Workout Template'}
            </h3>
            <input
              type="text"
              placeholder="Enter workout name..."
              value={editingTemplate ? editingTemplate.name : workoutName}
              onChange={(e) => {
                if (editingTemplate) {
                  setEditingTemplate({ ...editingTemplate, name: e.target.value });
                } else {
                  setWorkoutName(e.target.value);
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                marginBottom: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (editingTemplate) {
                    handleEditTemplate();
                  } else {
                    handleAddWorkout();
                  }
                }
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={editingTemplate ? handleEditTemplate : handleAddWorkout}
                disabled={!workoutName.trim() && (!editingTemplate || !editingTemplate.name.trim())}
                className="primary-button"
                style={{ flex: 1 }}
              >
                {editingTemplate ? 'Save Changes' : 'Save'}
              </button>
              <button
                onClick={handleModalClose}
                style={{
                  flex: 1,
                  background: '#f5f5f5',
                  color: '#333',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className="nav-item active">
          <Home size={20} />
          <span>Home</span>
        </button>
        <button 
          className="nav-item"
          onClick={() => navigate("/workout")}
        >
          <span style={{ fontSize: '20px' }}>💪</span>
          <span>Workouts</span>
        </button>
        <button 
          className="nav-item"
          onClick={() => navigate("/class-bookings")}
        >
          <Users size={20} />
          <span>Classes</span>
        </button>
        <button className="nav-item"
        onClick={() => navigate("/profile")}>
          <span style={{ fontSize: '20px' }}>👤</span>
          <span>Profile</span>
        </button>
        <button className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>

      <style jsx>{`
        .workout-app {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f8f8f8;
          min-height: 100vh;
          padding-bottom: 80px;
        }

        .status-bar {
          background: #000;
          color: #fff;
          padding: 8px 20px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .app-content {
          padding: 0 20px;
        }

        .workout-section {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #333;
          margin: 0 0 12px 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .primary-button {
          background: #007AFF;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-button:hover {
          background: #0056CC;
        }

        .primary-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .add-button {
          background: none;
          border: none;
          color: #007AFF;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 12px 16px;
          margin: 8px 20px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .error-message button {
          background: none;
          border: none;
          color: #c62828;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          margin-left: 12px;
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #eee;
          padding: 8px 0;
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 10;
        }

        .nav-item {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          cursor: pointer;
          color: #999;
          font-size: 12px;
          transition: color 0.2s ease;
        }

        .nav-item.active {
          color: #007AFF;
        }

        .nav-item:hover {
          color: #007AFF;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (min-width: 768px) {
          .workout-app {
            padding-bottom: 0;
          }
          
          .bottom-nav {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;