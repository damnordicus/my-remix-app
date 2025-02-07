import { useNavigate } from "@remix-run/react";

export default function MainButton ({text, link}) {
    const navigate = useNavigate();

    return (
        <div 
        className="flex items-center justify-center w-[200px] h-[150px] bg-amber-500 bodrer border-4 border-amber-600 rounded-xl shadow-lg shadow-gray-800 "
        onClick={() => navigate(link)}>
            <p>{text}</p>
        </div>
    );
}

