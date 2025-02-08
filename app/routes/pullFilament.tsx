import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getFilamentByBarcode, pullFromStockByBarcode } from "~/services/filament.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const barcode = url.searchParams.get("barcode");

  if (!barcode) {
    return json({ error: "No barcode provided" }, { status: 400 });
  }

  const filament = await getFilamentByBarcode(barcode);

  if (!filament) {
    return json({ error: "Filament not found" }, { status: 404 });
  }

  return ({ filament });
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


  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-1/6 h-[315px] flex justify-center bg-slate-600 bg-opacity-80 border-2 border-slate-500 rounded-xl p-4">
          <fetcher.Form className="flex flex-col items-center gap-4 w-full" method="post" onSubmit={handleSubmit}>
            <input type="hidden" name="_action" value="submit"/>
            <p className="text-amber-500 text-xl ">
              Select Roll From Inventory
            </p>
            <input type="hidden" name="id" value={filament?.id}/>
            <input
              className="w-full p-2 border border-red-500 shadow-[0px_0px_5px_1px_rgba(255,46,88,1)] rounded-lg placeholder-white "
              type="text"
              placeholder="Barcode"
              name="barcode"
              onChange={(e) => handleBarcode(e)}
            />
            <input
              className="w-full p-2 border border-orange-300 shadow-[0px_0px_5px_1px_rgba(255,149,0,1)] rounded-lg bg-black"
              type="text"
              placeholder="Brand"
              value={filament?.brand ?? null}
              disabled
            />
            <input
              className="w-full p-2 border border-green-300 shadow-[0px_0px_5px_1px_rgba(0,255,0,1)] rounded-lg bg-black"
              type="text"
              placeholder="Type"
              value={filament?.material ?? null}
              disabled
            />
            <input
              className="w-full p-2 border border-blue-500 shadow-[0px_0px_5px_1px_rgba(0,0,255,1)] rounded-lg bg-black"
              type="text"
              placeholder="Weight (g)"
              value={filament?.weight_grams ? `${filament.weight_grams} g` : ''}
              disabled
            />
            <button
              className="w-2/4 p-2 bg-amber-600 text-amber-300 rounded-lg hover:bg-amber-600 border-2 border-amber-300"
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

