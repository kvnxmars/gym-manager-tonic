// Workouts Grid Component


const WorkoutsGrid = () => {
  const workouts = [
    { name: "Body Building", color: "#007AFF", emoji: "💪" },
    { name: "Cardio", color: "#FF9500", emoji: "❤️" },
    { name: "Pilates", color: "#AF52DE", emoji: "🤸‍♀️" }
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', margin: '0' }}>Workouts</h2>
        <button style={{ background: 'none', border: 'none', color: '#007AFF', fontSize: '14px', cursor: 'pointer' }}>
          See all
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        {workouts.map((workout, index) => (
          <div key={index} style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{workout.emoji}</div>
            <p st6yle={{ fontSize: '12px', fontWeight: '500', margin: '0', color: '#333' }}>
              {workout.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default WorkoutsGrid;