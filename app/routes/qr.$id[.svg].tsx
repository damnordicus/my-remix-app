import { LoaderFunctionArgs } from "react-router";
import {generateQr} from "~/services/qr.server";
// import { default as generateQr } from "~/services/........."

export async function loader({ request, params }: LoaderFunctionArgs) {
  // const formData = await request.formData();
  //     const selectedBrand = formData.get("brands") as string;
  //     const selectedMaterial = formData.get("materials") as string;
  //     const selectedColor = formData.get("colors") as string;
  // const filamentId = await getFilamentByAttributes(selectedBrand, selectedMaterial, selectedColor);
  const barcodeId = params.id;

  if (!barcodeId) throw new Error('barcode id is required.')

  // const addNewQR = await addQRtoRoll(qrString, filamentId.id);
  const contentType = "image/png";
  const contentFilename = `qr-code-${barcodeId}.png`;
  const qr = await generateQr(barcodeId, 'png')
  return new Response(qr, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${contentFilename}"`,
    },
  });
}
