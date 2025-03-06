import { LoaderFunctionArgs, redirect } from "react-router";
import { userSession } from "~/services/cookies.server";
import { getBrandsByColor, getColorsByMaterial } from "~/services/filament.server";

export const loader = async ({params, request}: LoaderFunctionArgs) => {
    const session = await userSession.parse(request.headers.get("Cookie"));
      if(!session.username) return redirect("..")
    const searchParams = new URL(request.url).searchParams;
    const color = searchParams.get('color');
    const material = searchParams.get('material');
    const result = await getBrandsByColor(material, color);
    return {result};
};