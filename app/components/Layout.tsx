import { Link } from "react-router";

export default function Layout({ children, backgroundUrl }) {
    return (
      <div
        style={{
          backgroundImage: `url('${backgroundUrl}')`,
          backgroundSize: "cover",
        }}
        className="min-h-screen "
      >
      <div className="bg-slate-800 w-[300px] h-[35px] rounded-ee-2xl border-b-4 border-r-4 border-slate-600">
      <p className="bg-opacity-0 text-white text-xl pl-3 ">
        <Link to="/">Filament Inventory Manager</Link>
      </p>
      </div>
        {children}
      </div>
    );
  }