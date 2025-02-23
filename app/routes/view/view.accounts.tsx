import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { userSession } from "~/services/cookies.server";
import { getAllUsers } from "~/services/filament.server";

export const loader = async ({ request }: LoaderFunctionArgs ) => {
    const session = await userSession.parse(request.headers.get("Cookie")) || {};
    if( session.admin ){
        const allAccounts = await getAllUsers();
        return { allAccounts };
    }
    return {};
}

export default function Accounts () {
    const { allAccounts } = useLoaderData<typeof loader>();

    return (
        <div className="flex w-full min-h-screen items-center justify-center">
            <div className="flex-col pt-5 gap-5 w-[400px] bg-slate-600/60 rounded-xl border-2 border-slate-400 shadow-xl">
            {allAccounts?.length && (
                allAccounts.map(account => (
                    <p>{account.username}</p>
                ))
            )}
            </div>
        </div>
    );
}