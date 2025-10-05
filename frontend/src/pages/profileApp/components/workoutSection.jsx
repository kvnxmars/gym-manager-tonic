

import { Calendar } from 'lucide-react';

// Workout Session Component
const WorkoutSession = ({ session }) => {
  const [isHovered, setIsHovered] = useState(false);

  const workoutStyles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      marginBottom: '12px',
      transition: 'box-shadow 0.3s ease',
      cursor: 'pointer',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    title: {
      fontWeight: 'bold',
      color: '#1f2937',
      fontSize: '18px',
      margin: '0 0 4px 0',
    },
    date: {
      color: '#6b7280',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      margin: 0,
    },
    badge: {
      backgroundColor: '#f3e8ff',
      color: '#6b21a8',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: '600',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
    },
    stat: {
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      padding: '8px',
      textAlign: 'center',
    },
    statLabel: {
      fontSize: '12px',
      color: '#6b7280',
      margin: '0 0 2px 0',
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0,
    },
  };

  return (
    <div 
      style={workoutStyles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={workoutStyles.header}>
        <div>
          <h3 style={workoutStyles.title}>{session.type}</h3>
          <p style={workoutStyles.date}>
            <Calendar style={{ width: '16px', height: '16px' }} />
            {session.date}
          </p>
        </div>
        <div style={workoutStyles.badge}>
          {session.duration} min
        </div>
      </div>
      <div style={workoutStyles.statsGrid}>
        <div style={workoutStyles.stat}>
          <p style={workoutStyles.statLabel}>Exercises</p>
          <p style={workoutStyles.statValue}>{session.exercises}</p>
        </div>
        <div style={workoutStyles.stat}>
          <p style={workoutStyles.statLabel}>Sets</p>
          <p style={workoutStyles.statValue}>{session.sets}</p>
        </div>
        <div style={workoutStyles.stat}>
          <p style={workoutStyles.statLabel}>Calories</p>
          <p style={workoutStyles.statValue}>{session.calories}</p>
        </div>
      </div>
    </div>
  );
};
export default WorkoutSession;