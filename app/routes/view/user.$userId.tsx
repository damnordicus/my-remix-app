import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Form, Link, LoaderFunctionArgs, redirect, useLoaderData } from "react-router"
import { userSession } from "~/services/cookies.server";
import { getUserById, getUserByUsername } from "~/services/filament.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const session = await userSession.parse(request.headers.get("Cookie"));
      if(!session.username) return redirect("..");
    const userId = params.userId;
    if(!userId){
        return {}
    }
    const profileData = await getUserById(+userId)
    return {profileData}
}

export default function Profile () {
    const { profileData } = useLoaderData<typeof loader>();
    return (
        <>
        {profileData && <div className="mt-0 lg:mt-15 flex w-full justify-center ">
            <div className="bg-slate-700 w-3/4 mt-10 rounded-xl p-4 border-2 border-slate-400 ">
                <h1 className="w-full text-center text-2xl text-amber-500">Profile</h1>
                <div className="justify-center inline-flex w-full gap-2 pt-4 pb-6 text-xl">
                    <h2>Username: </h2>
                    <p className="">{profileData?.username}</p>
                    {profileData?.admin && <CheckBadgeIcon className="size-5.5 text-blue-500 self-center"/>}
                </div>
                <div className="flex w-full justify-center gap-2">
                    {profileData.admin && <Link to={"../view/accounts"} className="px-4 py-2 bg-slate-500 border-2 border-slate-400 rounded-xl hover:cursor-pointer hover:bg-amber-600">View All Users</Link>}
                    <Form method="POST" action="../logout">
                        <button type="submit" name="_action" value="submit" className="bg-slate-500 px-4 py-1.5 text-lg rounded-xl border-2 border-slate-400 text-white hover:bg-red-500 hover:cursor-pointer">Log out</button>
                    </Form>
                </div>
            </div>
        </div>}
        </>
    );
}