// Bottom Navigation Component


import { Settings, Home, Users } from "lucide-react";



const BottomNav = ({ navigate }) => (
  <div style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    borderTop: '1px solid #eee',
    padding: '8px 0',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 10
  }}>
    <button style={{
      background: 'none',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '8px 12px',
      cursor: 'pointer',
      color: '#007AFF',
      fontSize: '12px'
    }}>
      <Home size={20} />
      <span>Home</span>
    </button>
    <button 
      onClick={() => navigate("/workout")}
      style={{
        background: 'none',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        color: '#999',
        fontSize: '12px'
      }}
    >
      <span style={{ fontSize: '20px' }}>💪</span>
      <span>Workouts</span>
    </button>
    <button 
      onClick={() => navigate("/class-bookings")}
      style={{
        background: 'none',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '8px 12px',
        cursor: 'pointer',
        color: '#999',
        fontSize: '12px'
      }}
    >
      <Users size={20} />
      <span>Classes</span>
    </button>
    <button style={{
      background: 'none',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '8px 12px',
      cursor: 'pointer',
      color: '#999',
      fontSize: '12px'
    }}>
      <span style={{ fontSize: '20px' }}>👤</span>
      <span>Profile</span>
    </button>
    <button style={{
      background: 'none',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '8px 12px',
      cursor: 'pointer',
      color: '#999',
      fontSize: '12px'
    }}>
      <Settings size={20} />
      <span>Settings</span>
    </button>
  </div>
);
export default BottomNav;
