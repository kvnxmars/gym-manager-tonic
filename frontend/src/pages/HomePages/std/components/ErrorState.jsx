// Error Component

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, QrCode, Heart, Settings, Home, Clock, Users } from "lucide-react";
import QRCode from "react-qr-code";
const ErrorState = ({ message }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <div style={{ textAlign: 'center', color: '#ff4444' }}>
      <p>{message}</p>
    </div>
  </div>
);
export default ErrorState;