import { v4 as uuidv4 } from "uuid";
import * as qr from "qr-image";

export default async function qrService(id: string, type: 'png' | 'svg') {
  // const formData = await request.formData();
  //     const selectedBrand = formData.get("brands") as string;
  //     const selectedMaterial = formData.get("materials") as string;
  //     const selectedColor = formData.get("colors") as string;
  // const filamentId = await getFilamentByAttributes(selectedBrand, selectedMaterial, selectedColor);
//   const searchParams = new URL(request.url).searchParams;


  const generatedQr = qr.imageSync(id, { type, size: 10 });

  return generatedQr
}