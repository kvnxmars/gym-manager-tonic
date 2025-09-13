import React, { useEffect, useState } from "react";
import { Search, QrCode, Heart, Settings, Home, Clock, Users } from "lucide-react";
import "../styles/StudentDashboard.css"; // style file for dashboard

// API configuration
const API_URL = "http://localhost:5000/api";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [occupancy, setOccupancy] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [classes, setClasses] = useState([]);

  // Workout template state
  const [workoutName, setWorkoutName] = useState("");
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [workoutStats, setWorkoutStats] = useState(null);

  // Campus classes state
  const [selectedCampus, setSelectedCampus] = useState("Potchefstroom");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get student data from localStorage (set during login)
        const storedStudent = localStorage.getItem('student');
        if (!storedStudent) {
          console.error("No student data found. Please log in.");
          setLoading(false);
          return;
        }

        const studentData = JSON.parse(storedStudent);
        setStudent(studentData);

        // Fetch additional data
        await Promise.all([
          fetchQRData(studentData.studentNumber),
          fetchOccupancy(),
          fetchCheckins(studentData.studentNumber),
          fetchWorkoutTemplates(studentData.studentNumber),
          fetchWorkoutStats(studentData.studentNumber),
          fetchClasses(selectedCampus)
        ]);

      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCampus]);

  const fetchQRData = async (studentNumber) => {
    try {
      const response = await fetch(`${API_URL}/student/qr/${studentNumber}`);
      if (response.ok) {
        const data = await response.json();
        setQrData(data.qrData);
      } else {
        console.error("Failed to fetch QR data");
      }
    } catch (error) {
      console.error("QR fetch error:", error);
    }
  };

  const fetchOccupancy = async () => {
    try {
      const response = await fetch(`${API_URL}/gym/occupancy`);
      if (response.ok) {
        const data = await response.json();
        setOccupancy(data.currentOccupancy);
      }
    } catch (error) {
      console.error("Occupancy fetch error:", error);
    }
  };

  const fetchCheckins = async (studentNumber) => {
    try {
      const response = await fetch(`${API_URL}/checkins/${studentNumber}`);
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
      const response = await fetch(`${API_URL}/workouts/templates/${studentNumber}`);
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
        setWorkoutStats(data.stats);
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
      const response = await fetch(`${API_URL}/workouts/template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentNumber: student.studentNumber,
          name: workoutName.trim(),
          exercises: [] // Empty template to start with
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

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`${API_URL}/workouts/template/${templateId}`, {
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

  // Generate QR Code as SVG
  const generateQRCode = (text) => {
    const size = 200;
    const qrSize = 21;
    const moduleSize = size / qrSize;
    
    const pattern = [];
    for (let i = 0; i < qrSize; i++) {
      pattern[i] = [];
      for (let j = 0; j < qrSize; j++) {
        const hash = (text.charCodeAt((i + j) % text.length) + i * j) % 3;
        pattern[i][j] = hash < 1;
      }
    }

    const addFinderPattern = (startRow, startCol) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (startRow + i < qrSize && startCol + j < qrSize) {
            pattern[startRow + i][startCol + j] = 
              i === 0 || i === 6 || j === 0 || j === 6 || 
              (i >= 2 && i <= 4 && j >= 2 && j <= 4);
          }
        }
      }
    };

    addFinderPattern(0, 0);
    addFinderPattern(0, qrSize - 7);
    addFinderPattern(qrSize - 7, 0);

    return (
      <svg width={size} height={size} className="border">
        {pattern.map((row, i) =>
          row.map((cell, j) => (
            cell && (
              <rect
                key={`${i}-${j}`}
                x={j * moduleSize}
                y={i * moduleSize}
                width={moduleSize}
                height={moduleSize}
                fill="#000"
              />
            )
          ))
        )}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Welcome, {student?.name?.first} {student?.name?.last}
            </h1>
            <p className="text-sm text-gray-500">Fit@NWU - {student?.studentNumber}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <QrCode className="w-5 h-5 text-gray-700" />
          </button>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {student?.name?.first?.charAt(0)}{student?.name?.last?.charAt(0)}
            </span>
          </div>
        </div>
      </div>

      {/* QR Code Overlay */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Your QR Code</h3>
            <div className="w-48 h-48 mx-auto mb-4 flex items-center justify-center bg-white p-4 rounded-lg border">
              {qrData ? (
                generateQRCode(qrData)
              ) : (
                <QrCode className="w-32 h-32 text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Student:</strong> {student?.name?.first} {student?.name?.last}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Number:</strong> {student?.studentNumber}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Show this code at the gym entrance
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-6 space-y-6">
        {/* Quick Stats */}
        {workoutStats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{workoutStats.totalWorkouts}</div>
              <div className="text-sm text-gray-600">Total Workouts</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">{workoutStats.weeklyWorkouts}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{workoutStats.totalTemplates}</div>
              <div className="text-sm text-gray-600">Templates</div>
            </div>
          </div>
        )}

        {/* Start Your Workout */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Start Your Workout!</h2>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search workouts..."
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Today's Goal Card */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Today's Goal:</h3>
                <p className="text-blue-700 font-medium">Achieve a PR!</p>
              </div>
              <div className="text-blue-400">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Classes Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Classes</h3>
            <select 
              value={selectedCampus} 
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="text-blue-600 text-sm font-medium bg-transparent border-none focus:ring-0"
            >
              <option value="Potchefstroom">Potchefstroom</option>
              <option value="Vaal">Vaal</option>
              <option value="Mafikeng">Mafikeng</option>
            </select>
          </div>
          
          {classes.length > 0 ? (
            <div className="space-y-3">
              {classes.slice(0, 2).map((classItem, index) => (
                <div key={index} className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 bg-orange-200 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">
                      {classItem.name === 'Yoga' ? '🧘‍♀️' : 
                       classItem.name === 'Zumba' ? '💃' : 
                       classItem.name === 'CrossFit' ? '🏋️‍♂️' : '💪'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{classItem.name}</h4>
                    <p className="text-sm text-gray-600">{classItem.time} • {classItem.instructor}</p>
                    <p className="text-xs text-gray-500">{classItem.enrolled}/{classItem.capacity} enrolled</p>
                  </div>
                  <Heart className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No classes available for {selectedCampus}</p>
          )}
        </div>

        {/* Workouts Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Workouts</h3>
            <button className="text-blue-600 text-sm font-medium">See all</button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Body Building", color: "bg-blue-100", emoji: "💪" },
              { name: "Cardio", color: "bg-orange-100", emoji: "❤️" },
              { name: "Pilates", color: "bg-purple-100", emoji: "🤸‍♀️" }
            ].map((workout, index) => (
              <div key={index} className={`${workout.color} rounded-xl p-3 text-center cursor-pointer hover:scale-105 transition-transform`}>
                <div className="text-2xl mb-1">{workout.emoji}</div>
                <p className="text-xs font-medium text-gray-700">{workout.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* My Workout Templates */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">My Workout Templates</h3>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="text-blue-600 text-sm font-medium"
            >
              + New
            </button>
          </div>
          
          {workoutTemplates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No templates yet. Create your first one!</p>
          ) : (
            <div className="space-y-2">
              {workoutTemplates.map((template, idx) => (
                <div key={template._id || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🏋️</span>
                    <div>
                      <span className="font-medium text-gray-900">{template.name}</span>
                      <p className="text-xs text-gray-500">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="text-gray-400 hover:text-gray-600 p-1"
                      onClick={() => alert("Edit functionality coming soon!")}
                    >
                      ✏️
                    </button>
                    <button 
                      className="text-gray-400 hover:text-red-500 p-1"
                      onClick={() => handleDeleteTemplate(template._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gym Status */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gym Right Now</h3>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">{occupancy} students currently inside</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Capacity</span>
              <span>{occupancy}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((occupancy / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Check-ins */}
        {checkins.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Check-ins</h3>
            <div className="space-y-2">
              {checkins.map((checkin) => (
                <div key={checkin._id} className="flex items-center space-x-3 p-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 flex-1">
                    {new Date(checkin.checkInTime).toLocaleDateString()} at{" "}
                    {new Date(checkin.checkInTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {checkin.isActive && (
                    <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                  {checkin.checkOutTime && (
                    <span className="text-gray-500 text-xs">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Create Workout Template</h3>
            <input
              type="text"
              placeholder="Enter workout name..."
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddWorkout();
                }
              }}
            />
            <div className="flex space-x-3">
              <button
                onClick={handleAddWorkout}
                disabled={!workoutName.trim()}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setWorkoutName("");
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-2 text-blue-600">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-400">
            <span className="text-xl mb-1">💪</span>
            <span className="text-xs">Workouts</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-400">
            <span className="text-xl mb-1">👤</span>
            <span className="text-xs">Profile</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-400">
            <Settings className="w-6 h-6 mb-1" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;