import { useEffect, useRef, useState } from "react";
import Quagga from "quagga";

export default function BarcodeScanner({ onScan }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;
    let isQuaggaInitialized = false; // Track if Quagga is initialized

    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            width: 640,
            height: 480,
            facingMode: "environment", // Use back camera if available
          },
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    startCamera(); // Start the camera

    if(!videoRef.current){
      return;
    }

    // Initialize Quagga after ensuring video is playing
    const quaggaInitTimeout = setTimeout(() => {
      if (videoRef.current) {
        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: videoRef.current, // Attach video element
            },
            decoder: {
              readers: ["code_128_reader", "ean_reader", "upc_reader", "qr_reader"], // Adjust formats
            },
            locate: true,
            debug: true,
          },
          function (err) {
            if (err) {
              console.error("Quagga init failed:", err);
              setError(err.message);
              return;
            }
            Quagga.start();
            isQuaggaInitialized = true; // Mark Quagga as initialized
          }
        );
        

        Quagga.onDetected((result) => {
          console.log("detected: ", result.codeResult?.code)
          if (result?.codeResult?.code) {
            console.log("Barcode detected:", result.codeResult.code);
            onScan(result.codeResult.code);
            if (isQuaggaInitialized) {
              Quagga.stop();
              isQuaggaInitialized = false; // Reset flag
            }
          }
        });
      }
    }, 500); // Delay to ensure video is ready

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // Stop camera stream
      }
      clearTimeout(quaggaInitTimeout);

      // Ensure Quagga is stopped only if it was initialized
      if (isQuaggaInitialized) {
        Quagga.stop();
      }
    };
  }, [onScan]);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-full max-w-md border rounded-md" autoPlay playsInline></video>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
