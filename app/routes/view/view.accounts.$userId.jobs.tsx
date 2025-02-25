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
            <div className="flex-col w-1/2 bg-slate-600 backdrop-blur-xs rounded-2xl shadow-xl px-6 py-2 relative border-2 border-slate-300 ">
                <h1 className="flex justify-center w-full text-center text-amber-500 text-xl">My Print Jobs</h1>
                <div className="flex w-full">
                {userJobs.map(x => (
                    <div className="w-fit bg-slate-800 rounded-xl border-2 border-slate-600 p-2">
                        <div className="flex"><p className="text-amber-500 ">Classification:</p><p className="ml-2">{x.classification}</p></div>
                        <div className="flex"><p className="text-amber-500 ">Printer: </p><p className="ml-2">{x.printer}</p></div>
                        <div className="flex"><p className="text-amber-500 ">Filament: </p><p className="ml-2">{x.barcode}</p></div>
                        <div className="flex"><p className="text-amber-500 ">Detials: </p><p className="ml-2">{x.details}</p></div>
                        <div className="flex-col w-full"><p className="text-amber-500 w-full">Job date: </p><p className="w-full">{x.date.toLocaleString("en-US", {hour12: false})}</p></div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}