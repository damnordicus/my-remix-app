import { data, LoaderFunctionArgs, redirect } from "react-router";
import { userSession } from "~/services/cookies.server";
import { prisma } from "~/utils/db.server";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const session = await userSession.parse(request.headers.get("Cookie"));
      if(!session.username) return redirect("..")
    const searchParams = new URL(request.url).searchParams;
    const barcode = searchParams.get("barcode");

    if(!barcode) return data({ message: "Barcode required" },{status: 400})

    await prisma.roll.update({
        where:{
            barcode,
        },
        data:{
            inUse: false,
        },
    });
    
    return {message:"barocde updated"};
}