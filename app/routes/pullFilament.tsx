import { CameraIcon } from "@heroicons/react/24/outline";
import { ActionFunction, LoaderFunction, redirect } from "react-router";
import { Form, Link, useFetcher, useLoaderData, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import InputText from "~/components/InputText";
import { getFilamentByBarcode, pullFromStockByBarcode } from "~/services/filament.server";
import { userSession } from "~/services/cookies.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await userSession.parse(request.headers.get("Cookie"));
      if(!session.username) return redirect("..");
  const url = new URL(request.url);
  const barcode = url.searchParams.get("barcode");

  if (!barcode) {
    return {status: 400 };
  }

  const filament = await getFilamentByBarcode(barcode);

  if (!filament) {
    throw new Error("No filament found");
  }

  return { filament };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  console.log('actionType: ', actionType)

  if(actionType === 'submit'){
    const barcode = formData.get("barcode") as string;
    const id = Number(formData.get("id"));
    return await pullFromStockByBarcode(barcode, id);
  }
  else {
    return null;
  }
};

export default function  PullFromStock() {
//   const { filament } = useLoaderData<typeof loader>();
//   console.log(filament)
  const navigate = useNavigate();
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [pulledInfo, setPulledInfo] = useState(null);
  const fetcher = useFetcher();
  let filament = fetcher.data?.filament;
  //console.log(filament)

  const handleBarcode = async (e) => {
    const barcode = e.target.value;
    setScannedBarcode(barcode);

    if (barcode.length >= 5) {
      fetcher.load(`/pull/${barcode}`)


    }else{
        filament = null;
    }
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    fetcher.submit(e.target);

  };

  useEffect(() => {
    if(fetcher.state === 'idle' && fetcher.data){
      console.log(fetcher.data)
    }
  },[fetcher.data, fetcher.state])

  useEffect(() => {
    const barcode = localStorage.getItem('scannedBarcode');
    if(barcode){
      setScannedBarcode(barcode);
      fetcher.load(`/pull/${barcode}`);
      localStorage.removeItem('scannedBarcode');
    }
  },[]);

  console.log(scannedBarcode);

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-1/6 h-[315px] bg-slate-600 bg-opacity-80 border-2 border-slate-500 rounded-xl p-4">
          <Form className="flex flex-col items-center gap-4 w-full">
            <input type="hidden" name="_action" value="submit"/>
            <p className="text-amber-500 text-xl ">
              Select Roll From Inventory
            </p>
            {/* <input type="hidden" name="id" value={filament.id}/> */}
            <div className="w-full flex justify-center">
            <Link to={"/barcode"} target="_blank" rel="noreferrer">
            <div className="bg-amber-500 p-2 rounded-lg border-2 border-amber-600">
            <CameraIcon className="size-8 text-amber-800"/>
            </div>
            </Link>
            </div>
            {/* <InputText text='Brand' color='orange' item={filament.color}/> */}
            {/* <InputText text='Material' color='green' item={filament.material}/> */}
            {/* <input
              className="w-full p-2 border border-blue-500 shadow-[0px_0px_5px_1px_rgba(0,0,255,1)] rounded-lg bg-black"
              type="text"
              placeholder="Weight (g)"
              value={pulledInfo?.weight ? `${pulledInfo.weight} g` : ''}
              disabled
            /> */}
            <button
              className="w-2/4 p-2 bg-amber-500 text-amber-800 rounded-lg hover:bg-amber-600 border-2 border-amber-600"
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

