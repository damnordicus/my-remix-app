import { CameraIcon } from "@heroicons/react/24/outline";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useLayoutEffect, useState } from "react";
import BarcodeScanner from "~/components/BarcodeScanner";
import CheckboxGroup from "~/components/CheckboxGroup";
import { getAllBrands, getAllColors, getAllMaterials, getFilamentByBarcode, pullFromStockByBarcode, returnFilamentToStock } from "~/services/filament.server";

export const loader: LoaderFunction = async ({ request }) => {

  const brands = await getAllBrands();
  const colors = await getAllColors();
  const materials = await getAllMaterials();

   return ({ materials, colors, brands });
};

// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();
//   const actionType = formData.get("_action");

//   console.log('actionType: ', actionType)

//   if(actionType === 'submit'){
//     const barcodeObject = formData.get("barcode") as string;
//     const weight = formData.get("weight") as unknown as number;
//     const decoded = atob(barcodeObject);
//     const parsed = JSON.parse(decoded);
//     return await returnFilamentToStock(parsed);
//   }
//   else {
//     return null;
//   }
// };

export default function  ReturnToStock() {
  const { materials, colors, brands } = useLoaderData<typeof loader>();
  const [ selectedBrand, setSelectedBrand ] = useState('');
  const [ selectedMaterial, setSelectedMaterial ] = useState('');
  const [ selectedColor, setSelectedColor ] = useState('');

  const [generatedBarcode, setGeneratedBarcode] = useState('');

  useEffect(() => {
    const barcodeObject: Record<string, string> = {};
    if(selectedBrand !== '') barcodeObject.brand = selectedBrand;
    if(selectedColor !== '') barcodeObject.color = selectedColor;
    if(selectedMaterial !== '') barcodeObject.material = selectedMaterial;

    if(selectedBrand === '' && selectedColor === '' && selectedMaterial === ''){
        setGeneratedBarcode('');
    } else {
        const randomId = Math.random() * 10;
        barcodeObject.randomId = `${randomId}`;
        const encodedBarcode = btoa(JSON.stringify(barcodeObject));
        setGeneratedBarcode(encodedBarcode);
    }

  },[selectedBrand, selectedColor, selectedMaterial])


  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-2/6 flex justify-center bg-slate-600 border-2 bg-opacity-80 border-slate-500 rounded-xl p-4">
          <div className="flex flex-col items-center gap-4 w-full" >
            <p className="text-amber-500 text-xl ">
              Generate New Barcode
            </p>
            <div className="flex justify-around w-full">
            <CheckboxGroup items={brands} label="Brands" setSelected={setSelectedBrand}/>
            <CheckboxGroup items={materials} label="Materials" setSelected={setSelectedMaterial}/>
            <CheckboxGroup items={colors} label="Colors" setSelected={setSelectedColor}/>
            </div>
            <div className="w-full text-center">
            <label>Barcode: </label>
            <input
                type="text"
                name="test"
                value={generatedBarcode}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
