import { CameraIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { ActionFunctionArgs, Form, Link, Outlet, redirect, useActionData, useLoaderData, useNavigate, LoaderFunctionArgs } from "react-router";
import InputDropDown from "~/components/InputDropDown";
import Badge from "~/components/Badge";
import { createJob, getFilamentByBarcode } from "~/services/filament.server";
import { toast } from "react-hot-toast";
import { userSession } from "~/services/cookies.server";

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
    
    if(selection){
        const filament = await getFilamentByBarcode(selection);
        return {filament, selection};
    }
        return {};
}

export async function action ({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const action = formData.get('_action');

    if(action === 'submit'){
        const classification = formData.get("classification");
        const printer = formData.get('printer');
        const barcode = formData.get('barcode');
        const details = formData.get('details');
        const userId = 14;
        if(!classification || !printer || !barcode || !details) return redirect('')   
        
        await createJob(classification, printer, barcode, details, userId);
        return redirect('/?success=true');
    }
    return redirect('/');
    
}

export default function PrintJobForm() {
    const { filament: selection, selection: barcode } = useLoaderData<typeof loader>();
    const options = ["Left XL", "Right XL", "Left MK4", "Right MK4", "MK3 1", "MK3 2", "MK3 3", "MK3 4", "MK3 5", "MK3 6"];
    const [ selectedCategory, setSelectedCategory] = useState('');
    const [ selectedPrinter, setSelectedPrinter] = useState('');
    const [ selectedFilament, setSelectedFilament] = useState({});
    const [ scannedBarcode, setScannedBarcode ] = useState('');
    const navigate = useNavigate();
    const actionData = useActionData<typeof action>();

    useEffect(() => {
        if(selection){
            // let array = atob(selection);
            // let converted = JSON.parse(array);
            setSelectedFilament(selection)
        }
    },[selection])

    useEffect(() => {
        const grabbedBarcode = localStorage.getItem("scannedBarcode");
        console.log('session: ', grabbedBarcode)
        if(grabbedBarcode){
          setScannedBarcode(grabbedBarcode);
        }
      }, [])
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

    return (
        <div className="flex w-full min-h-screen items-center justify-center">
         <div className="flex-col pt-5 gap-2 w-[420px] bg-slate-600/60 backdrop-blur-sm rounded-xl border-2 border-slate-400 shadow-xl">
            <h1 className="text-2xl text-center text-amber-500">
                Job Details
            </h1>
            <Form method="POST">
            <InputDropDown labelText={"Classification"} options={["Mission", "Personal"]} setSelectedOption={setSelectedCategory}/>
            <InputDropDown labelText={"Printer"} options={options} setSelectedOption={setSelectedPrinter}/>
            <div className="flex-col w-full">
                <label htmlFor="printerSelect" className="flex pl-4 pb-2 text-lg" >Select Filament: </label>
                {!selection && <div className="flex justify-center gap-4">
                {!scannedBarcode && <><Link to={`../barcode`} className="bg-amber-500 px-2 rounded-xl py-1 border-2 border-amber-600 text-amber-900 text-center"><CameraIcon className="size-6"/></Link>
                <Link to={'inventory'}  className="bg-amber-500 px-3 rounded-xl py-1 border-2 border-amber-600 text-black text-center">Search Filament</Link></> }
                {scannedBarcode && <div className="flex-col w-full">
                <input type="text" defaultValue={scannedBarcode} className="text-center py-1 bg-slate-800/60 mx-4 rounded-xl border border-slate-500"></input>
                <button onClick={()=>{setScannedBarcode(''); localStorage.removeItem("scannedBarcode");}} className="w-fit flex self-center py-1 px-2 mt-4 rounded-lg border-2 border-amber-600 bg-amber-500 text-black">Change Filament</button>
                </div>}
                </div>}
                {selection && (
                    <div className="flex-col  w-full text-lg">
                        <div className="flex w-full ">
                            <p className="flex mx-4">Brand: {selection.brand}</p>
                            <p className="flex mx-4">Material: {selection.material}</p>
                            <Badge size={4} >{selection.color}</Badge>
                        </div>
                        <p className="flex w-full mx-4 mt-4">Barcode: </p>
                        <input type="text" name="barcode" className="flex pl-2 bg-slate-800 rounded-xl border border-slate-500 mx-4" value={barcode}/>
                        <Link to={'inventory'} className="bg-amber-500 px-3 mx-auto mt-2 rounded-xl py-1 border-2 border-amber-600 text-black text-center">Change Filament</Link>
                    </div>
                    )}
            </div>
            <label htmlFor="details" className="flex pl-4 text-lg py-2" >Job Description: </label>
            <textarea name="details" className="flex text-lg w-11/12 mx-auto bg-slate-800/80 rounded-xl border border-slate-500 px-2"></textarea>
            <div className="w-full text-center pt-2 mb-4 mt-1">
                <button name="_action" value="submit" type="submit" className="rounded-xl border-2 border-amber-600 bg-amber-500 px-2 py-1 text-black">Submit</button>
            </div>
            </Form>
        </div>
        <Outlet />
        </div>
    );
}