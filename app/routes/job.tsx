import { data, Form, LoaderFunctionArgs, Outlet, redirect, useFetcher, useLoaderData, useNavigate } from "react-router";
import { request } from "https";
import { getAllUsers, getUserByUsername, loginWithPassword } from "~/services/filament.server";
import InputDropDown from "~/components/InputDropDown";
import { useEffect, useState } from "react";
import * as OTPAuth from "otpauth"
import { userSession } from "~/services/cookies.server";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const session = await userSession.parse(request.headers.get("Cookie")) || {};


  const getUsers = await getAllUsers();

  return {getUsers, user: session.username ?? null};
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

      const username = formData.get("username") as string;
      const otp = formData.get("otp") as string;
  
      if(!username || !otp){
          return {error: "Username and otp are required"};
      }
      
      const user = await getUserByUsername(username);
  
      if(!user || !user.secret) {
          return {error: "Invalid user or OTP secret missing"};
      }
  
      const totp = new OTPAuth.TOTP({
          issuer:"Filament Inventory Manager",
          label: username,
          algorithm: "SHA1",
          digits: 6,
          period: 30,
          secret: user.secret,
      });
      const expectedToken = totp.generate();

      const isValid = totp.validate({ token: otp, window: 1 }) !== null;
      if(!isValid) {
          return { error: "Invalid OTP code"};
      }

      const headers = new Headers();
      headers.append("Set-Cookie", await userSession.serialize({ username: user.username, id: user.id, admin: user.admin }));
  
      return redirect("../job/create", { headers });
};

export default function PrintJob() {
  const { getUsers, user } = useLoaderData<typeof loader>(); 

  const [ selectedUser, setSelectedUser] = useState('');

  console.log(getUsers)

  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <div className="flex-col pt-5 gap-5 w-[400px] bg-slate-600/60 backdrop-blur-sm rounded-xl border-2 border-slate-400 shadow-xl">
          <h1 className="text-2xl text-center text-amber-500">
            Print Job Login
          </h1>
          <Form className="flex-col w-full items-center justify-center px-5 pb-5 gap-2 text-lg" method="POST">
              <div className="flex-col w-full">
                {getUsers.length > 0 &&
                <>
                  <InputDropDown labelText="Username" options={getUsers} setSelectedOption={setSelectedUser}/>
                  <div className="flex-col w-full px-4 py-2">
                    <label htmlFor="otp" className="w-full pb-2">Enter Code: </label>
                    <input type="text" name="otp" className="bg-slate-800/60 border border-slate-500 rounded-xl py-[1px]"/>
                  </div>
                </>
                }
                {getUsers.length === 0 && <p>No users found.</p>}
                {/* <input type='hidden' name="username" value={selectedUser}/> */}
              </div>
              
              <button type="submit" name="_action" value="submit" className="rounded-xl border-2 border-amber-400/60 bg-amber-600 hover:cursor-pointer hover:border-amber-600/60 hover:bg-amber-400 hover:text-amber-900 w-full px-2 py-1 mt-6 mb-2 text-white">
                Login
              </button>
          </Form>
        </div>
        
    </div>
  );
}
