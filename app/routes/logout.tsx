import { redirect } from "react-router";
import { userSession } from "~/services/cookies.server";

export const action = async () => {
    return redirect("../inventory", {
        headers: {
            "Set-Cookie": await userSession.serialize("", { maxAge: 0 }),
        },
    });
};