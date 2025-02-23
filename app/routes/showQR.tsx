import { LoaderFunctionArgs, useLoaderData, useSearchParams } from "react-router";
import {generateQr} from "~/services/qr.server";
import {v4 as uuidv4 } from "uuid"

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams;
    const uri = searchParams.get("uri") as string;

    try{
        const qrBuffer = await generateQr(uri, 'png')
        const qrBase64 = qrBuffer.toString('base64');
        return {qrBase64};
    }catch(error){
        console.error("error generating qr code: ", error);
        return { qrBase64: null};
    }
   

    
}

export default function QRPage() {
    const [searchParams] = useSearchParams();
    const uri = searchParams.get("uri");

    const { qrBase64 } = useLoaderData<typeof loader>();

    if (!uri) {
        return <p>Error: No QR code available.</p>;
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl mb-4">Scan This QR Code</h1>
            <div className="bg-white flex p-2 rounded-xl border-6 border-slate-400 shadow-inner shadow-gray-400">
            <img src={`data:image/png;base64,${qrBase64}`} alt="QR Code" />
            </div>
            <p className="mt-4 text-sm text-white">Scan this in your authenticator app</p>
        </div>
    );
}
