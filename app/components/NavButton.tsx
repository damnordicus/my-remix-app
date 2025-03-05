import { ReactNode } from "react";
import { NavLink } from "react-router";

export default function NavButton({to, children}:{to: string; children: ReactNode}){
    return (
        <NavLink to={to} className={({ isActive }) => `h-full px-6 py-7 justify-center self-center ${isActive ? "text-slate-500 border-t-5" : "text-slate-300"}`}>
            {children}
        </NavLink>
    )
}