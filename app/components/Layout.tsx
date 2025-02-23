import React from "react";
import { Form, Link, LoaderFunctionArgs, useLoaderData } from "react-router";
import { userSession } from "~/services/cookies.server";

export default function Layout({ children, backgroundUrl, user }: { children: React.ReactNode, backgroundUrl: string, user: string | null}) {


    return (
      <div
        style={{
          backgroundImage: `url('${backgroundUrl}')`,
          backgroundSize: "cover",
        }}
        className="min-h-screen "
      >
      <div className="fixed flex w-full justify-between">
        <div className="bg-slate-800 w-[300px] h-[35px] rounded-ee-2xl border-b-4 border-r-4 border-slate-600 hover:bg-slate-500">
         <p className="bg-opacity-0 text-white text-xl pl-3">
          <Link to="/">Filament Inventory Manager</Link>
          </p>
        </div>
      <div>
      {user ? (
        <Form method="POST" action="/logout" >
          <button type="submit" className=" bg-red-400/50 border-b-4 border-l-4 border-red-600 text-lg text-white/80 px-2 rounded-es-xl hover:bg-red-400 hover:cursor-pointer">Logout</button>
        </Form>
      ):null}
      </div>
      </div>
        {children}
      </div>
  );
}