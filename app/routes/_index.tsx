import { useEffect } from "react";
import toast from "react-hot-toast";
import { ClientLoaderFunctionArgs, useLoaderData, useSearchParams } from "react-router";
import Layout from "~/components/Layout";
import MainButton from "~/components/MainButton";

let showing = 0;
export default function Index() {
  const [searchParams, setSearchParams ] = useSearchParams();

  useEffect(() => {
    if( searchParams.get("success") === "true"){
      toast.success("Print job created!");
      showing = 1
    }
  }, [searchParams]);
  
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[465px] justify-center bg-slate-600/60 border-2 border-slate-500 backdrop-blur-xs rounded-xl flex flex-row flex-wrap items-center  gap-4 p-4">
        {/* <MainButton text="Pull From Stock" link="pull"/>
        <MainButton text="Return To Stock" link="returnFilament"/> */}
        <MainButton text="View Stock" link="inventory" />
        <MainButton text="Create Job" link="job/auth"/>
      </div>   
      </div>
  );
}
