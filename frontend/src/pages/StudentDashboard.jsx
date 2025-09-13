React, { useEffect, useState } from "react";
import { Search, QrCode, Heart, Settings, Home, Clock, Users } from "lucide-react";
import "../styles/StudentDashboard.css";

// Mock API calls - replace with your actual API
const API_URL = "http://localhost:5000/api";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [occupancy, setOccupancy] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  // Workout template state
  const [workoutName, setWorkoutName] = useState("");
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Campus classes state
  const [selectedCampus, setSelectedCampus] = useState("Potchefstroom");
  const [campusClasses] = useState({
    Potchefstroom: ["Yoga", "Pilates", "CrossFit"],
    Vaal: ["Body Pump", "Spin", "Yoga"],
    Mafikeng: ["Zumba", "Kickboxing", "Yoga"],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for demo - replace with actual API calls
        setStudent({
          name: { first: "Kevin", last: "Mbolongwe" },
          studentNumber: "12345678"
        });
        setOccupancy(24);
        setCheckins([
          { _id: 1, checkInTime: new Date().toISOString(), isActive: false },
          { _id: 2, checkInTime: new Date(Date.now() - 86400000).toISOString(), isActive: false }
        ]);
        
        // Uncomment and modify these when your backend is ready:
        /*
        const profileRes = await fetch(${API_URL}/student/profile);
        const profileData = await profileRes.json();
        setStudent(profileData.student);

        const qrRes = await fetch(${API_URL}/student/qr/${profileData.student.studentNumber});
        const qrData = await qrRes.json();
        setQrData(qrData.qrData);

        const occupancyRes = await fetch(${API_URL}/gym/occupancy);
        const occupancyData = await occupancyRes.json();
        setOccupancy(occupancyData.currentOccupancy);

        const checkinsRes = await fetch(${API_URL}/checkins/${profileData.student.studentNumber});
        const checkinsData = await checkinsRes.json();
        setCheckins(checkinsData.history?.slice(0, 5) || []);
        */
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddWorkout = async () => {
    if (!workoutName.trim()) return;
    try {
      
      
      // Uncomment when backend is ready:
      
      const res = await fetch($,{API_URL}/workouts, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentNumber: student.studentNumber,
          name: workoutName,
        })
      });
      const data = await res.json();
      setWorkoutTemplates([...workoutTemplates, data]);
      
    } catch (err) {
      console.error("Error adding workout:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
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
            <p className="text-sm text-gray-500">Fit@NWU</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <QrCode className="w-5 h-5 text-gray-700" />
          </button>
          <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
        </div>
      </div>

      {/* QR Code Overlay */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Your QR Code</h3>
            <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-32 h-32 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
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
        {/* Start Your Workout */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Start Your Workout!</h2>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
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
            <button className="text-blue-600 text-sm font-medium">See all</button>
          </div>
          
          {/* Class Card */}
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-4 flex items-center space-x-4">
            <div className="w-16 h-16 bg-orange-200 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🧘‍♀️</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Yoga Class</h4>
              <p className="text-sm text-gray-600">Potchefstroom</p>
            </div>
            <Heart className="w-5 h-5 text-gray-400" />
          </div>
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
              <div key={index} className={${workout.color} rounded-xl p-3 text-center}>
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
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🏋️</span>
                    <span className="font-medium text-gray-900">{template.name}</span>
                  </div>
                  <div className="flex space-x-…[22:35, 13/09/2025] Mamogale: x-2">
                    <button className="text-gray-400 hover:text-gray-600">✏️</button>
                    <button className="text-gray-400 hover:text-red-500">🗑️</button>
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
        </div>

        {/* Recent Check-ins */}
        {checkins.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Check-ins</h3>
            <div className="space-y-2">
              {checkins.map((checkin) => (
                <div key={checkin._id} className="flex items-center space-x-3 p-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(checkin.checkInTime).toLocaleDateString()} at{" "}
                    {new Date(checkin.checkInTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {checkin.isActive && <span className="text-green-600 ml-2">(Active)</span>}
                  </span>
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
            />
            <div className="flex space-x-3">
              <button
                onClick={handleAddWorkout}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right…
[22:35, 13/09/2025] Mamogale: //frontend/src/styles/StudentDashboard /* Updated Student Dashboard CSS */-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
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