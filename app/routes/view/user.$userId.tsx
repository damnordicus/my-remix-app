import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Form, Link, LoaderFunctionArgs, useLoaderData } from "react-router"
import { getUserById, getUserByUsername } from "~/services/filament.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
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
        {profileData && <div className="flex w-full justify-center">
            <div className="bg-slate-700 w-3/4 mt-10 rounded-xl p-4">
                <h1 className="w-full text-center text-2xl text-amber-500">Profile</h1>
                <div className="inline-flex w-full gap-2">
                    <h2>Username: </h2>
                    <p>{profileData?.username}</p>
                    {profileData?.admin && <CheckBadgeIcon className="size-5 text-green-500"/>}
                </div>
                <div>
                    <Form method="POST" action="../logout">
                        <button type="submit" name="_action" value="submit">Log out</button>
                    </Form>
                </div>
            </div>
        </div>}
        </>
    );
}