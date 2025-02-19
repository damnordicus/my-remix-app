import { data, Form, Outlet, redirect, useLoaderData, useNavigate } from "react-router";
import { request } from "https";
import { getAllUsers, loginWithPassword } from "~/services/filament.server";
import InputDropDown from "~/components/InputDropDown";
import { useState } from "react";

export const loader = async () => {
  const getUsers = await getAllUsers();
  return {getUsers};
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "submit") {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    //if(!username || !password) return 
    //const login = await loginWithPassword(username, password);
    //return {login};
    return redirect(`/job/create`);
  } else {
    return null;
  }
};

export default function PrintJob() {
  const { getUsers } = useLoaderData<typeof loader>(); 

  console.log(getUsers)

  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <div className="flex-col pt-5 gap-5 w-[400px] bg-slate-600/60 rounded-xl border-2 border-slate-400 shadow-xl">
          <h1 className="text-2xl text-center text-amber-500">
            Print Job Login
          </h1>
          <Form className="flex-col w-full items-center justify-center px-5 pb-5 gap-2 text-lg" method="POST">
              <div className="flex-col w-full">
                <InputDropDown labelText="Username: " options={getUsers} setSelectedOption={() => null}/>
                {/* <label htmlFor="username" className="">
                  Username:
                </label>
                <select></select> */}
                {/* <input
                  type="text"
                  name="username"
                  className="bg-slate-800/60 px-3 py-1.5 rounded-lg"
                /> */}
              </div>
              {/* <div className="flex-col w-full gap-1">
                <label htmlFor="password" className="">
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  className="bg-slate-800/60 px-3 py-1.5 rounded-lg"
                />
              </div> */}
              <button type="submit" name="_action" value="submit" className="rounded-xl border-2 border-amber-400/60 bg-amber-600 hover:cursor-pointer hover:border-amber-600/60 hover:bg-amber-400 hover:text-amber-900 w-full px-2 py-1 mt-6 mb-2 text-white">
                Login
              </button>
          </Form>
        </div>
        
    </div>
  );
}
