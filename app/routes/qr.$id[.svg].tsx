import { LoaderFunctionArgs } from "@remix-run/node";
import generateQr from "~/services/qr.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  // const formData = await request.formData();
  //     const selectedBrand = formData.get("brands") as string;
  //     const selectedMaterial = formData.get("materials") as string;
  //     const selectedColor = formData.get("colors") as string;
  // const filamentId = await getFilamentByAttributes(selectedBrand, selectedMaterial, selectedColor);
  const barcodeId = params.id;

  if (!barcodeId) throw new Error('barcode id is required.')

  // const addNewQR = await addQRtoRoll(qrString, filamentId.id);
  const contentType = "image/svg+xml";
  const contentFilename = `qr-code-${barcodeId}.svg`;
  const qr = await generateQr(barcodeId, 'svg')
  return new Response(qr, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${contentFilename}"`,
    },
  });
}
