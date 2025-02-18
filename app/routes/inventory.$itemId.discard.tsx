import { Form, useFetcher, useFetchers, useLoaderData, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  getBarcodesByFilamentId,
  getFilamentById,
  removeFilamentByQR,
} from "~/services/filament.server";
import { ActionFunctionArgs } from "react-router";
import { TrashIcon } from "@heroicons/react/24/outline";

export const loader = async ({ request, params }) => {
  const filamentId = +params.itemId;
  const selectedFilament = await getFilamentById(filamentId);
  const barcodes = await getBarcodesByFilamentId(filamentId);
  return { selectedFilament, barcodes };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "submit") {
    const test = Object.fromEntries(formData.entries());
    const errors: string[] = [];
    Object.entries(test).forEach(([key, entry]) => {
      if (entry === "") errors.push(`${key} is required`);
    });

    if (errors.length > 0) return { errors };
    try {
      const id = +test.id;
      const barcode = test.barcode;

      return await removeFilamentByQR(barcode, id);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        return { errors: [e.message] };
      }
      // return json({ errors: ["There was an error."] });
      throw e;
    }
  }
};

export default function SelectedItem() {
  const { selectedFilament, barcodes } = useLoaderData<typeof loader>();

  console.log("barocde: ", barcodes);
  const navigate = useNavigate();

  const fetchers = useFetchers();

  useEffect(() => {
    console.log("fetchers:", fetchers);
  }, [fetchers]);

  const fetcher = useFetcher();

  function handleSubmit(e) {
    e.preventDefault();
    //console.log('submitting');
    e.currentTarget.submit();
    //console.log('submitted');
    navigate("..");
  }

  if (selectedFilament === null) {
    return <div>No filament found.</div>;
  } else {
    return (
      <>
      {barcodes.length > 0 ? (
        <div className="bg-slate-500 rounded-lg pb-4 pt-1 mt-2 drop-shadow-md">
        <Form method="post">
        <p className="w-full text-center mb-2">Select the barcode to remove:</p>
        <input type="hidden" name="id" value={selectedFilament.id}/>
        <div className="flex gap-2 justify-center">
        <select name="barcode" className="shadow-lg border-[1px] rounded-lg border-slate-400 px-2">
          {barcodes.map((x) => (
            <option key={x} value={x}>
              {x.slice(x.length-10).toUpperCase()}
            </option>
          ))}
        </select>
        <button name="_action" value="submit" className="p-1 bg-red-400 border-2 rounded-lg border-red-600 text-red-800 shadow-lg">
          <TrashIcon className="size-6" />
          
        </button>
        </div>
      </Form>
      </div>
      ):(
        <p className="text-center">There are no rolls to discard.</p>
      )}
      
      </>
    );
  }
}
