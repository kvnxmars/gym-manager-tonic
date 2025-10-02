// Classes Section Component

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, QrCode, Heart, Settings, Home, Clock, Users } from "lucide-react";
import QRCode from "react-qr-code";
const ClassesSection = ({ classes }) => (
  <div style={{ marginBottom: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#333', margin: '0' }}>Classes</h2>
    </div>
    
    {classes.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {classes.slice(0, 2).map((classItem, index) => (
          <div key={index} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#ff9500',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              {classItem.name === 'Yoga' ? '🧘‍♀️' : 
               classItem.name === 'Zumba' ? '💃' : 
               classItem.name === 'CrossFit' ? '🏋️‍♂️' : '💪'}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                {classItem.name}
              </h4>
              <p style={{ fontSize: '14px', color: '#888', margin: '0 0 2px 0' }}>
                {classItem.time} • {classItem.instructor}
              </p>
              <p style={{ fontSize: '12px', color: '#999', margin: '0' }}>
                {classItem.enrolled}/{classItem.capacity} enrolled
              </p>
            </div>
            <Heart size={20} color="#ddd" />
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>
        No classes available
      </p>
    )}
  </div>
);
export default ClassesSection;