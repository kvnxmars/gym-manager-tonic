import { User } from 'lucide-react';

// Profile Header Component
const ProfileHeader = ({ student }) => {const profileStyles = {
    card: {
      background: 'linear-gradient(to bottom right, #9333ea, #6b21a8)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      marginBottom: '24px',
    },
    header: {
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
    info: {
      flex: 1,
    },
    name: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 4px 0',
    },
    detail: {
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
  };

  return (
    <div style={profileStyles.card}>
      <div style={profileStyles.header}>
        <div style={profileStyles.avatar}>
          <User style={{ width: '40px', height: '40px', color: '#6b21a8' }} />
        </div>
        <div style={profileStyles.info}>
          <h1 style={profileStyles.name}>{student.name}</h1>
          <p style={profileStyles.detail}>Student #{student.studentNumber}</p>
          <p style={profileStyles.detail}>{student.email}</p>
        </div>
      </div>
      <div style={profileStyles.checkInCard}>
        <span style={profileStyles.checkInLabel}>Total Check-ins</span>
        <span style={profileStyles.checkInValue}>{student.checkIns}</span>
      </div>
    </div>
  );
};
export default ProfileHeader;