import { CameraIcon, PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { ActionFunctionArgs, Form, Link, Outlet, redirect, useActionData, useLoaderData, useNavigate, LoaderFunctionArgs, useFetcher } from "react-router";
import InputDropDown from "~/components/InputDropDown";
import Badge from "~/components/Badge";
import { createJob, getFilamentByBarcode, getUserIdByUsername } from "~/services/filament.server";
import { toast } from "react-hot-toast";
import { userSession } from "~/services/cookies.server";
import { Route } from "./+types/create";

export async function loader({request}: LoaderFunctionArgs) {
    // check request.headers.cookie for userId or sessionid
    // potentially verify in db
    // if not in either redirect back to login

    const searchParams = new URL(request.url).searchParams;
    const selection = searchParams.get('selection');

    const session = await userSession.parse(request.headers.get("Cookie"));

    if(!session?.username){
        return redirect("..");
    }

    const userId = await getUserIdByUsername(session.username);
    const user = userId?.id;
    
    if(selection){
        const filament = await getFilamentByBarcode(selection);
        return {filament, selection, user};
    }
        return {};
}

export async function action ({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const action = formData.get('_action');

    if(action === 'submit'){
        const classification = formData.get("classification") as string;
        const printer = formData.get('printer') as string;
        const barcodes = formData.getAll('barcode') as string[];
        const details = formData.get('details') as string;
        const userId = formData.get('userId') as string;
        // const date = formData.get("date");
        if(!classification || !printer || barcodes.length === 0 || !details) return redirect('')  
    
        // console.log('data; ', date)
        
        await createJob(classification, printer, barcodes, details, +userId);
        return redirect('/?success=job');
    }
    return redirect('/');
    
}

export default function PrintJobForm({loaderData:{ filament: selection, selection: barcode , user}}: Route.ComponentProps) {
    // const { filament: selection, selection: barcode , user} = loaderData;
    const options = ["Left XL", "Right XL", "Left MK4", "Right MK4", "MK3 1", "MK3 2", "MK3 3", "MK3 4", "MK3 5", "MK3 6"];
    const [ selectedCategory, setSelectedCategory] = useState('');
    const [ selectedPrinter, setSelectedPrinter] = useState('');
    const [ selectedFilament, setSelectedFilament] = useState([]);
    const [ scannedBarcode, setScannedBarcode ] = useState('');
    const navigate = useNavigate();
    const actionData = useActionData<typeof action>();

    console.log('user: ', user)

    useEffect(() => {
        if(selection && !selectedFilament.some(f => f.barcode === barcode) ){
            // let array = atob(selection);
            // let converted = JSON.parse(array);
            // setSelectedFilament(selection);
            setSelectedFilament(prev => [...prev, {
                filament: selection,
                barcode: barcode,
            }]);
        }
    },[selection, barcode])

    useEffect(() => {
        const grabbedBarcode = localStorage.getItem("scannedBarcode");
        console.log('session: ', grabbedBarcode)
        if(grabbedBarcode){
          setScannedBarcode(grabbedBarcode);
          handleAddBarcode(grabbedBarcode);

        }
      }, [])
const fetcher = useFetcher();

useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle') {
        console.log('Fetcher data:', fetcher.data);
        console.log('scanned: ', scannedBarcode);
        if (fetcher.data && scannedBarcode) {
            setSelectedFilament(prev => [...prev, {
                filament: fetcher.data,
                barcode: scannedBarcode
            }]);
            setScannedBarcode('');
            localStorage.removeItem("scannedBarcode");
        }
    }
}, [fetcher.data, fetcher.state]);

    const handleAddBarcode = async (grabbedBarcode: string) => {
        if ((scannedBarcode ?? grabbedBarcode) && !selectedFilament.some(f => f.barcode === scannedBarcode)) {
            console.log('Fetching barcode data for:', scannedBarcode ?? grabbedBarcode);
            fetcher.load(`barcodeReturn?barcode=${scannedBarcode ?? grabbedBarcode}`);
        } else {
            console.log('Invalid or duplicate barcode:', scannedBarcode ?? grabbedBarcode);
        }
    };

    const handleRemoveFilament = (barcodeToRemove) => {
        setSelectedFilament(prev => prev.filter(item => item.barcode !== barcodeToRemove));
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

    console.log(selectedFilament)

    return (
        <div className="flex w-full min-h-screen items-center justify-center">
         <div className="flex-col pt-5 gap-2 w-[420px] bg-slate-600/60 backdrop-blur-sm rounded-xl border-2 border-slate-400 shadow-xl">
            <h1 className="text-2xl text-center text-amber-500">
                Job Details
            </h1>
            <Form method="POST">
                <input type="hidden" name="userId" value={user} />
                <InputDropDown labelText={"Classification"} options={["Mission", "Personal"]} setSelectedOption={setSelectedCategory}/>
                <InputDropDown labelText={"Printer"} options={options} setSelectedOption={setSelectedPrinter}/>
                <div className="flex-col w-full">
                    <label className="flex pl-4 pb-2 text-lg">Select Filament(s): </label>
                    
                    {/* Display selected filaments */}
                    {selectedFilament.length > 0 && (
                        <div className="flex-col space-y-2 mb-4">
                            {selectedFilament.map((item, index) => (
                                <div key={item.barcode} className="flex-col mx-4 p-2 bg-slate-700/80 rounded-lg border border-slate-500">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">Roll {index + 1}:</span>
                                            <Badge size={4}>{item.filament.color}</Badge>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveFilament(item.barcode)}
                                            className="text-gray-300 hover:text-red-500"
                                        >
                                            <XCircleIcon className="size-5" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between mt-1 text-sm">
                                        <span>Brand: {item.filament.brand}</span>
                                        <span>Material: {item.filament.material}</span>
                                    </div>
                                    <input 
                                        type="hidden" 
                                        name="barcode" 
                                        value={item.barcode}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Controls for adding filament */}
                    <div className="flex justify-center gap-2 mb-4">
                        {!scannedBarcode && 
                            <>
                                <Link to="../barcode" className="bg-amber-500 px-2 rounded-xl py-1 border-2 border-amber-600 text-amber-900 text-center">
                                    <CameraIcon className="size-6"/>
                                </Link>
                                <Link to="inventory" className="bg-amber-500 px-3 rounded-xl py-1 border-2 border-amber-600 text-black text-center">
                                    Search Filament
                                </Link>
                            </>}
                         {/* ) : ( */}
                             {/* <div className="flex-col w-full px-4"> */}
                                {/* <input  
                        //             type="text" 
                        //             value={scannedBarcode} 
                        //             readOnly
                        //             className="text-center py-1 w-full bg-slate-800/60 rounded-xl border border-slate-500"
                        //         />
                        //         <div className="flex justify-center gap-2 mt-2">
                        //             <button 
                        //                 type="button"
                        //                 onClick={handleAddBarcode} 
                        //                 className="py-1 px-2 rounded-lg border-2 border-green-600 bg-green-500 text-black flex items-center gap-1"
                        //             >
                        //                 <PlusIcon className="size-5" /> Add Filament
                        //             </button>
                        //             <button 
                        //                 type="button"
                        //                 onClick={() => {
                        //                     setScannedBarcode(''); 
                        //                     localStorage.removeItem("scannedBarcode");
                        //                 }} 
                        //                 className="py-1 px-2 rounded-lg border-2 border-amber-600 bg-amber-500 text-black"
                        //             >
                        //                 Cancel
                        //             </button>
                        //         </div>
                        //     </div>
                        // )}*/}
                    </div>
                </div>

                <label htmlFor="details" className="flex pl-4 text-lg py-2">Job Description: </label>
                <textarea 
                    name="details" 
                    className="flex text-lg w-11/12 mx-auto bg-slate-800/80 rounded-xl border border-slate-500 px-2 min-h-24"
                ></textarea>
                
                <div className="flex w-full justify-center pt-4 mb-4 mt-1">
                    <button 
                        name="_action" 
                        value="submit" 
                        type="submit" 
                        disabled={selectedFilament.length === 0}
                        className={`rounded-xl border-2 px-4 py-2 text-black ${
                            selectedFilament.length === 0 
                                ? 'border-gray-400 bg-gray-400 cursor-not-allowed' 
                                : 'border-amber-600 bg-amber-500'
                        }`}
                    >
                        Submit Job
                    </button>
                </div>
            </Form>
        </div>
        <Outlet />
        </div>
    );
}