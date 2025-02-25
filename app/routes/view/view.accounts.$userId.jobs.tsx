import { useLoaderData } from "react-router";
import { getJobsByUserId } from "~/services/filament.server";

export const loader = async ({ request, params }) => {
    const userId = params.userId;

    const userJobs = await getJobsByUserId(+userId);
    return {userJobs}
}

export default function UserJobs(){
    const { userJobs } = useLoaderData<typeof loader>();
    console.log(userJobs)

    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
            <div className="flex-col w-400 bg-slate-700/60 backdrop-blur-xs rounded-2xl shadow-xl px-6 py-2 relative border-2 border-slate-300 ">
                <h1 className="flex justify-center w-full text-center text-amber-500 text-xl">My Print Jobs</h1>
                <div className="grid grid-cols-3 gap-2">
                {userJobs.map(x => (
                    <div key="" className="grid grid-cols-[auto_1fr] bg-slate-800 rounded-xl border-2 border-slate-500 p-2">
                        <h2 className="text-green-500 ">Classification:</h2><p className="ml-2 inline">{x.classification}</p>
                        <h2 className="text-amber-500  text-end">Printer:</h2><p className="ml-2 inline" >{x.printer}</p>
                        <h2 className="text-amber-500 text-end ">Job date:</h2><p className="ml-2 inline">{x.date.toLocaleString("en-US", {hour12: false})}</p>
                        <hr className="col-span-2 my-2 border-slate-400/60"/>
                        <h2 className="text-amber-500 ">Filament:</h2><p className="ml-2 col-span-2">{x.barcode}</p>
                        <h2 className="text-amber-500">Detials:</h2><p className="ml-2 col-span-2">{x.details}</p>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}