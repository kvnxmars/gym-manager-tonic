// Loading Component

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, QrCode, Heart, Settings, Home, Clock, Users } from "lucide-react";
import QRCode from "react-qr-code";
const LoadingState = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <div style={{ textAlign: 'center', color: '#888' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '3px solid #f0f0f0', 
        borderTop: '3px solid #007AFF', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }}></div>
      <p>Loading your dashboard...</p>
    </div>
  </div>
);
export default LoadingState;