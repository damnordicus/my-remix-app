import { data, LoaderFunctionArgs } from "react-router";
import { prisma } from "~/utils/db.server";

export const loader = async ({request}: LoaderFunctionArgs) => {
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
    
    console.log("barcode to return: ",barcode);
    return {message:"barocde updated"};
}