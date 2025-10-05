// Start Workout Section Component


import { Search, Heart } from "lucide-react";

const StartWorkoutSection = () => (
  <div style={{ marginBottom: '24px' }}>
    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', margin: '0 0 12px 0' }}>
      Start Your Workout!
    </h2>
    
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
        <div style={{ fontSize: '40px', opacity: 0.7 }}>⭐</div>
      </div>
    </div>
  </div>
);


export default StartWorkoutSection;
