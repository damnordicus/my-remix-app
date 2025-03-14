import { QrCodeIcon } from "@heroicons/react/24/outline";
import { ActionFunctionArgs, redirect, useSubmit } from "react-router";
import { Form, Link, useActionData, useFetcher, useMatches, useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addRollToFilament, createNewRoll } from "~/services/filament.server";
import toast from "react-hot-toast";
import { E } from "node_modules/@faker-js/faker/dist/airline-BcEu2nRk";
import { e } from "node_modules/react-router/dist/development/route-data-BmvbmBej.mjs";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "addRoll") {
    const test = Object.fromEntries(formData.entries());
    const errors: string[] = [];
    Object.entries(test).forEach(([key, entry]) => {
      if (entry === "") errors.push(`${key} is required`);
    });

    if (errors.length > 0) return json({ errors });

    try {
      const id = +test.id;
      const weight = +test.weight;
      const price = +test.price;
      const quantity = +test.quantity;
      // const newId = uuidv4();

      // console.log('id: ', id, ' weight: ', weight, ' price: ', price, ' newId: ', newId)
      const addToFilament = await addRollToFilament(id);
      const addNewRoll = await createNewRoll(weight, price, id, quantity, new URL(request.url).origin, showThrobber);

      // const response = await fetch( new URL(request.url).origin + '/api/generate', {
      //   method:"POST",
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      //   body : new URLSearchParams({newId}),
      // });
  
      // const result = await response.json();
      if(addNewRoll.error){
        return {error: addNewRoll.error}
      }
      return { successfull: quantity, errors: [] };
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        return { errors: [e.message], newId: null };
      }
      // return json({ errors: ["There was an error."] });
      throw e;
    }
  }
};
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

export function showThrobber(show) {
  if (typeof document !== "undefined") {
    const throbber = document.getElementById("throbber");
    if (throbber) {
      throbber.classList.toggle("hidden", !show);
    }
  }
}


export function useDownloadFetcher() {
  const fetcher = useFetcher();

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") {
      return;
    }

    console.log(fetcher.data)

    const byteData = base64ToUint8Array(fetcher.data.fileData);
    const blob = new Blob([byteData], { type: fetcher.data.fileType });

    // create a URL for the blob and trigger the download link
    const url = window.URL.createObjectURL(blob);

    // dynamically create download link
    // const link = window.URL.createObjectURL(new Blob([fetcher.data.fileData], {
    //   type: fetcher.data.fileType,
    // }));

    // create a temporary anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = fetcher.data.fileName;
    a.click();
  }, [fetcher.data, fetcher.state]);

  return fetcher;
}
export default function SelectedItem() {
  // const { selectedFilament, barcodes } = useLoaderData<typeof loader>();
  const data = useMatches();
  const item = data.find(
    (match) => match.id === "routes/inventory/inventory.$itemId"
  )?.data;
  let selectedFilament = null;
  if (item && item.selectedFilament) selectedFilament = item.selectedFilament;

  const actionData = useActionData<typeof action>();
  const [newId, setNewId] = useState<null | string>(null);
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(false);
  const submit = useSubmit();

  const fetcher = useDownloadFetcher();

  const handleDownload = useCallback((id) => {
    if (fetcher.state !== "idle") return;
    //fetcher.load(`/api/generate?id=${id}&type=fetcher`);
    navigate("..")
  }, [])

  useEffect(() => {
    if (newId) handleDownload(newId);
  }, [newId, handleDownload]);

  useEffect(() => {
    if (actionData && actionData.newId){
      setNewId(actionData.newId)
      toast.success(`Printing QR for: ${newId}`);
    } 
    if(actionData && actionData.error){
      toast.error(actionData.error)
    }
    setLoading(false);
  }, [actionData]);

  function handleSave(e) {
    // e.preventDefault();
    // //console.log('submitting');
    // e.currentTarget.submit();
    // //console.log('submitted');
    // navigate('..', { state: {
    //   action: 'success'
    // }});
    // // navigate('..'
    // // 
    // 
    setLoading(true);
    e.currentTarget.submit(setLoading);
    setTimeout(() => setLoading(false), 5000)
    //submit("addRoll")
  }

  if (selectedFilament === null) {
    return <div>No filament found.</div>;
  } else {
    return (
      <div className="bg-slate-400/60 rounded-lg pb-4 pt-1 mt-2 drop-shadow-md">
      <Form className="w-full text-center mt-2 flex flex-col" method="post">
        <input type="hidden" name="id" value={selectedFilament.id} />
        <input type="hidden" name="_action" value="addRoll" />
        <input
          type="number"
          name="weight"
          placeholder="Weight in grams"
          className="border border-slate-400 bg-slate-600 rounded-lg p-2 mx-2 my-1"
          min={0}
          step={100}
        />
        <input
          type="number"
          name="price"
          placeholder="Cost"
          className="border border-slate-400 bg-slate-600 rounded-lg p-2 my-1 mx-2"
          min={0.0}
          step={0.01}
        />

        <input type="number"
          name="quantity"
          placeholder="Quantity"
          className="border border-slate-400 bg-slate-600 rounded-lg p-2 mx-2 my-1 "
          required
          min={1}
        />
        <div className="w-full flex justify-center text-center items-center">
          {/* <Link
            to={`/qr/${selectedFilament.id}.svg`}
            className="flex bg-amber-500 items-center p-1 rounded-lg  mt-2 shadow-lg"
            reloadDocument
          >
            <QrCodeIcon className="size-7 mr-1" /> Save SVG
          </Link>
          <Link
            to={`/qr/${selectedFilament.id}.png`}
            className="flex bg-amber-500 items-center p-1 rounded-lg  mt-2 shadow-lg"
            reloadDocument
          >
            <QrCodeIcon className="size-7 mr-1" /> Save PNG
          </Link> */}
          <button
            type="submit"
            name="_action"
            value="addRoll"
            className="flex bg-amber-600 items-center p-2 border-2 border-amber-500 rounded-lg  mt-2 shadow-lg"
            onClick={handleSave}
          >
            <QrCodeIcon className="size-7 mr-1" /> Print
          </button>
        </div>
        {loading && <div id="throbber" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>}
      </Form>
      </div>
    );
  }
}
