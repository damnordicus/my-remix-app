import { redirect } from "react-router";
import { userSession } from "~/services/cookies.server";
import { getFilamentByBarcode } from "~/services/filament.server"

export const loader = async ({ request }) => {
    const session = await userSession.parse(request.headers.get("Cookie"));
    //   if(!session.username) return redirect("..")
    
    const search = new URL(request.url).searchParams;
    const barcode = search.get('barcode');
    const filament = await getFilamentByBarcode(barcode);
    return filament;
}