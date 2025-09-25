import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScan }) => {
  useEffect(() => {
    const qrRegionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);

    Html5Qrcode.getCameras()
      .then(cameras => {
        if (cameras && cameras.length) {
          const cameraId = cameras[0].id;
          html5QrCode.start(
            cameraId,
            { fps: 10, qrbox: 250 },
            (decodedText) => {
              onScan(decodedText);
              // optionally stop after first scan:
              html5QrCode.stop().catch(()=>{});
            },
            (errorMessage) => {
              // console.log("scan error", errorMessage);
            }
          ).catch(err => console.error("start failed", err));
        } else {
          console.error("No camera found");
        }
      })
      .catch(err => console.error("getCameras failed", err));

    return () => {
      html5QrCode.stop().catch(()=>{});
    };
  }, [onScan]);

  return <div id="qr-reader" style={{ width: "320px", height: "240px" }} />;
};

export default QRScanner;
