import { CameraIcon, PlusIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  ActionFunctionArgs,
  Form,
  Link,
  Outlet,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  LoaderFunctionArgs,
  useFetcher,
  ClientLoaderFunction,
  ClientLoaderFunctionArgs,
  useSubmit,
  useSearchParams,
} from "react-router";
import InputDropDown from "~/components/InputDropDown";
import Badge from "~/components/Badge";
import {
  createJob,
  getFilamentByBarcode,
  getUserIdByUsername,
} from "~/services/filament.server";
import { toast } from "react-hot-toast";
import { userSession } from "~/services/cookies.server";
import { Route } from "./+types/create";
import { Filament } from "@prisma/client";
import { createJiraBody, createJiraIssue } from "~/utils/jira.service";

type FilamentBarcodes = {
  filament: Filament;
  barcode: string;
};

export async function clientLoader({
  request,
  serverLoader,
}: Route.ClientLoaderArgs) {
  const data = await serverLoader();
  const search = new URL(request.url).searchParams;
  // const selectedBarcode = search.get('selection');

  console.log("client-loader", data);

  const storedBarcodeLS = localStorage.getItem("scannedBarcode");
  const selectedFilamentLS: FilamentBarcodes[] = JSON.parse(
    localStorage.getItem("selectedFilament") ?? "[]"
  );

  if (data.selection && data.filament) {
    selectedFilamentLS.push({
      filament: data.filament,
      barcode: data.selection,
    });
    localStorage.setItem(
      "selectedFilament",
      JSON.stringify(selectedFilamentLS)
    );
  }
  console.log(selectedFilamentLS);

  return { ...data, storedBarcodeLS, selectedFilamentLS };
}

export async function loader({ request }: LoaderFunctionArgs) {
  // check request.headers.cookie for userId or sessionid
  // potentially verify in db
  // if not in either redirect back to login

  const searchParams = new URL(request.url).searchParams;
  const selection = searchParams.get("selection");

  const session = await userSession.parse(request.headers.get("Cookie"));

  if (!session?.username) {
    return redirect("..");
  }

  const userId = await getUserIdByUsername(session.username);
  const user = session.username;//userId?.id;

  if (selection) {
    try{
      const filament = await getFilamentByBarcode(selection);
      searchParams.delete("selection");
      return { filament, selection, user };
    }catch(error){
      return { error: error }
    }
  }
  return { user };
}

// force the client loader to run during hydration
clientLoader.hydrate = true as const; // `as const` for type inference

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <div>Loading...</div>;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  console.log(action)
  if (action === "submit") {
    const classification = formData.get("classification") as string;
    const printer = formData.get("printer") as string;
    const barcodes = formData.getAll("barcode") as string[];
    const details = formData.get("details") as string;
    const title = formData.get('title') as string;
    const userId = formData.get("userId") as string;
    // const date = formData.get("date");
    if (!classification || !printer || barcodes.length === 0 || !details)
      return redirect("");

    // console.log('data; ', date)
    const job = createJiraBody({classification, printer, barcodes, details, title, userId});

    const newJob = await createJiraIssue(job)

    return redirect("../inventory");
  }
  // if(action === "cancel"){
    console.log("here")
  //   return redirect("/");
  // }
  return redirect("/");
}

