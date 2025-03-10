import * as qr from "qr-image";
import ipp from 'ipp';
import { createCanvas, loadImage } from 'canvas';

export async function generateQr(id: string, type: 'png' | 'svg') {
  const generatedQr = qr.imageSync(id, { type: 'png', size: 14, margin: 5, ec_level: 'M' });

  const qrImage = await loadImage(generatedQr);

  const qrWidth = qrImage.width;
  const qrHeight = qrImage.height;

  const canvasWidth = qrWidth;
  const canvasHeight = id.slice(0,7) === 'otpauth' ? qrHeight : qrHeight + 50; 
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white"

  console.log('slice', id.slice(0,6))
    ctx.fillRect(0,0, canvasWidth, canvasHeight);
    // const qrSize = 340;
    ctx.drawImage(qrImage, (canvasWidth - qrWidth) / 2, 0, qrWidth, qrHeight );
  if(!id.startsWith('otpauth')){
    // Extract the last 12 characters to match Python version
    const last12Chars = id.slice(-12).toLocaleUpperCase();
    
    // Configure text styling - bold and centered like in Python
    ctx.font = "30px sans-serif"; // Approximately matching DejaVuSans-Bold in Python
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    
    // Position text centered horizontally, 5px below QR image
    ctx.fillText(last12Chars, canvasWidth / 2, qrHeight + 30);
  }
 const buffer = canvas.toBuffer("image/png");


  return buffer;
}

export async function printQRCode(qrCodeBuffer: Buffer , printerName = 'DYMO_LabelWriter_330') {
  // Configure your Raspberry Pi's IP and printer name
  const printer = new ipp.Printer(`http://10.0.30.153:631/printers/${printerName}`);
  
  const msg: ipp.PrintJobRequest = {
    "operation-attributes-tag": {
      "requesting-user-name": "RemixApp",
      "job-name": "QR Code Print",
      "document-format": "image/png"
    },
    data: qrCodeBuffer
  };
  
  return new Promise<Error | ipp.PrintJobResponse>((resolve, reject) => {
    printer.execute("Print-Job", msg, function(err, res) {
      if (err) {
        console.error('Printing error:', err);
        reject(err);
      } else {
        console.log('Print job submitted successfully:', res);
        resolve(res);
      }
    });
  });
}
