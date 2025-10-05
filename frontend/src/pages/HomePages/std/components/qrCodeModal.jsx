// QR Code Modal Component

//import React, { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { QrCode} from "lucide-react";
import QRCode from "react-qr-code";
const QRCodeModal = ({ show, onClose, student, qrData }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '320px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}>Your QR Code</h3>
        <div style={{ 
          width: '200px', 
          height: '200px', 
          margin: '0 auto 16px', 
          padding: '16px',
          border: '1px solid #eee',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {qrData ? (
            <QRCode 
              value={qrData}
              size={168}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          ) : (
            <QrCode size={100} color="#ccc" />
          )}
        </div>
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0' }}>
          <strong>Student:</strong> {student?.name?.first} {student?.name?.last}
        </p>
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px 0' }}>
          <strong>Number:</strong> {student?.studentNumber}
        </p>
        <p style={{ fontSize: '12px', color: '#999', margin: '0 0 20px 0' }}>
          Show this code at the gym entrance
        </p>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: '#007AFF',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default QRCodeModal;