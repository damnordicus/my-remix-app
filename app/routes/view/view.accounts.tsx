import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router";
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
    const navigate = useNavigate();

    function handleClick(index: number){
        navigate('view/jobs');
    }

    return (
        <div className="flex w-full min-h-screen items-center justify-center">
            <div className="flex-col pt-5 gap-5 w-[600px] bg-slate-600/60 rounded-xl border-2 border-slate-400 shadow-xl">
            <table>
                <thead>
                    <tr >
                        <th>
                            Username
                        </th>
                        <th>
                            Email
                        </th>
                        <th>
                            Phone
                        </th>
                    </tr>
                </thead>
            {allAccounts?.length && (
                allAccounts.map((account, index) => {
                    return(
                    <tr key={index} className={`text-center ${index < allAccounts.length -1 ? 'border-b-2 border-slate-400 ' : ''} hover:cursor-pointer hover:bg-slate-500`} onClick={() => handleClick(index)}>
                        <td>
                            {account.username}
                        </td>
                        <td>
                            {account.email}
                        </td>
                        <td>
                            {account.phone}
                        </td>
                    </tr>
                )})
            )}
            </table>
            </div>
        </div>
    );
}