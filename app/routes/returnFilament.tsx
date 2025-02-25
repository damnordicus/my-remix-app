import { CameraIcon } from "@heroicons/react/24/outline";
import { ActionFunction, Link, LoaderFunction, redirect } from "react-router";
import { json, useFetcher, useLoaderData, useNavigate } from "react-router";
import { CameraEnhancer } from "dynamsoft-camera-enhancer";
import { BarcodeReader } from "dynamsoft-javascript-barcode";
import { useEffect, useState } from "react";
import BarcodeScanner from "~/components/BarcodeScanner";
import { getAllMaterials, getFilamentByBarcode, pullFromStockByBarcode, returnFilamentToStock } from "~/services/filament.server";
import Barcode from "~/routes/barcode";

export const loader: LoaderFunction = async ({ request }) => {
//   const url = new URL(request.url);
//   const barcode = url.searchParams.get("barcode");

//   if (!barcode) {
//     return json({ error: "No barcode provided" }, { status: 400 });
//   }

  const materials = await getAllMaterials();

   return ({ materials });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  console.log('actionType: ', actionType)

  if(actionType === 'submit'){
    const barcodeObject = formData.get("barcode") as string;
    const weight = formData.get("weight") as string;
    // const decoded = atob(barcodeObject);
    // const parsed = JSON.parse(decoded);
    const result = await returnFilamentToStock(barcodeObject, +weight);
    if(result.success)
      return redirect("../?success=return")
    return redirect("../?fail=return")
  }
  else {
    return null;
  }
};

export default function  ReturnToStock() {
   const { materials } = useLoaderData<typeof loader>();
   console.log(materials)
//   console.log(filament)
  const navigate = useNavigate();
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const fetcher = useFetcher();
  let filament = fetcher.data?.filament;
  console.log(filament)

  const handleBarcode = async (e) => {
    const barcode = e.target.value;
    setScannedBarcode(barcode);

    if (barcode.length >= 5) {
      fetcher.load(`/pullFilament?barcode=${barcode}`)
    }else{
        filament = null;
    }
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    fetcher.submit(e.target);

  };

  const handleCamera = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const grabbedBarcode = localStorage.getItem("scannedBarcode");
    console.log('session: ', grabbedBarcode)
    if(grabbedBarcode){
      setScannedBarcode(grabbedBarcode);
    }
  }, [])

  // const test = {brand:"ESUN", color:"GOLD", material:"PLA"}
  // const stringify = JSON.stringify(test);
  // const encoded = btoa(stringify);
  // console.log(encoded);

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-2/6 flex justify-center bg-slate-600/50 backdrop-blur-sm border-2 border-slate-500 rounded-xl p-4">
          <fetcher.Form className="flex flex-col items-center gap-4 w-full" method="post" onSubmit={handleSubmit}>
            <input type="hidden" name="_action" value="submit"/>
            <p className="text-amber-500 text-xl mb-4">
              Return Roll to Inventory
            </p>
            <input type="hidden" name="id" value={filament?.id}/>
            <div className="flex items-center w-full">
            <input
              className="w-full p-2 border border-gray-300 rounded-lg"
              type="text"
              placeholder="Barcode"
              name="barcode"
              defaultValue={scannedBarcode}
              required
            />
            <Link to="../barcode"><CameraIcon className="size-7 ml-4 text-amber-500"/></Link>
           
            </div>
            
            
            <input
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Estimated weight (g)"
              name="weight"
              value={filament?.weight_grams ? `${filament.weight_grams} g` : null}
              required
            />
            <button
              className="w-full p-2 mt-2 border-2 border-amber-300 bg-amber-500 text-white rounded-lg hover:bg-amber-600 hover:cursor-pointer"
              value="submit"
              name="_action"
            >
              Submit
            </button>
          </fetcher.Form>
        </div>
      </div>
    </>
  );
}
