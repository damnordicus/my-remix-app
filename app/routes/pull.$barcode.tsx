import { redirect } from "react-router";
import { userSession } from "~/services/cookies.server";
import { pullFromStockByBarcode } from "~/services/filament.server";

export const loader = async ({ request, params }) => {
    const session = await userSession.parse(request.headers.get("Cookie"));
      if(!session.username) return redirect("..");
    const barcode = params.barcode;
    const pulledInfo = await pullFromStockByBarcode(barcode);
    return pulledInfo;
}