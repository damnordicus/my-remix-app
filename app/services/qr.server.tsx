import * as qr from "qr-image";
import { createCanvas, loadImage } from 'canvas';

export async function generateQr(id: string, type: 'png' | 'svg') {
  const generatedQr = qr.imageSync(id, { type: 'png', size: 10 });

  const qrImage = await loadImage(generatedQr);

  const canvasWidth = 300;
  const canvasHeight = id.slice(0,7) === 'otpauth' ? 300 : 350; 
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white"

  console.log('slice', id.slice(0,6))
  if(id.slice(0,7) === 'otpauth'){
    ctx.fillRect(0,0, 300, 300);
    const qrSize = 340;
    ctx.drawImage(qrImage, (canvasWidth - qrSize) /2, (canvasHeight - qrSize ) /2, qrSize, qrSize );

  }else{
     ctx.fillRect(0,0, 500, 350);

    const qrSize = 250;
    ctx.drawImage(qrImage, (canvasWidth - qrSize) /2, 25, qrSize, qrSize);
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(id.slice(id.length-10).toLocaleUpperCase(), canvasWidth /2, 320);
  }
 const buffer = canvas.toBuffer("image/png");

  return buffer;
}