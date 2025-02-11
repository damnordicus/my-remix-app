import { QrCodeIcon } from "@heroicons/react/24/outline";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CheckboxGroup from "~/components/CheckboxGroup";
import { v4 as uuidv4 } from "uuid";
import * as qr from 'qr-image';
import { addQRtoRoll, getAllBrands, getAllColors, getAllMaterials, getFilamentByAttributes, returnFilamentToStock } from "~/services/filament.server";

export const loader: LoaderFunction = async ({ request }) => {

  const brands = await getAllBrands();
  const colors = await getAllColors();
  const materials = await getAllMaterials();

   return ({ materials, colors, brands });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  console.log('actionType: ', actionType)
  console.log('formData', formData)

  if(actionType === 'qr'){
    const selectedBrand = formData.get("brands") as string;
    const selectedMaterial = formData.get("materials") as string;
    const selectedColor = formData.get("colors") as string;
    const filamentId = await getFilamentByAttributes(selectedBrand, selectedMaterial, selectedColor);
    const newId = uuidv4()
    const qrString = qr.imageSync(newId, {type: 'svg'}).toString();

    const addNewQR = await addQRtoRoll(qrString, filamentId.id);

    return qrString;
  }

  if(actionType === 'submit'){
    const barcodeObject = formData.get("barcode") as string;
    const weight = formData.get("weight") as unknown as number;
    const decoded = atob(barcodeObject);
    const parsed = JSON.parse(decoded);
    return await returnFilamentToStock(parsed);
  }
  else {
    return null;
  }
};

export default function  GenerateBarcode() {
  const { materials, colors, brands } = useLoaderData<typeof loader>();

  const [ showQR, setShowQR ] = useState(false);
  const qrImageRef = useRef(null);
  const fetcher = useFetcher();

  useEffect(() => {
    if(fetcher.state === 'idle' && fetcher.data){
      setShowQR(true)
      console.log(fetcher.data)

      // setGeneratedBarcode(fetcher.data as string);
    } 
  },[fetcher.state, fetcher.data, qrImageRef])

  useLayoutEffect(() => {
    if (showQR && qrImageRef.current) {
      const qrContainer = document.getElementById('qrImage')
      if (qrContainer) {
        if (qrContainer.hasChildNodes()) {
          const svgElements = qrContainer.getElementsByTagName('svg');
          Array.from(svgElements).forEach(el => qrContainer.removeChild(el));
        }
    
        // Create a temporary DOM to parse the input
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fetcher.data as string;
    
        const svgElement = tempDiv.querySelector('svg');
        if (svgElement) {
          const sanitizedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
          // Copy attributes manually to ensure no malicious ones exist
          Array.from(svgElement.attributes).forEach(attr => {
            sanitizedSvg.setAttribute(attr.name, attr.value);
          });
    
          // Append sanitized child nodes
          Array.from(svgElement.childNodes).forEach(child => {
            sanitizedSvg.appendChild(child.cloneNode(true));
          });
    
          qrContainer.appendChild(sanitizedSvg);
        } else {
          console.error('Invalid QR code SVG data received.');
        }
      }
      // (qrImageRef.current as HTMLImageElement).insertAdjacentHTML("afterbegin", fetcher.data as string);
    }
  }, [qrImageRef, fetcher.data, showQR]);

  // useEffect(() => {
  //   const barcodeObject: Record<string, string> = {};
  //   if(selectedBrand !== '') barcodeObject.brand = selectedBrand;
  //   if(selectedColor !== '') barcodeObject.color = selectedColor;
  //   if(selectedMaterial !== '') barcodeObject.material = selectedMaterial;

  //   if(selectedBrand === '' && selectedColor === '' && selectedMaterial === ''){
  //       setGeneratedBarcode('');
  //   } else {
  //       const randomId = uuidv4();
  //       barcodeObject.randomId = `${randomId}`;
  //       const encodedBarcode = btoa(JSON.stringify(barcodeObject));
  //       setGeneratedBarcode(encodedBarcode);
  //   }

  // },[selectedBrand, selectedColor, selectedMaterial])

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-2/6 flex justify-center bg-slate-600 border-2 bg-opacity-80 border-slate-500 rounded-xl ">
          <fetcher.Form method="POST" className="flex flex-col items-center gap-2 w-full mt-2 mb-4" >
            <h1 className="text-amber-500 text-2xl font-bold text-center">
              Generate New Barcode
            </h1>
            <hr className=" w-full h-px border-0 bg-slate-400" />
            <div className="flex justify-around w-full">
            <CheckboxGroup items={brands} label="Brands"/>
            <CheckboxGroup items={materials} label="Materials"/>
            <CheckboxGroup items={colors} label="Colors"/>
            </div>
            <div className="w-full text-center">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500 bg-amber-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-amber-700 hover:bg-amber-700 focus:ring focus:ring-amber-200 disabled:cursor-not-allowed disabled:border-amber-300 disabled:bg-amber-300" type="submit" name="_action" value="qr" ><QrCodeIcon className="size-8 "/>Generate</button>
            {/* <label>Barcode: </label> */}
            {/* <input
                type="text"
                name="test"
                value={generatedBarcode}/>*/}
            </div> 
          </fetcher.Form>
        </div>
      </div>
      {showQR && (
         <div ref={qrImageRef} id="qrImage" className="absolute inset-0 m-auto flex justify-center items-center w-[500px] h-[600px] bg-slate-400 rounded-xl " onClick={() => {setShowQR(false);}}>
          
         </div>
      )}
    </>
  );
}
