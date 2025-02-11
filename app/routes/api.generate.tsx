import {
  addQRtoRoll,
  getFilamentByAttributes,
  updateFilamentStock,
} from "~/services/filament.server";
import { v4 as uuidv4 } from "uuid";
import * as qr from "qr-image";

export async function loader({ request, params }) {
  const formData = await request.formData();
  const weight = formData.get("weight") as unknown as number;
  const price = formData.get("price") as unknown as number;
  //     const selectedBrand = formData.get("brands") as string;
  //     const selectedMaterial = formData.get("materials") as string;
  //     const selectedColor = formData.get("colors") as string;
  // const filamentId = await getFilamentByAttributes(selectedBrand, selectedMaterial, selectedColor);
  const searchParams = new URL(request.url).searchParams;

  console.log('weight', weight)
  console.log('price', price)

  const filamentId = Number(searchParams.get("itemId"));
  const typeParam = searchParams.get("type");
  const newId = uuidv4();



  await updateFilamentStock(filamentId, newId, weight, price);

  let type: "svg" | "png" = "svg";

  if (typeParam === "png") type = "png";

  const qrString = qr.imageSync(newId, { type, size: 10 });
  // const addNewQR = await addQRtoRoll(qrString, filamentId.id);
  let contentType = "image/svg+xml";
  let contentFilename = `qr-code-${newId}.svg`;
  if (type === "png") {
    contentType = "image/png";
    contentFilename = `qr-code-${newId}.png`;
  }

  return new Response(qrString, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${contentFilename}"`,
    },
  });
}

