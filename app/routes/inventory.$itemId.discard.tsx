import {
  ArrowPathIcon,
  CameraIcon,
  TrashIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import {
  Form,
  json,
  Link,
  redirect,
  useFetcher,
  useFetchers,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import { v4 as uuidv4 } from "uuid";
import {
  addRollToFilament,
  createNewRoll,
  getBarcodesByFilamentId,
  getFilamentById,
  removeFilamentByQR,
} from "~/services/filament.server";
import { generateQr } from "~/services/qr.server";
import { ActionFunctionArgs } from "@remix-run/node";
import { error } from "console";

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

    if (errors.length > 0) return json({ errors });

    try {
      const id = +test.id;
      const option = test.option;
      const weight = +test.weight;
      const price = +test.price;
      const barcode = test.barcode;

      if (option === "add") {
        console.log("im here");
        const newId = uuidv4();
        const addToFilament = await addRollToFilament(id);
        const addNewRoll = await createNewRoll(newId, weight, price, id);
        const contentType = "image/svg+xml";
        const contentFilename = `qr-code-${newId}.svg`;
        const newQr = await generateQr(newId, "svg");
        throw new Response(newQr, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${contentFilename}"`,
          },
        });
      }
      if (option === "discard") {
        if (!barcode) throw new Error("Barcode must be selected");

        return await removeFilamentByQR(barcode, id);
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        return json({ errors: [e.message] });
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
  const [quantity, setQuantity] = useState(0);

  // useEffect(() => {
  //   if(navigate.state !== 'idle'){
  //     setQuantity(0);
  //     navigate(-1);
  //   }
  // },[navigate.state, onclose])

  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [discardVisible, setDiscardVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);

  const fetchers = useFetchers();

  useEffect(() => {
    console.log("fetchers:", fetchers);
  }, [fetchers]);

  const fetcher = useFetcher();

  function handleScan(barcode) {
    console.log("barcode: ", barcode);
    setScannedBarcode(barcode);
  }

  function handleChange(e) {
    setQuantity(parseInt(e.target.value));
  }

  function handleDiscard() {
    setDiscardVisible(!discardVisible);
    setAddVisible(false);
  }

  function handleAdd() {
    setAddVisible(!addVisible);
    setDiscardVisible(false);
  }

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
      <div>
        <p>Select the barcode to remove:</p>
        <select name="barcode">
          {barcodes.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        <button name="_action" value="submit">
          Delete
        </button>
      </div>
    );
  }
}
