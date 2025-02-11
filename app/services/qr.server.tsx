import { v4 as uuidv4 } from "uuid";
import * as qr from "qr-image";
import { createCanvas, loadImage } from 'canvas';
import sharp from "sharp";

export async function generateQr(id: string, type: 'png' | 'svg') {
  // const formData = await request.formData();
  //     const selectedBrand = formData.get("brands") as string;
  //     const selectedMaterial = formData.get("materials") as string;
  //     const selectedColor = formData.get("colors") as string;
  // const filamentId = await getFilamentByAttributes(selectedBrand, selectedMaterial, selectedColor);
//   const searchParams = new URL(request.url).searchParams;

  const generatedQr = qr.imageSync(id, { type: 'png', size: 10 });

  const qrImage = await loadImage(generatedQr);

  const canvasWidth = 300;
  const canvasHeight = 350; 
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white"
  ctx.fillRect(0,0, 500, 350);

  const qrSize = 250;
  ctx.drawImage(qrImage, (canvasWidth - qrSize) /2, 25, qrSize, qrSize);
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(id.slice(id.length-10).toLocaleUpperCase(), canvasWidth /2, 320);

  const buffer = canvas.toBuffer("image/png");

  return buffer;
}