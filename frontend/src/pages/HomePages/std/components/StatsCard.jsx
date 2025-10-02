// Stats Cards Component


const StatsCards = ({ workoutStats }) => {
  if (!workoutStats) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', margin: '0 0 12px 0' }}>
        Your Stats
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          border: '1px solid #eee'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#007AFF' }}>
            {workoutStats.totalWorkouts}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>Total Workouts</div>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          border: '1px solid #eee'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#34C759' }}>
            {workoutStats.weeklyWorkouts}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>This Week</div>
        </div>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          border: '1px solid #eee'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#AF52DE' }}>
            {workoutStats.totalTemplates}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>Templates</div>
        </div>
      </div>
    </div>
  );
};
export default StatsCards;