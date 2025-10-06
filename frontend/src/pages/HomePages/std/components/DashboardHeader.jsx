// Header Component

import { QrCode } from "lucide-react";

const DashboardHeader = ({ student, showQR, setShowQR }) => (
  <div style={{ 
    padding: '20px 20px 16px', 
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#333', margin: '0 0 4px 0' }}>
        Welcome, {student?.firstName}
      </h1>
      <p style={{ fontSize: '14px', color: '#888', margin: '0' }}>
        {student?.lastName}
      </p>
    </div>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <button
        onClick={() => setShowQR(!showQR)}
        style={{
          background: '#f5f5f5',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <QrCode size={20} color="#666" />
      </button>
      <div style={{
        background: '#007AFF',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        {student?.firstName?.charAt(0)}{student?.lastName?.charAt(0)}
      </div>
    </div>
  </div>
);
export default DashboardHeader;
