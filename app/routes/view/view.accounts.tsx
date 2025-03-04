import { TrashIcon } from "@heroicons/react/24/outline";
import { ActionFunctionArgs, Form, LoaderFunctionArgs, Outlet, useLoaderData, useNavigate } from "react-router";
import { userSession } from "~/services/cookies.server";
import { deleteUserAccount, getAllUsers } from "~/services/filament.server";

export const loader = async ({ request }: LoaderFunctionArgs ) => {
    const session = await userSession.parse(request.headers.get("Cookie")) || {};
    if( session.admin ){
        const allAccounts = await getAllUsers();
        return { allAccounts };
    }
    return {};
}

export const action = async ({ request }: ActionFunctionArgs ) => {
    const formData = await request.formData();
    const action = formData.get("_action");
    const userId = formData.get("userId") as string;
    if(action === 'delete'){
        await deleteUserAccount(+userId);
        return {message: "User account deleted!"};
    }
}

export default function Accounts () {
    const { allAccounts } = useLoaderData<typeof loader>();
    console.log(allAccounts)
    const navigate = useNavigate();

    function handleClick(id: number){
        navigate(`./${id}/jobs`);
    }

    return (
        <div className="flex w-full min-h-screen items-center justify-center">
            <div className="flex-col pt-5 gap-5 w-[600px] bg-slate-600 rounded-xl border-2 border-slate-400 shadow-xl">
            <table>
                <thead >
                    <tr className="border-b border-slate-500">
                        <th>
                            Username
                        </th>
                        <th>
                            Email
                        </th>
                        <th>
                            Phone
                        </th>
                        <th>
                            Delete
                        </th>
                    </tr>
                </thead>
            {allAccounts?.length && (
                allAccounts.map((account, index) => {
                    return(
                    <tr key={account.id} className={`text-center ${index < allAccounts.length -1 ? 'border-b-2 border-slate-400 ' : ''} hover:cursor-pointer hover:bg-slate-500`}>
                        <td>
                            {account.username}
                        </td>
                        <td>
                            {account.email}
                        </td>
                        <td>
                            {account.phone}
                        </td>
                        <td className="flex justify-center">
                        <Form method="POST">
                            <input type="hidden" name="userId" value={account.id} />
                            <button name="_action" value="delete" type="submit">
                                <TrashIcon className="size-6 text-red-400" />
                            </button>
                        </Form>
                        </td>
                    </tr>
                )})
            )}
            </table>
            </div>
            <Outlet />
        </div>
    );
}