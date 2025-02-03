import { useEffect, useRef, useState } from "react";

export default function BarcodeScanner({ onScan }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadScanner() {
      if (typeof window !== "undefined") {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const codeReader = new BrowserMultiFormatReader();

        codeReader
          .decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
            if (result) {
              onScan(result.getText()); // Send barcode to parent
            }
            if (err) {
              setError(err.message);
            }
          });

        return () => codeReader.reset();
      }
    }

    loadScanner();
  }, [onScan]);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-full max-w-md border rounded-md"></video>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
