

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => {
  const statsStyles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    inner: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    icon: {
      padding: '12px',
      borderRadius: '8px',
    },
    label: {
      color: '#6b7280',
      fontSize: '14px',
      margin: '0 0 4px 0',
    },
    value: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0,
    },
  };

  return (
    <div style={statsStyles.card}>
      <div style={statsStyles.inner}>
        <div style={{ ...statsStyles.icon, backgroundColor: color }}>
          <Icon style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <p style={statsStyles.label}>{label}</p>
          <p style={statsStyles.value}>{value}</p>
        </div>
      </div>
    </div>
  );
};
export default StatsCard;