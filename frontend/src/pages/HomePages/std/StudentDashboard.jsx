// Main Component

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBar from "./components/statusBar";
import BottomNav from "./components/bottomNav";
import ClassesSection from "./components/classes";
import DashboardHeader from "./components/DashboardHeader";
import ErrorState from "./components/ErrorState";
import LoadingState from "./components/LoadingState";
import QRCodeModal from "./components/qrCodeModal";
import RecentCheckins from "./components/RecentCheckin";
import StartWorkoutSection from "./components/startWorkout";
import StatsCards from "./components/StatsCard";
import TemplateModal from "./components/TemplateModel"; 
import WorkoutsGrid from "./components/WorkoutsGrid";
import WorkoutTemplates from "./components/workoutTemplate";


const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [classes, setClasses] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [workoutStats, setWorkoutStats] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const rawStudent = localStorage.getItem("student");

        let storedStudent = null;

        try {
          storedStudent = JSON.parse(rawStudent);
        } catch (parseErr) {
          console.error("Failed to parse student data: ", parseErr);
        }
        console.log("Session student", storedStudent);
        
        if (!storedStudent) {
          console.error("No student data found. Please log in.");
          navigate("/");
          setLoading(false);
          return;
        }

        setStudent(storedStudent);
        setError(null);

        await Promise.allSettled([
          fetchQRData(storedStudent.studentNumber),
          fetchCheckins(storedStudent.studentNumber),
          fetchWorkoutTemplates(storedStudent.studentNumber),
          fetchWorkoutStats(storedStudent.studentNumber),
          fetchClasses()
        ]);

      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchQRData = async (studentNumber) => {
    try {
      const response = await fetch(`${API_URL}/access/qr/${studentNumber}`);
      if (response.ok) {
        const data = await response.json();
        setQrData(data.qrData);
      }
    } catch (error) {
      console.error("QR fetch error:", error);
    }
  };

  const fetchCheckins = async (studentNumber) => {
    try {
      const response = await fetch(`${API_URL}/access/qr/${studentNumber}`);
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
        console.log("Template API Responses:", data);
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
        setWorkoutStats(data.stats || null);
      }
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_URL}/classes/${studentNumber}`);
      
      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes || []);
      }
    } catch (error) {
      console.error("Classes fetch error:", error);
    }
  };

  
  const openEditModal = (template) => {
    setEditingTemplate({ ...template });
    setShowTemplateModal(true);
  };

  const handleModalClose = () => {
    setShowTemplateModal(false);
    setWorkoutName("");
    setEditingTemplate(null);
  };

  const handleTemplateInputChange = (e) => {
    if (editingTemplate) {
      setEditingTemplate({ ...editingTemplate, name: e.target.value });
    } else {
      setWorkoutName(e.target.value);
    }
  };

  const handleTemplateSave = () => {
    if (editingTemplate) {
      handleEditTemplate();
    } else {
      handleAddWorkout();
    }
  };

  if (loading) {
    return (
      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#f8f8f8',
        minHeight: '100vh'
      }}>
        <StatusBar />
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#f8f8f8',
        minHeight: '100vh'
      }}>
        <StatusBar />
        <ErrorState message={error} />
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#f8f8f8',
        minHeight: '100vh'
      }}>
        <StatusBar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#888', marginBottom: '16px' }}>Please log in to access your dashboard.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              style={{
                background: '#007AFF',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#f8f8f8',
      height: '100vh',
      paddingBottom: '80px',
      overflowY: 'auto'
      //display: 'flex'
    }}>
      
      <StatusBar studentNumber={student?.studentNumber} />

      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '12px 16px',
          margin: '8px 20px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px'
        }}>
          {error}
          <button 
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#c62828',
              fontSize: '18px',
              cursor: 'pointer',
              padding: 0,
              marginLeft: '12px'
            }}
          >
            ×
          </button>
        </div>
      )}

      <DashboardHeader student={student} showQR={showQR} setShowQR={setShowQR} />
      
      <QRCodeModal 
        show={showQR} 
        onClose={() => setShowQR(false)} 
        student={student} 
        qrData={qrData} 
      />

      <div style={{ padding: '0 20px' }}>
        <StatsCards workoutStats={workoutStats} />
         <ClassesSection
          classes={classes}
          onBookClass={() => navigate('/classes')}
          onViewBookings={() => navigate('/my-bookings')}
        />
        
       

        <WorkoutsGrid
          workouts={templates} // Assuming templates as workouts; adjust if separate endpoint
          onSelectWorkout={(workout) => navigate(`/workout/${workout.id}`)}
        />

      </div>


      <BottomNav navigate={navigate} />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (min-width: 768px) {
          .bottom-nav {
            display: none;
          }
        }
      `}</style>
    </div>
    
  );
};

export default StudentDashboard;