import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

const QRCanvas = ({ value }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, { width: 128 }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [value]);

  return <canvas ref={canvasRef} />;
};

export default QRCanvas;