export default function PrintJobForm({
  loaderData: {
    filament: selection,
    selection: barcode,
    user,
    storedBarcodeLS,
    selectedFilamentLS,
  },
}: Route.ComponentProps) {
   const data = useLoaderData();
  useEffect(() => {
    if(data?.error){
      toast.error(data.error)
    }
  },[data])

  const options = [
    "Left XL",
    "Right XL",
    "Left MK4",
    "Right MK4",
    "MK3S 1",
    "MK3S 2",
    "MK3S 3",
    "MK3S 4",
    "MK3S 5",
    "MK3S 6",
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("classification") || "");
  const [selectedPrinter, setSelectedPrinter] = useState(searchParams.get("printer") || "");
  const [selectedFilament, setSelectedFilament] = useState(selectedFilamentLS);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  //   console.log("user: ", user);

  //   useEffect(() => {
  //     if (selection && !selectedFilament?.some((f) => f.barcode === barcode)) {
  //       // let array = atob(selection);
  //       // let converted = JSON.parse(array);
  //       // setSelectedFilament(selection);
  //       setSelectedFilament((prev) => {
  //         const arr = [
  //             ...prev,
  //             {
  //                 filament: fetcher.data,
  //                 barcode: scannedBarcode,
  //             },
  //         ]
  //     //   localStorage.setItem("selectedFilament", JSON.stringify(arr))
  //         return arr;
  //     });
  //     }
  //   }, [selection, barcode]);

  //   useEffect(() => {
  //     const grabbedBarcode = localStorage.getItem("scannedBarcode");
  //     console.log("session: ", grabbedBarcode);
  //     if (grabbedBarcode) {
  //       setScannedBarcode(grabbedBarcode);
  //     }
  //   }, []);
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.clear();
    const formData = new FormData(event.currentTarget);
    formData.append("_action", "submit");
    submit(formData, { method: "POST" });
  }

  useEffect(() => {
    if (scannedBarcode) {
      fetcher.load(`barcodeReturn?barcode=${scannedBarcode}`);
    }
  }, [scannedBarcode]);

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      console.log("Fetcher data:", fetcher.data);
      console.log("scanned: ", scannedBarcode);
      if (fetcher.data && scannedBarcode) {
        setSelectedFilament((prev) => {
          const arr = [
            ...prev,
            {
              filament: fetcher.data,
              barcode: scannedBarcode,
            },
          ];
          localStorage.setItem("selectedFilament", JSON.stringify(arr));
          return arr;
        });

        setScannedBarcode("");
        // localStorage.removeItem("scannedBarcode");
      }
    }
  }, [fetcher.data, fetcher.state]);

  useEffect(() => {
    setSelectedFilament(selectedFilamentLS);
  }, [selectedFilamentLS]);

  useEffect(() => {
    localStorage.setItem("selectedFilament", JSON.stringify(selectedFilament));
  }, [selectedFilament]);

  const handleAddBarcode = async () => {
    if (
      scannedBarcode &&
      !selectedFilament?.some((f) => f.barcode === scannedBarcode)
    ) {
      console.log("Fetching barcode data for:", scannedBarcode);
      fetcher.load(`/api/barcodeReturn?barcode=${scannedBarcode}`);
    } else {
      console.log("Invalid or duplicate barcode:", scannedBarcode);
    }
  };
  const removeFetcher = useFetcher();

  const handleRemoveFilament = (barcodeToRemove: string) => {
    removeFetcher.load(`/api/removeSelection?barcode=${barcodeToRemove}`);
    setSelectedFilament((prev) =>
      prev.filter((item) => item.barcode !== barcodeToRemove)
    );
  };
  // useEffect(() => {
  //     if(actionData?.success){
  //         toast.success(actionData.message);
  //         setTimeout(() => {
  //             window.location.href = '/';
  //         }, 2000);
  //     }
  // },[actionData]);

  // const handleClick = () => {
  //     navigate('inventory');
  // }
  function handleChange(e){
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if(e.currentTarget.value.length > 0){
        newParams.set(e.currentTarget.name, e.currentTarget.value);
      }else{
        newParams.delete(e.currentTarget.name);
      }
      return newParams
    })
  }

  // useEffect(() => {
  //   setSearchParams((prev) => {
  //     const newParams = new URLSearchParams(prev);

  //       if(selectedCategory.length > 0){
  //         newParams.set("category", selectedCategory);
  //       }
  //       else{
  //         newParams.delete("category");
  //       }
  //       return newParams
  //     })
  // }, [selectedCategory, setSearchParams])

  // useEffect(() => {
  //   setSearchParams((prev) => {
  //     const newParams = new URLSearchParams(prev);

  //       if(selectedPrinter.length > 0){
  //         newParams.set("printer", selectedPrinter);
  //       }
  //       else{
  //         newParams.delete("printer");
  //       }
  //       return newParams
  //     })
  // }, [selectedPrinter, setSearchParams])

  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <div className="flex-col pt-5 gap-2 w-[420px] bg-slate-600/60 backdrop-blur-sm rounded-xl border-2 border-slate-400 shadow-xl">
        <h1 className="text-2xl text-center text-amber-500">Job Details</h1>
        <Form method="POST" onSubmit={handleSubmit}>
          <input type="hidden" name="userId" value={user} />
          <div className="flex-col gap-2 px-4 text-lg ">
            <label htmlFor="title " >Name Your Project: </label>
            <input type="text" name="title" className="bg-slate-800 rounded-xl py-2 border border-slate-500 mb-2 pl-4" defaultValue={searchParams.get("title") || ""} onChange={handleChange}/>
          </div>
          <InputDropDown
            labelText={"Classification"}
            options={["Mission", "Personal"]}
            setSelectedOption={setSelectedCategory}
            selectedOption={selectedCategory}
          />
          <InputDropDown
            labelText={"Printer"}
            options={options}
            setSelectedOption={setSelectedPrinter}
            selectedOption={selectedPrinter}
          />
          <div className="flex-col w-full">
            <label className="flex pl-4 pb-2 text-lg">
              Select Filament(s):{" "}
            </label>

            {/* Display selected filaments */}
            {selectedFilament?.length > 0 && (
              <div className="flex-col w-full space-y-2 mb-4 max-h-100 overflow-y-scroll">
                {selectedFilament.map(({ filament, barcode }, index) => (
                  <div
                    key={barcode}
                    className="flex-col mx-4 p-2 bg-slate-700/80 rounded-lg border border-slate-500"
                  >
                    <div className="flex w-full  justify-between items-center">
                      <div className="flex w-full justify-between pr-6 items-center gap-2">
                      <span>{filament.brand}</span>
                        <Badge size={4}>{filament.color}</Badge>
                        <span>{filament.material}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleRemoveFilament(barcode);
                        }}
                        className="text-gray-300 hover:text-red-500 hover:cursor-pointer"
                      >
                        <TrashIcon className="size-4.5 text-red-500" />
                      </button>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span className="text-slate-400">{barcode.toUpperCase()}</span>
                    </div>
                    <input type="hidden" name="barcode" value={barcode} />
                  </div>
                ))}
              </div>
            )}

            {/* Controls for adding filament */}
            <div className="flex justify-center gap-2 mb-4">
              {scannedBarcode ? (
                <div className="flex-col w-full px-4">
                  <input
                    type="text"
                    value={scannedBarcode}
                    readOnly
                    className="text-center py-1 w-full bg-slate-800/60 rounded-xl border border-slate-500"
                  />
                  <div className="flex justify-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleAddBarcode}
                      className="py-1 px-2 rounded-lg border-2 border-green-600 bg-green-500 text-black flex items-center gap-1"
                    >
                      <PlusIcon className="size-5" /> Add Filament
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setScannedBarcode("");
                        // localStorage.removeItem("scannedBarcode");
                      }}
                      className="py-1 px-2 rounded-lg border-2 border-amber-600 bg-amber-500 text-black"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 w-full">
                  <Link
                    to={`../barcode?from=job/create&${searchParams.toString()}`}
                    className="bg-amber-500 w-fit px-2 rounded-xl py-1 border-2 border-amber-600 text-amber-900 justify-self-end -mr-6"
                  >
                    <CameraIcon className="size-8" />
                  </Link>
                  <Link
                    to="inventory"
                    className="text-sm italic justify-self-center self-end "
                  >
                    Search Filament
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <label htmlFor="details" className="flex pl-4 text-lg py-2">
            Job Description:{" "}
          </label>
          <textarea
            name="details"
            className="flex text-lg w-11/12 mx-auto bg-slate-800/80 rounded-xl border border-slate-500 px-2 min-h-24"
            defaultValue={searchParams.get("details") || ""}
            onChange={handleChange}
          ></textarea>

          <div className="flex w-full justify-center gap-x-2 pt-4 mb-4 mt-1">
            <button
              name="_action"
              value="submit"
              type="submit"
              disabled={selectedFilament?.length === 0}
              className={`rounded-xl border-2 px-4 py-2 text-black ${
                selectedFilament?.length === 0
                  ? "border-gray-400 bg-gray-400 cursor-not-allowed"
                  : "border-amber-600 bg-amber-500"
              }`}
            >
              Submit Job
            </button>
            <Link to="/"
              className={`rounded-xl border-2 px-4 py-2 border-red-400 bg-red-600 hover:cursor-pointer`}
              >
              Cancel
            </Link>
          </div>
        </Form>
      </div>
      <Outlet />
    </div>
  );
}
