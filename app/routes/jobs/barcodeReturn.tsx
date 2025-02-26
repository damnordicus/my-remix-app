import { getFilamentByBarcode } from "~/services/filament.server"

export const loader = async ({ request }) => {
    console.log("here")
    const search = new URL(request.url).searchParams;
    const barcode = search.get('barcode');
    console.log('barcode: ', barcode)
    const filament = await getFilamentByBarcode(barcode);
    console.log("filament: ", filament)
    return filament;
}