import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { ActionFunctionArgs, Form, LoaderFunctionArgs, Outlet, redirect, useLoaderData, useNavigate } from "react-router";
import { userSession } from "~/services/cookies.server";
import { deleteUserAccount, getAllUsers } from "~/services/filament.server";
import * as OTPAuth from "otpauth"

export const loader = async ({ request }: LoaderFunctionArgs ) => {
    const session = await userSession.parse(request.headers.get("Cookie")) || {};
    if( session.admin ){
        const allAccounts = await getAllUsers();
        return { allAccounts };
    }
    if(!session.username) return redirect("..")
    return {};
}

export const action = async ({ request }: ActionFunctionArgs ) => {
    const formData = await request.formData();
    const action = formData.get("_action");
    const userId = formData.get("userId") as string;
    const otpauth = formData.get("secret") as string;
    const username =formData.get("username") as string;
    if(action === 'delete'){
        await deleteUserAccount(+userId);

        return {message: "User account deleted!"};
    }
    if(action === 'otpauth'){
        const totp = new OTPAuth.TOTP({
                        issuer: "Filament Inventory Manager",
                        label: username,
                        algorithm: "SHA1",
                        digits: 6,
                        period: 30,
                        secret: otpauth,
                    });
        const totpString = totp.toString();
        return redirect(`../showQR?uri=${encodeURIComponent(totpString)}`)
    }
}

export default function Accounts () {
    const { allAccounts } = useLoaderData<typeof loader>();
    console.log(allAccounts)
    const navigate = useNavigate();
    const [showEdit, setShowEdit] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState("");

    function handleClick(id: number){
        const secret = (allAccounts?.find(account => account.id === id))
        setSelectedAccount(secret)
        setShowEdit(!showEdit);
        // navigate(`./${id}/jobs`);
    }

    return (
        <div className="flex-col w-full items-center justify-center">
            <div className="relative flex flex-col mt-20  overflow-scroll text-slate-300 bg-gray-700 shadow-md rounded-lg bg-clip-border border-2 border-slate-400">
            <table className="w-full text-center table-auto min-w-max text-white">
                <thead >
                    <tr className="text-slate-300 border-b border-slate-300 bg-gray-900">
                        <th className="p-4">
                            Username
                        </th>
                        <th className="p-4">
                            Email
                        </th>
                        <th className="p-4">
                            Phone
                        </th>
                        <th className="p-4">
                            Edit
                        </th>
                    </tr>
                </thead>
            {allAccounts?.length && (
                allAccounts.map((account, index) => {
                    return(
                    <tr key={account.id} className={`text-center ${index < allAccounts.length -1 ? 'border-b-2 border-slate-400 ' : ''} hover:cursor-pointer hover:bg-slate-500`}>
                        <td className="p-2">
                            {account.username}
                        </td>
                        <td className="p-2">
                            {account.email}
                        </td>
                        <td className="p-2">
                            {account.phone}
                        </td>
                        <td className="flex justify-center p-2 self-center">
                        {/* <Form method="POST"> */}
                            {/* <input type="hidden" name="userId" value={account.id} /> */}
                            <button name="_action" value="edit" type="submit" onClick={() => handleClick(account.id)} >
                                <EllipsisVerticalIcon className="size-6 text-gray-200" />
                            </button>
                        {/* </Form> */}
                        </td>
                    </tr>
                )})
            )}
            </table>
            </div>
            {showEdit && <div className="flex-col w-1/2 bg-slate-600 h-[300px] mt-5 rounded-xl">
                <Form method="POST">
                    <div className="flex w-full justify-center"><button name="_action" value="delete" type="submit" className="mt-6 px-4 py-2 rounded-xl border-2 border-red-700 bg-red-600 ">Delete User Account</button></div>
                    <input type="hidden" name="secret" value={selectedAccount.secret}/>
                    <input type="hidden" name="username" value={selectedAccount.username}/>
                    <div className="flex w-full justify-center"><button name="_action" value="otpauth" type="submit" className="mt-6 px-4 py-2 rounded-xl border-2 border-green-700 bg-green-600 ">Show OTPAuth QR</button></div>
                </Form>
                </div>}
            <Outlet />
        </div>
    );
}