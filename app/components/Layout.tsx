import { BriefcaseIcon, CameraIcon, ClipboardDocumentListIcon, HomeIcon, PlusIcon, UserIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Form, Link, LoaderFunctionArgs, NavLink, useLoaderData } from "react-router";
import { userSession } from "~/services/cookies.server";
import NavButton from "./NavButton";
import Inventory from "~/routes/inventory";

// export const loader = async({request}: LoaderFunctionArgs) => {
//   const session = await userSession.parse(request.headers.get("Cookie")) || {};
//   return {user: session.username ?? null , admin: session.admin || false}
// }

export default function Layout({ children, backgroundUrl, user }: { children: React.ReactNode, backgroundUrl: string, user: string | null}) {
  console.log(user)

    return (
      <div
        style={{
          backgroundImage: `url('${backgroundUrl}')`,
          backgroundSize: "cover",
        }}
        className="min-h-screen "
      >
      <div className="lg:hidden fixed bottom-0 flex w-full justify-around bg-slate-800 h-[100px] z-2">
        {/* <Link to="/"><div className="bg-slate-800 w-[300px] h-[35px] rounded-ee-2xl border-b-4 border-r-4 border-slate-600 hover:bg-slate-500">
          <p className="bg-opacity-0 text-white text-xl pl-3">
            Filament Inventory Manager
          </p>
        </div></Link> */}
        <NavButton to={"inventory"}>
          <ClipboardDocumentListIcon className="size-8 "/>
        </NavButton>

        <NavButton to={"return"} >
          <CameraIcon className="size-8"/>
        </NavButton>
        <NavButton to={"view/jobs"}>
          <BriefcaseIcon className="size-8 "/>
        </NavButton>
        <NavButton to={user.id ? "job/create" : "job/auth"}>
          <PlusIcon className="size-8 "/>
        </NavButton>
        <NavButton to={user.id ? `view/${user.id}`: 'job/auth'}>
          <UserIcon className="size-8 "/>
        </NavButton>
      
      </div>
        {children}
      </div>
  );
}