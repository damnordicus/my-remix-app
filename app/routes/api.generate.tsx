import {
  addQRtoRoll,
  addRollToFilament,
  createNewRoll,
  getFilamentByAttributes,
  updateFilamentStock,
} from "~/services/filament.server";
import { v4 as uuidv4 } from "uuid";
import * as qr from "qr-image";
import { ActionFunctionArgs, json, redirect } from "react-router";
import { generateQr, printQRCode } from "~/services/qr.server";
import { userSession } from "~/services/cookies.server";

// export async function loader({ request, params }) {
//   const formData = await request.formData();
//   const weight = formData.get("weight") as unknown as number;
//   const price = formData.get("price") as unknown as number;
//   //     const selectedBrand = formData.get("brands") as string;
//   //     const selectedMaterial = formData.get("materials") as string;
//   //     const selectedColor = formData.get("colors") as string;
//   // const filamentId = await getFilamentByAttributes(selectedBrand, selectedMaterial, selectedColor);
//   const searchParams = new URL(request.url).searchParams;

//   console.log('weight', weight)
//   console.log('price', price)

//   const filamentId = Number(searchParams.get("itemId"));
//   const typeParam = searchParams.get("type");
//   const newId = uuidv4();



//   await updateFilamentStock(filamentId, newId, weight, price);

//   let type: "svg" | "png" = "svg";

//   if (typeParam === "png") type = "png";

//   const qrString = qr.imageSync(newId, { type, size: 10 });
//   // const addNewQR = await addQRtoRoll(qrString, filamentId.id);
//   let contentType = "image/svg+xml";
//   let contentFilename = `qr-code-${newId}.svg`;
//   if (type === "png") {
//     contentType = "image/png";
//     contentFilename = `qr-code-${newId}.png`;
//   }

//   return new Response(qrString, {
//     status: 200,
//     headers: {
//       "Content-Type": contentType,
//       "Content-Disposition": `attachment; filename="${contentFilename}"`,
//     },
//   });
// }

export async function loader({request}) {
  const session = await userSession.parse(request.headers.get("Cookie"));
      if(!session.username) return redirect("..");
  const search = new URL(request.url).searchParams
  const newId = search.get('id')
  if (!newId) throw new Error('id is required.')
    const downloadType = search.get('type')

  const contentType = "image/png";
  const contentFilename = `qr-code-${newId}.png`;
  const newQr = await generateQr(newId, "png");
    if (downloadType === "fetcher") {
      return ({
        fileData: newQr.toString('base64'),
        fileName: contentFilename,
        fileType: contentType,
      });
    }
  await printQRCode(newQr);
  return new Response(newQr, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${contentFilename}"`,
    },
  });
}

export const action = async ({ request }: ActionFunctionArgs) => {

  // const session = await userSession.parse(request.headers.get("Cookie"));
  // if(!session.username) return redirect("..");
// const search = new URL(request.url).searchParams
// const newId = search.get('barcode')
const form = await request.formData();
const newId = form.get('barcode') || form.get('newId');
if (!newId) throw new Error('id is required.')
// const downloadType = search.get('type')

const contentType = "image/png";
const contentFilename = `qr-code-${newId}.png`;
const newQr = await generateQr(newId.toString(), "png");
// if (downloadType === "fetcher") {
//   return ({
//     fileData: newQr.toString('base64'),
//     fileName: contentFilename,
//     fileType: contentType,
//   });
// }
await printQRCode(newQr);
return new Response(newQr, {
status: 200,
headers: {
  "Content-Type": contentType,
  "Content-Disposition": `attachment; filename="${contentFilename}"`,
},
});
        // const search = new URL(request.url).searchParams
        // const newId = search.get('id')
        // if (!newId) throw new Error('id is required.')
        // const contentType = "image/png";
        // const contentFilename = `qr-code-${newId}.png`;
        // const newQr = await generateQr(newId, "png");
        // return new Response(newQr, {
        //   status: 200,
        //   headers: {
        //     "Content-Type": contentType,
        //     "Content-Disposition": `attachment; filename="${contentFilename}"`,
        //   },
        // });
};