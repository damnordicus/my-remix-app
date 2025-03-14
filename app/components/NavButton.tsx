import { ReactNode } from "react";
import { NavLink } from "react-router";

export default function NavButton({to, children, isMobile}:{to: string; children: ReactNode, isMobile?: boolean}){
    return (
        <NavLink to={to} className={({ isActive }) => `h-full px-6 lg:py-4 md:py-7 justify-center self-center hover:bg-slate-600 ${isActive && !isMobile ? "text-slate-500 border-b-4 border-slate-300" : "text-slate-300"} ${isActive && isMobile ? "text-slate-500 border-t-4 border-slate-300" : "text-slate-300"}`}>
            {children}
        </NavLink>
    )
}