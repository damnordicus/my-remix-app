import {
  ArrowPathIcon,
  CameraIcon,
  TrashIcon,
  QrCodeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import {
  Form,
  Link,
  Outlet,
  redirect,
  useFetcher,
  useFetchers,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router";
import { useEffect, useState } from "react";
import Badge from "../../components/Badge";
import { v4 as uuidv4 } from "uuid";
import {
  addRollToFilament,
  createNewRoll,
  getBarcodesByFilamentId,
  getFilamentById,
  removeFilamentByQR,
} from "~/services/filament.server";
import { generateQr } from "~/services/qr.server";
import { ActionFunctionArgs } from "react-router";
import { error } from "console";
import { userSession } from "~/services/cookies.server";

export const loader = async ({ request, params }) => {
  const session =
    (await userSession.parse(request.headers.get("Cookie"))) || {};
  const filamentId = +params.itemId;
  const selectedFilament = await getFilamentById(filamentId);
  const barcodes = await getBarcodesByFilamentId(filamentId);
  return { selectedFilament, barcodes, user: session.username || null };
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
        return { errors: [e.message] };
      }
      // return json({ errors: ["There was an error."] });
      throw e;
    }
  }
};

export default function SelectedItem() {
  const { selectedFilament, barcodes, user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const nav = useNavigation();
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    console.log("navb", nav);
    console.log("state", nav.location?.state);
  }, [nav]);

  function switchToggle() {
    setToggle(!toggle);
  }

  if (selectedFilament === null) {
    return <div>No filament found.</div>;
  } else {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div
          className={`w-[400px]  bg-slate-600/60 backdrop-blur-xs rounded-2xl shadow-xl p-6 relative border-2 border-slate-300 `}
        >
          <p
            className="fixed top-2 right-2 cursor-pointer text-white text-xl"
            onClick={() => navigate("..")}
          >
            ✖
          </p>

          <div className="flex justify-between mt-4">
            <p className="text-white font-bold">{selectedFilament.brand}</p>
            <Badge size={2}>{selectedFilament.color}</Badge>
            <p className="text-white font-bold">{selectedFilament.material}</p>
          </div>

          <div className="mt-4">
            {/* <BarcodeScanner onScan={handleScan} />
              {scannedBarcode && (
                <p>Scanned code: {scannedBarcode}</p>
              )} */}
            <button onClick={switchToggle}>
              Number of Rolls: {selectedFilament.stock_level}{" "}
              {!toggle && <ChevronDownIcon className="size-4 inline" />}
              {toggle && <ChevronUpIcon className="size-4 inline" />}
            </button>
            {toggle && (
              <div className="flex-col text-center text-slate-300 border-2 border-slate-400 bg-slate-800 rounded-lg">
                {barcodes.map((x, index) => {
                  let last12 = x.slice(-12);
                  let starting = x.slice(0, x.length - 12);
                  return (
                    <span key={index} onClick={switchToggle}>
                      {starting}
                      <span className="text-white">{last12}</span>
                      {index === barcodes.length - 1 ? null : (
                        <hr className="border border-slate-600 w-31/32 flex self-center" />
                      )}
                    </span>
                  );
                })}
              </div>
            )}

            {/* <input
                type="number"
                name="stock_level"
                placeholder="Increae or decrease total stock"
                onChange={(e) => handleChange(e)}
                className={`w-full p-2 mt-1 rounded-md ${quantity > 0 ? 'text-green-500': quantity === 0 ? 'text-white' : 'text-red-500'}  bg-black border-2 border-amber-500 shadow-lg`}
              /> */}
            <div className="w-full flex justify-around pt-4 ">
              {user && (
                <>
                  <Link
                    className="bg-red-500 px-2 py-1 mb-2 rounded-lg shadow-lg"
                    to="discard"
                  >
                    - Discard A Roll
                  </Link>
                  <Link
                    className="bg-green-500 px-2 py-1 mb-2 rounded-lg shadow-lg"
                    to="add"
                  >
                    + Add A Roll
                  </Link>
                </>
              )}
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    );
  }
}
