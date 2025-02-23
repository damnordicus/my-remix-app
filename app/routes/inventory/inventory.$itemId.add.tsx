import { QrCodeIcon } from "@heroicons/react/24/outline";
import { ActionFunctionArgs } from "react-router";
import { Form, Link, useActionData, useFetcher, useMatches, useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addRollToFilament, createNewRoll } from "~/services/filament.server";

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
      const newId = uuidv4();

      console.log('id: ', id, ' weight: ', weight, ' price: ', price, ' newId: ', newId)
      const addToFilament = await addRollToFilament(id);
      const addNewRoll = await createNewRoll(newId, weight, price, id);
      return { newId, errors: [] };
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

  const fetcher = useDownloadFetcher();

  const handleDownload = useCallback((id) => {
    if (fetcher.state !== "idle") return;
    fetcher.load(`/api/generate?id=${id}&type=fetcher`);
    navigate("..")
  }, [])

  useEffect(() => {
    if (newId) handleDownload(newId);
  }, [newId, handleDownload]);

  useEffect(() => {
    if (actionData && actionData.newId) setNewId(actionData.newId)
  }, [actionData]);

  function handleSubmit(e) {
    // e.preventDefault();
    // //console.log('submitting');
    // e.currentTarget.submit();
    // //console.log('submitted');
    // navigate('..', { state: {
    //   action: 'success'
    // }});
    // // navigate('..'
    // // )
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
          className="border border-slate-400 bg-slate-600 rounded-lg px-2 mx-2"
          min={0}
          step={100}
        />
        <input
          type="number"
          name="price"
          placeholder="Cost"
          className="border border-slate-400 bg-slate-600 rounded-lg px-2 m-2"
          min={0.0}
          step={0.01}
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
            className="flex bg-amber-500 items-center p-1 rounded-lg  mt-2 shadow-lg"
          >
            <QrCodeIcon className="size-7 mr-1" /> Save
          </button>
        </div>
      </Form>
      </div>
    );
  }
}
