import { LoaderFunctionArgs } from "react-router";
import { getBrandsByColor, getColorsByMaterial } from "~/services/filament.server";

export const loader = async ({params, request}: LoaderFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams;
    const color = searchParams.get('color');
    const material = searchParams.get('material');
    console.log('input: ', color, ' ', material)
    const result = await getBrandsByColor(material, color);
    return {result};
};