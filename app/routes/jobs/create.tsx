import { CameraIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link, Outlet } from "react-router";
import InputDropDown from "~/components/InputDropDown";
import { LoaderFunctionArgs } from "react-router";

export async function loader({request}: LoaderFunctionArgs) {
    // check request.headers.cookie for userId or sessionid
    // potentially verify in db
    // if not in either redirect back to login
}

export default function PrintJobForm() {
    const options = ["Left XL", "Right XL", "Left MK4", "Right MK4", "MK3 1", "MK3 2", "MK3 3", "MK3 4", "MK3 5", "MK3 6"];
    const [ selectedCategory, setSelectedCategory] = useState('');
    const [ selectedPrinter, setSelectedPrinter] = useState('');
    const [ selectedFilament, setSelectedFilament] = useState('');


    return (
        <div className="flex w-full min-h-screen items-center justify-center">
         <div className="flex-col pt-5 gap-2 w-[400px] bg-slate-600/60 rounded-xl border-2 border-slate-400 shadow-xl">
            <h1 className="text-2xl text-center text-amber-500">
                Job Details
            </h1>
            <InputDropDown labelText={"Job For: "} options={["Mission", "Personal"]} setSelectedOption={setSelectedCategory}/>
            <InputDropDown labelText={"Select Printer: "} options={options} setSelectedOption={setSelectedPrinter}/>
            <div className="flex-col w-full">
                <label htmlFor="printerSelect" className="flex pl-4 pb-2 text-lg" >Select Filament: </label>
                <div className="flex justify-center gap-4">
                <Link to={`inventory`} className="bg-amber-500 px-2 rounded-xl py-1 border-2 border-amber-600 text-amber-900 text-center"><CameraIcon className="size-6"/></Link>
                <Link to={`/job/${2}/stock`}className="bg-amber-500 px-3 rounded-xl py-1 border-2 border-amber-600 text-black text-center" >Search Filament</Link>
                </div>
            </div>
            <label htmlFor="description" className="flex pl-4 text-lg" >Job Description: </label>
            <textarea name="description" className="flex text-lg w-11/12 mx-auto bg-slate-800/80 rounded-xl border border-slate-500 "></textarea>
            <div className="w-full text-center pt-2 mb-4 mt-1">
                <button className="rounded-xl border-2 border-amber-600 bg-amber-500 px-2 py-1 text-black">Submit</button>
            </div>
        </div>
        <Outlet />
        </div>
    );
}