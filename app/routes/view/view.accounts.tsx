import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { ActionFunctionArgs, Form, LoaderFunctionArgs, Outlet, redirect, useActionData, useLoaderData, useNavigate } from "react-router";
import { userSession } from "~/services/cookies.server";
import { deleteUserAccount, getAllUsers } from "~/services/filament.server";
import * as OTPAuth from "otpauth"
import { flexRender, getCoreRowModel, RowExpanding, useReactTable } from "@tanstack/react-table";

export const loader = async ({ request }: LoaderFunctionArgs ) => {
    const session = await userSession.parse(request.headers.get("Cookie")) || {};
    if( session.admin ){
        const allAccounts = await getAllUsers();
        return { allAccounts, session };
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

        return {deleted: true};
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
    const { allAccounts, session } = useLoaderData<typeof loader>();
    const accounts = allAccounts?.filter(user => user.username !== session.username)
    const [showEdit, setShowEdit] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const actionData = useActionData();

    function phoneNumber(phone: number | string){
        const stringPhone = phone.toString();
        const formatted = `(${stringPhone.slice(0,3)}) ${stringPhone.slice(3,6)}-${stringPhone.slice(6,10)}`
        return formatted
    }

    useEffect(() => {
        if(actionData){
            setModalOpen(false);
            setShowEdit(false);
        }
    }, [actionData])

    function handleClick(id: number){
        setShowEdit((prev) => !prev);
        console.log(accounts)
        const local = accounts?.find(account => account.id === id)
        // const secret = (accounts?.find(account => account.id === localId))
        setSelectedAccount(local)
        console.log(local)
        
        // navigate(`./${id}/jobs`);
    }

    const columns = useMemo(() => [
        {
            accessorKey: 'username',
            header:'Username',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'edit',
            header: 'Edit',
            cell: ({ row }) => (
                <button name="_action" value="edit" type="submit" className="p-2 hover:bg-gray-500 hover:rounded-lg hover:cursor-pointer" onClick={(e) => {e.stopPropagation(); handleClick(row.id)}}><EllipsisVerticalIcon className="size-6 text-gray-200"/></button>
            ),
        }
    ], allAccounts);

    const table = useReactTable({
        data: allAccounts,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex-col w-full px-10 items-center justify-center">
            <div className="relative md:w-full lg:w-1/2 flex-col mt-20  overflow-scroll no-scrollbar text-slate-300 bg-gray-700 shadow-md rounded-xl bg-clip-border border-2 border-slate-400">
            <table className="w-full text-center text-white text-xl">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-500 border-b-2 border-slate-600" >
                    <tr className="text-center px-4">
                        <th className="py-3">
                            Username
                        </th>
                        <th className="">
                            Email
                        </th>
                        <th className="">
                            Phone
                        </th>
                        <th className="">
                            Edit
                        </th>
                    </tr>
                </thead>
            {accounts?.length && (
                accounts.map((account, index) => {
                    return(
                    <tr key={account.id} className={`text-center py-3 even:bg-slate-700 bg-slate-800 ${index < accounts.length -1 ? 'border-b-2 border-slate-400 ' : ''} hover:cursor-pointer hover:bg-slate-500`}>
                        <td className="text-center p-2">
                            {account.username}
                        </td>
                        <td className="text-center p-2">
                            {account.email}
                        </td>
                        <td className="text-center p-2">
                            {phoneNumber(account.phone)}
                        </td>
                        <td className="flex justify-center p-2 self-center">
                            <button name="_action" value="edit" type="submit" onClick={() => handleClick(account.id)} >
                                <EllipsisVerticalIcon className="size-6 text-gray-200" />
                            </button>
                        </td>
                    </tr>
                )})
            )}
            </table>
            {/* <table className="w-full text-center text-white text-xl">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-500 border-b-2 border-slate-600">
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id} className="text-center py-3">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className=" hover:bg-gray-600 cursor-pointer odd:bg-slate-800 text-gray-300" >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="text-center py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            </table> */}
            </div>
            {showEdit && <div className="md:w-full lg:w-1/2 mt-5 py-5 rounded-xl bg-slate-700 border-2 border-slate-400">
                <Form method="POST">
                    <input type="hidden" name="secret" value={selectedAccount.secret}/>
                    <input type="hidden" name="username" value={selectedAccount.username}/>
                    <div className="flex w-full justify-center text-2xl pb-4">
                        <p> Options for</p> <p className="italic pl-2 text-slate-300">{selectedAccount.username}:</p> 
                    </div>
                    <div className="flex w-full justify-around text-xl">
                        <button onClick={() => {
                            setModalOpen(true);
                        }} className=" px-4 py-4 rounded-xl border-2 border-red-700 bg-red-600 hover:bg-red-500 hover:cursor-pointer">Delete User Account</button>
                        <button name="_action" value="otpauth" type="submit" className=" px-4 py-2 rounded-xl border-2 border-green-700 bg-green-600 hover:bg-green-500 hover:cursor-pointer">Show OTPAuth QR</button>
                    </div>
                </Form>
                </div>}

                {modalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white border-3 border-slate-300 p-6 text-black rounded-lg shadow-xl text-center">
                        <h2 className="text-xl text-red-500 font-bold py-2">Confirm Deletion</h2>
                        <p>Are you sure you want to delete {selectedAccount?.username}</p>
                        <div className="mt-4 flex justify-center gap-4">
                        <Form method="post">
                            <input type="hidden" name="userId" value={selectedAccount?.id} />
                            <button name="_action" value="delete" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-red-400">Delete</button>
                        </Form>
                        <button onClick={() => setModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-300 hover:cursor-pointer">Cancel</button>
                        </div>
                    </div>
                    </div>
                )}
            <Outlet />
        </div>
    );
}