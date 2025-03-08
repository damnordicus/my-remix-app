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
       {/* Desktop Navigation */}
       <div className="hidden lg:flex fixed top-0 w-full justify-between bg-slate-800 h-[60px] px-6 items-center z-10">
        <Link to="/" className="text-white text-2xl font-bold">
          Filament Inventory Manager
        </Link>
        <div className="flex gap-6 ">
          <NavButton to="inventory">
            <p className="">Inventory</p>
          </NavButton>
          <NavButton to="return">
            <p className=" w-fit">Return Filament</p>
          </NavButton>
          {user?.id && (
            <>
              <NavButton to="view/jobs">
                <p className=" w-fit">View Jobs</p>
              </NavButton>
              <NavButton to="job/create">
                <p className=" w-fit">Create Job</p>
              </NavButton>
            </>
          )}
          <NavButton to={user?.id ? `view/${user.id}` : `job/auth?from=login`}>
            {user?.id ? <p>Profile</p> : <p>Login</p> }
          </NavButton>
        </div>
      </div>
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
        {user.id && <NavButton to={"view/jobs"}>
          <BriefcaseIcon className="size-8 "/>
        </NavButton>}
        {user.id && <NavButton to={"job/create"}>
          <PlusIcon className="size-8 "/>
        </NavButton>}
        <NavButton to={user.id ? `view/${user.id}`: `job/auth?from=login`}>
          <UserIcon className="size-8 "/>
        </NavButton>
      
      </div>
        {children}
      </div>
  );
}