import { useState, useEffect } from 'react';
import { User, Calendar, TrendingUp, Dumbbell, Clock, Flame, Loader2, Home, HouseHeart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from './components/Header';

const API_URL = import.meta.env.VITE_API_URL;
// API Configuration - Edit these URLs later


// API Service Layer
const apiService = {
  async fetchStudentProfile(studentNumber) {
    try {
      const response = await fetch(`${API_URL}/student/${studentNumber}`);
      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      console.log("Data:", data);
      return data.user || {};
      

    } catch (error) {
      console.error('API Error:', error);
      return {
        name: "Student First + Last Name",
        studentNumber: "00000000",
        email: "StudentName@gmail.com",
        checkIns: 45
      };
    }
  },

  async fetchWorkoutStats(studentNumber) {
    try {
      const response = await fetch(`${API_URL}/workouts/stats/${studentNumber}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return {
        totalWorkouts: 45,
        weeklyAverage: 3.5,
        totalHours: 67.5,
        caloriesBurned: 28500
      };
    }
  },

  async fetchWorkoutSessions(studentNumber) {
    try {
      const response = await fetch(`${API_URL}/workouts/${studentNumber}`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [
        {
          id: 1,
          type: "Upper Body Strength",
          date: "Oct 3, 2025",
          duration: 65,
          exercises: 8,
          sets: 24,
          calories: 420
        },
        {
          id: 2,
          type: "Cardio & Core",
          date: "Oct 1, 2025",
          duration: 45,
          exercises: 6,
          sets: 18,
          calories: 380
        },
        {
          id: 3,
          type: "Leg Day",
          date: "Sep 29, 2025",
          duration: 75,
          exercises: 7,
          sets: 28,
          calories: 510
        },
        {
          id: 4,
          type: "Full Body",
          date: "Sep 27, 2025",
          duration: 60,
          exercises: 10,
          sets: 30,
          calories: 450
        },
        {
          id: 5,
          type: "HIIT Training",
          date: "Sep 25, 2025",
          duration: 30,
          exercises: 5,
          sets: 15,
          calories: 320
        }
      ];
    }
  },

  async updatePassword(studentNumber, newPassword) {
    try {
      const response = await fetch(`${API_URL}/student/password/${studentNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      if (!response.ok) throw new Error('Failed to update password');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Styles
const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(to bottom, #f3e8ff, #e9d5ff)',
    overflowY: 'auto'

  },
  appWrapper: {
    width: '448px',
    margin: '0 auto',
    backgroundColor: '#581c87',
    height: '100vh',
    position: 'relative',
    
  },
  header: {
    backgroundColor: '#6b21a8',
    padding: '16px 24px',
  },
  headerTitle: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0,
  },
  content: {
    padding: '24px 16px',
    paddingBottom: '120px',
  },
  profileCard: {
    background: 'linear-gradient(to bottom right, #9333ea, #b49bc9ff)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    backgroundColor: '#d8b4fe',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 4px 0',
  },
  profileDetail: {
    color: '#e9d5ff',
    margin: '2px 0',
    fontSize: '14px',
  },
  checkInCard: {
    backgroundColor: 'rgba(107, 33, 168, 0.5)',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkInLabel: {
    color: 'white',
    fontWeight: '600',
    margin: 0,
  },
  checkInValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  statsCardInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statsIcon: {
    padding: '12px',
    borderRadius: '8px',
  },
  statsLabel: {
    color: '#6b7280',
    fontSize: '14px',
    margin: '0 0 4px 0',
  },
  statsValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  sectionTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  workoutCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    marginBottom: '12px',
    transition: 'box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  workoutCardHover: {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  workoutHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  workoutTitle: {
    fontWeight: 'bold',
    color: '#1f2937',
    fontSize: '18px',
    margin: '0 0 4px 0',
  },
  workoutDate: {
    color: '#6b7280',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    margin: 0,
  },
  workoutBadge: {
    backgroundColor: '#f3e8ff',
    color: '#6b21a8',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '600',
  },
  workoutStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  workoutStat: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '8px',
    textAlign: 'center',
  },
  workoutStatLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0 0 2px 0',
  },
  workoutStatValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 0',
  },
  logo: {
    width: '80px',
    height: '80px',
    backgroundColor: '#7c3aed',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  logoText: {
    color: 'white',
    fontSize: '36px',
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: '#6b21a8',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  passwordButton: {
    width: '100%',
    backgroundColor: '#e9d5ff',
    color: '#6b21a8',
    fontWeight: '600',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  passwordButtonHover: {
    backgroundColor: '#d8b4fe',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '448px',
    margin: '0 auto',
    backgroundColor: '#6b21a8',
    borderRadius: '24px 24px 0 0',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-around',
  },
  navButton: {
    padding: '12px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  navButtonActive: {
    backgroundColor: '#7c3aed',
  },
  navButtonInactive: {
    backgroundColor: '#581c87',
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 0',
  },
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div style={styles.loader}>
    <Loader2 style={{ width: '32px', height: '32px', color: '#7c3aed', animation: 'spin 1s linear infinite' }} />
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);



// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div style={styles.statsCard}>
    <div style={styles.statsCardInner}>
      <div style={{ ...styles.statsIcon, backgroundColor: color }}>
        <Icon style={{ width: '24px', height: '24px', color: 'white' }} />
      </div>
      <div>
        <p style={styles.statsLabel}>{label}</p>
        <p style={styles.statsValue}>{value}</p>
      </div>
    </div>
  </div>
);

// Workout Session Component
const WorkoutSession = ({ session }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        ...styles.workoutCard,
        ...(isHovered ? styles.workoutCardHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.workoutHeader}>
        <div>
          <h3 style={styles.workoutTitle}>{session.templateName}</h3>
          <p style={styles.workoutDate}>
            <Calendar style={{ width: '16px', height: '16px' }} />
            {session.timing?.finishedAt 
            ? new Date(session.timing.finishedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })
            : 'Date unavailable'}
          </p>
        </div>
        <div style={styles.workoutBadge}>
          {(session.timing?.duration) || 0} sec
        </div>
      </div>
      <div style={styles.statsGrid}>
        <div style={styles.stat}>
          <p style={styles.workoutStatLabel}>Exercises</p>
          <p style={styles.workoutStatValue}>{session.summary?.completedSets || 0}
            {Array.isArray(session.exercises)
            ?session.exercises.length
            :session.exercises
            }</p>
        </div>
        <div style={styles.workoutStat}>
          <p style={styles.workoutStatLabel}>Sets</p>
          <p style={styles.workoutStatValue}>
            {Array.isArray(session.sets) ?session.sets.length : session.summary?.sets}</p>
        </div>
        <div style={styles.workoutStat}>
          <p style={styles.workoutStatLabel}>Volume</p>
          <p style={styles.workoutStatValue}>{session.summary?.totalVolume || 0}</p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function NWUGymTracker() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState(null);
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [passwordBtnHover, setPasswordBtnHover] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      //setError(null);
      try {

        const rawStudent = localStorage.getItem("student");

        if (!rawStudent) {
          console.error("No student data found.");
          //navigate("/");
          return;
        }

        let storedStudent = null;

        try {
          storedStudent = JSON.parse(rawStudent);
        } catch (parseErr) {
          console.error("Failed to parse student data: ", parseErr);
        }
        console.log("Session student", storedStudent);
        
        if (!storedStudent) {
          console.error("No student data found. Please log in.");
          
          setLoading(false);
          return;
        }

        setStudent(storedStudent);
        
        const [profileData, statsData, sessionsData] = await Promise.allSettled([
          apiService.fetchStudentProfile(storedStudent.studentNumber),
          apiService.fetchWorkoutStats(storedStudent.studentNumber),
          apiService.fetchWorkoutSessions(storedStudent.studentNumber)
        ]);
        
        // Handle profile data
      if (profileData.status === 'fulfilled') {
        setStudent(profileData.value);
      } else {
        console.error('Failed to fetch profile:', profileResult.reason);
      }

        // Handle stats data
      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      } else {
        console.error('Failed to fetch stats:', statsData.reason);
      }

      // Handle sessions data
      if (sessionsData.status === 'fulfilled') {
        setWorkoutSessions(sessionsData.value);
      } else {
        console.error('Failed to fetch sessions:', sessionsData.reason);
      }

        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handlePasswordChange = async () => {
    alert('Password change functionality - integrate with your backend');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.appWrapper}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>Student Profile Page</h1>
          </div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Student Profile Page</h1>
        </div>

        <div style={styles.content}>
          {activeTab === 'profile' && student && stats && (
            <>
              <ProfileHeader student={student} />
              
              <div style={styles.statsGrid}>
                <StatsCard 
                  icon={Dumbbell}
                  label="Workouts"
                  value={stats.totalWorkouts}
                  color="#a855f7"
                />
                
                <StatsCard 
                  icon={Clock}
                  label="Total Weight"
                  value={stats.totalWeight}
                  color="#22c55e"
                />
                
              </div>

              <div>
                <h2 style={styles.sectionTitle}>Recent Workouts</h2>
                {workoutSessions.map(session => (
                  <WorkoutSession key={session.id} session={session} />
                ))}
              </div>

              <div style={styles.logoContainer}>
                <div style={styles.logo}>
                  <div style={styles.logoText}>N</div>
                </div>
                <h2 style={styles.logoSubtext}>NWU®</h2>
              </div>

              <button 
                onClick={handlePasswordChange}
                style={{
                  ...styles.passwordButton,
                  ...(passwordBtnHover ? styles.passwordButtonHover : {})
                }}
                onMouseEnter={() => setPasswordBtnHover(true)}
                onMouseLeave={() => setPasswordBtnHover(false)}
              >
                Change Password
              </button>
            </>
          )}
        </div>
          
        <div style={styles.bottomNav}>
          
          <button 
            onClick={() => setActiveTab('profile')}
            style={{
              ...styles.navButton,
              ...(activeTab === 'profile' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            <Home style={{ width: '24px', height: '24px', color: 'white' }} />
          </button>
          <button 
            onClick={() => navigate("/student-dashboard")}
            style={{
              ...styles.navButton,
              ...(activeTab === 'calendar' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            <HouseHeart style={{ width: '24px', height: '24px', color: 'white' }} />
          </button>
          <button 
            onClick={() => navigate("/student-dashboard")}
            style={{
              ...styles.navButton,
              ...(activeTab === 'workouts' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            <Dumbbell style={{ width: '24px', height: '24px', color: 'white' }} />
          </button>
          <button 
            onClick={() => navigate("/workout")}
            style={{
              ...styles.navButton,
              ...(activeTab === 'stats' ? styles.navButtonActive : styles.navButtonInactive)
            }}
          >
            <TrendingUp style={{ width: '24px', height: '24px', color: 'white' }} />
          </button>
        </div>
      </div>
    </div>
  );
}