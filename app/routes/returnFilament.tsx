import { CameraIcon } from "@heroicons/react/24/outline";
import { ActionFunction, Form, Link, LoaderFunction, redirect } from "react-router";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getAllMaterials, returnFilamentToStock } from "~/services/filament.server";
import { redirectWithError, redirectWithSuccess } from "remix-toast";

export const loader: LoaderFunction = async ({ request }) => {

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
    console.log('barcode: ', barcodeObject)
    // const decoded = atob(barcodeObject);
    // const parsed = JSON.parse(decoded);
    const result = await returnFilamentToStock(barcodeObject, +weight);
    if(result.success)
      return redirectWithSuccess("../inventory", "Roll returned to stock!")
    return redirectWithError("../inventory", "Error returning roll to stock.")
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
  let filament = fetcher.data;
  console.log('filament:', filament)

  // const handleBarcode = async (e) => {
  //   const barcode = e.target.value;
  //   setScannedBarcode(barcode);

  //   if (barcode.length >= 5) {
  //     fetcher.load(`/pullFilament?barcode=${barcode}`)
  //   }else{
  //       filament = null;
  //   }
  // };

  // const handleSubmit = (e) => {

  //   e.preventDefault();

  //   fetcher.submit(e.target);

  // };

  const handleCamera = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const grabbedBarcode = localStorage.getItem("scannedBarcode");
    console.log('session: ', grabbedBarcode)
    if(grabbedBarcode){
      setScannedBarcode(grabbedBarcode);
      localStorage.removeItem("scannedBarcode")
    }
  }, [])

  // const test = {brand:"ESUN", color:"GOLD", material:"PLA"}
  // const stringify = JSON.stringify(test);
  // const encoded = btoa(stringify);
  // console.log(encoded);

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex md:w-2/3 lg:w-1/3 justify-center bg-slate-600/60 backdrop-blur-sm border-2 border-slate-500 rounded-xl p-8">
          <Form className="flex flex-col items-center gap-4 w-full" method="post" >
            <input type="hidden" name="_action" value="submit"/>
            <p className="text-amber-500 text-xl mb-4">
              Return Roll to Inventory
            </p>
            {/* <input type="hidden" name="id" value={filament?.id}/> */}
            <div className="flex items-center w-full">
            <input
              className="w-full p-2 border border-slate-500 rounded-lg bg-slate-800"
              type="text"
              placeholder="Barcode"
              name="barcode"
              defaultValue={scannedBarcode}
              required
            />
            <Link to="../barcode"><div className="px-2 py-1 ml-2 bg-amber-500 rounded-xl border-2 border-amber-600"><CameraIcon className="size-7  text-amber-700"/></div></Link>
           
            </div>
            
            
            <input
              className="w-full p-2 border border-slate-500 rounded-lg bg-slate-800"
              placeholder="Estimated weight (g)"
              name="weight"
              value={filament?.weight_grams ? `${filament.weight_grams} g` : ''}
              required
            />
            <button
              className="w-full p-2 mt-2 border-2 border-amber-300 bg-amber-500 text-white rounded-lg hover:bg-amber-600 hover:cursor-pointer"
              value="submit"
              name="_action"
            >
              Submit
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}
