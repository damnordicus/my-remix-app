import {
  addQRtoRoll,
  getFilamentByAttributes,
} from "~/services/filament.server";
import { v4 as uuidv4 } from "uuid";
import * as qr from "qr-image";

export async function loader({ request, params }) {
  // const formData = await request.formData();
  //     const selectedBrand = formData.get("brands") as string;
  //     const selectedMaterial = formData.get("materials") as string;
  //     const selectedColor = formData.get("colors") as string;
  // const filamentId = await getFilamentByAttributes(selectedBrand, selectedMaterial, selectedColor);
  const searchParams = new URL(request.url).searchParams;

  const filamentId = searchParams.get("filamentId");
  const typeParam = searchParams.get("type");
  const newId = uuidv4();

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
