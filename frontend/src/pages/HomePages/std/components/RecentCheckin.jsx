// Recent Checkins Component
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, QrCode, Heart, Settings, Home, Clock, Users } from "lucide-react";
import QRCode from "react-qr-code";
const RecentCheckins = ({ checkins }) => {
  if (checkins.length === 0) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', margin: '0 0 12px 0' }}>
        Recent Check-ins
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {checkins.map((checkin) => (
          <div key={checkin._id} style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Clock size={16} color="#999" />
            <span style={{ fontSize: '14px', color: '#666', flex: 1 }}>
              {new Date(checkin.checkInTime).toLocaleDateString()} at{" "}
              {new Date(checkin.checkInTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {checkin.isActive && (
              <span style={{
                fontSize: '12px',
                color: '#34C759',
                background: '#E8F5E8',
                padding: '4px 8px',
                borderRadius: '12px',
                fontWeight: '500'
              }}>
                Active
              </span>
            )}
            {checkin.checkOutTime && (
              <span style={{ fontSize: '12px', color: '#999' }}>
                {Math.round((new Date(checkin.checkOutTime) - new Date(checkin.checkInTime)) / (1000 * 60))} min
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default RecentCheckins;
