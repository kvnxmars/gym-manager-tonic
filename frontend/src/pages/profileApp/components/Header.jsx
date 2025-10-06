import { User } from 'lucide-react';

// Profile Header Component
const ProfileHeader = ({ student }) => {const profileStyles = {
    card: {
      background: 'linear-gradient(to bottom right, #c7a9e3ff, #a78dbcff)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 10px 15px -3px rgba(95, 34, 34, 0.1)',
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
      backgroundColor: '#c3a5e1ff',
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

   if (!student) {
    return <div style={profileStyles.profileCard}>Loading profile...</div>;
  }
  
  return (
    <div style={profileStyles.profileCard}>
      <div style={profileStyles.profileHeader}>
        <div style={profileStyles.avatar}>
          <User style={{ width: '40px', height: '40px', color: '#6b21a8' }} />
        </div>
        <div style={profileStyles.profileInfo}>
          <h1 style={profileStyles.profileName}>{student.firstName }</h1>
          <p style={profileStyles.profileDetail}>Student #{student.studentNumber}</p>
          <p style={profileStyles.profileDetail}>{student.email}</p>
        </div>
      </div>
      
  
    </div>
  );
};
export default ProfileHeader;