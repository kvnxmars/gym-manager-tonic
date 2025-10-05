// Status Bar Component



const StatusBar = ({ studentNumber }) => (
  <div style={{
    background: '#000',
    color: '#fff',
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <span>Fit@NWU</span>
    {studentNumber && <span style={{ fontSize: '12px', color: '#888' }}>Student: {studentNumber}</span>}
  </div>
);
export default StatusBar;