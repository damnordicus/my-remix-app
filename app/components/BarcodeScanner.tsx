import { useEffect, useRef, useState } from "react";

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    const detectBarcode = async () => {
      if (!videoRef.current) return;

      const barcodeDetector = new BarcodeDetector({ formats: ["code_128", "ean_13", "qr_code"] });

      try {
        const barcodes = await barcodeDetector.detect(videoRef.current);
        if (barcodes.length > 0) {
          setBarcode(barcodes[0].rawValue);
        }
      } catch (error) {
        console.error("Barcode detection error:", error);
      }
    };

    const interval = setInterval(detectBarcode, 500); // Detect barcode every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="100%" height="100%" />
      {barcode && <p>Detected Barcode: {barcode}</p>}
    </div>
  );
};

export default BarcodeScanner;
