import { BriefcaseIcon, CameraIcon, ClipboardDocumentListIcon, PlusIcon, UserIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router";
import NavButton from "./NavButton";

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
        <nav className=" flex w-full relative items-center">
        <Link to="/" className="text-white text-2xl font-bold absolute">
          Filament Inventory Manager
        </Link>
        <ul className="flex w-full gap-6 justify-center">
          <li>
          <NavButton to="inventory">
            Inventory
          </NavButton>
          </li>
          <li>
          <NavButton to="return">
            Return Filament
          </NavButton>
          </li>
          {user?.id && (
            <>
            <li>
              <NavButton to="view/jobs">
                View Jobs
              </NavButton></li>
              <li><NavButton to="job/create">
                Create Job
              </NavButton></li>
            </>
          )}
          <li>
          <NavButton to={user?.id ? `view/${user.id}` : `job/auth?from=login`}>
            {user?.id ? 'Profile' : 'Login' }
          </NavButton></li>
        </ul>
        </nav>
      </div>
      <div className="lg:hidden fixed bottom-0 flex w-full justify-around bg-slate-800 h-[100px] z-2">
        {/* <Link to="/"><div className="bg-slate-800 w-[300px] h-[35px] rounded-ee-2xl border-b-4 border-r-4 border-slate-600 hover:bg-slate-500">
          <p className="bg-opacity-0 text-white text-xl pl-3">
            Filament Inventory Manager
          </p>
        </div></Link> */}
        <NavButton to={"inventory"} isMobile={true}>
          <ClipboardDocumentListIcon className="size-8 "/>
        </NavButton>

        <NavButton to={"return"} isMobile={true}>
          <CameraIcon className="size-8"/>
        </NavButton>
        {user.id && <NavButton to={"view/jobs"} isMobile={true}>
          <BriefcaseIcon className="size-8 "/>
        </NavButton>}
        {user.id && <NavButton to={"job/create"} isMobile={true}>
          <PlusIcon className="size-8 "/>
        </NavButton>}
        <NavButton to={user.id ? `view/${user.id}`: `job/auth?from=login`} isMobile={true}>
          <UserIcon className="size-8 "/>
        </NavButton>
      
      </div>
        {children}
      </div>
  );
}