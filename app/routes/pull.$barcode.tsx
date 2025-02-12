import { pullFromStockByBarcode } from "~/services/filament.server";

export const loader = async ({ request, params }) => {
    const barcode = params.barcode;
    const pulledInfo = await pullFromStockByBarcode(barcode);
    return pulledInfo;
}