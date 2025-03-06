import { LoaderFunctionArgs, redirect } from "react-router";
import { userSession } from "~/services/cookies.server";
import { getColorsByMaterial } from "~/services/filament.server";

export const loader = async ({params, request}: LoaderFunctionArgs) => {
    const session = await userSession.parse(request.headers.get("Cookie"));
      if(!session.username) return redirect("..")
    const searchParams = new URL(request.url).searchParams;
    const material = searchParams.get('material');
    const result = await getColorsByMaterial(material);
    return {result};
};