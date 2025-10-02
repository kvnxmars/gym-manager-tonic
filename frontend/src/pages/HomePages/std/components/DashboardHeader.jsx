// Header Component

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, QrCode, Heart, Settings, Home, Clock, Users } from "lucide-react";
import QRCode from "react-qr-code";
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
        Welcome, {student?.name?.first}
      </h1>
      <p style={{ fontSize: '14px', color: '#888', margin: '0' }}>
        {student?.name?.last}
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
        {student?.name?.first?.charAt(0)}{student?.name?.last?.charAt(0)}
      </div>
    </div>
  </div>
);
export default DashboardHeader;
