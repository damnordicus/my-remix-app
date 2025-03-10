import { Link, LoaderFunctionArgs, redirect, useLoaderData, useParams, useSearchParams } from "react-router";
import {generateQr} from "~/services/qr.server";
import {v4 as uuidv4 } from "uuid"
import { userSession } from "~/services/cookies.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const session = await userSession.parse(request.headers.get("Cookie"));
    //   if(!session.username) return redirect("..");
    const searchParams = new URL(request.url).searchParams;
    const uri = searchParams.get("uri") as string;

    try{
        const qrBuffer = await generateQr(uri, 'png')
        const qrBase64 = qrBuffer.toString('base64');
        return {qrBase64, uri};
    }catch(error){
        console.error("error generating qr code: ", error);
        return { qrBase64: null};
    }
   

    
}

export default function QRPage() {

    const { qrBase64, uri } = useLoaderData<typeof loader>();

    if (!uri) {
        return <p>Error: No QR code available.</p>;
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center backdrop-blur-sm">
            <h1 className="text-2xl mb-4">Scan This QR Code</h1>
            <div className="bg-white flex  rounded-xl border-10 border-slate-600 shadow-inner shadow-gray-400">
            <Link to=".."><img height={300} width={300} src={`data:image/png;base64,${qrBase64}`} alt="QR Code" /></Link>
            </div>
            <p className="mt-4 text-lg text-white">Click QR code after scanning</p>
        </div>
    );
}
