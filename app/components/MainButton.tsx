import { Link, useNavigate } from "@remix-run/react";

export default function MainButton ({text, link}) {

    return (
        <Link 
        className="flex items-center justify-center w-[200px] h-[150px] bg-slate-500 bodrer border-2 border-slate-400 rounded-xl shadow-lg shadow-gray-800 "
        to={link}>
            <p>{text}</p>
        </Link>
    );
}

