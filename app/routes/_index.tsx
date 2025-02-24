import { useEffect } from "react";
import toast from "react-hot-toast";
import { ClientLoaderFunctionArgs, LoaderFunctionArgs, useLoaderData, useSearchParams } from "react-router";
import Layout from "~/components/Layout";
import MainButton from "~/components/MainButton";
import { userSession } from "~/services/cookies.server";

let showing = 0;

export const loader = async({request}: LoaderFunctionArgs) => {
  const session = await userSession.parse(request.headers.get("Cookie")) || {};
  return {user: session.username ?? null , admin: session.admin || false}
}

export default function Index() {
  const [searchParams, setSearchParams ] = useSearchParams();
  const {user, admin} = useLoaderData<typeof loader>();

  useEffect(() => {
    if( searchParams.get("success") === "true"){
      toast.success("Print job created!");
      showing = 1
    }
  }, [searchParams]);
  
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[465px] justify-center bg-slate-600/60 border-2 border-slate-500 backdrop-blur-xs rounded-xl flex flex-row flex-wrap items-center  gap-4 p-4">
        <MainButton text="View Stock" link="inventory" />
        <MainButton text="Register New User" link="register"/>
        <MainButton text="Return Filament" link="return"/>
        {!user && <MainButton text="Login" link="job/auth"/>}
        {user && 
        <>
          <MainButton text="Create Job" link={`${user ? 'job/create': 'job/auth'}`}/>
          <MainButton text={`${admin ? 'View All Jobs' : 'My Print Jobs'}`} link=""/>
        </>}
        {admin && 
        <>
          <MainButton text="Create Barcode" link="generateBarcode"/>
          <MainButton text="View All Users" link="view/accounts"/>
        </>}
      </div>   
    </div>
  );
}
