import { LoaderFunctionArgs } from "react-router";
import { getColorsByMaterial } from "~/services/filament.server";

export const loader = async ({params, request}: LoaderFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams;
    const material = searchParams.get('material');
    const result = await getColorsByMaterial(material);
    return {result};
};