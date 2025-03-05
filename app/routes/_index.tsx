import { useEffect } from "react";
import toast from "react-hot-toast";
import { ClientLoaderFunctionArgs, LoaderFunctionArgs, useLoaderData, useSearchParams } from "react-router";
import Layout from "~/components/Layout";
import MainButton from "~/components/MainButton";
import { userSession } from "~/services/cookies.server";


export const loader = async({request}: LoaderFunctionArgs) => {
  const session = await userSession.parse(request.headers.get("Cookie")) || {};
  return {user: session.username ?? null , admin: session.admin || false}
}

export default function Index() {
  const [searchParams, setSearchParams ] = useSearchParams();
  const {user, admin} = useLoaderData<typeof loader>();

  useEffect(() => {
    switch(searchParams.get("success")){
      case "job":
        toast.success("Print job created!");
        setTimeout(() => {
          setSearchParams({}, {replace: true});
        }, 2000);
        break;
      case "return":
        toast.success("Filament returned!");
        setTimeout(() => {
          setSearchParams({}, { replace: true});
        }, 2000);
        break;
      case "newuser":
        toast.success("User Registered!");
        setTimeout(() => {
          setSearchParams({}, {replace: true});
        }, 2000);
        break;
      case "rollCreate":
        toast.success("Filamnent profile created!");
        setTimeout(() => {
          setSearchParams({}, {replace: true});
        }, 2000);
        break;
    }

    switch(searchParams.get("fail")){
      case "job":
        toast.error("Print job not created!");
        setTimeout(() => {
          setSearchParams({}, {replace: true});
        }, 2000);
        break;
      case "return":
        toast.error("Could not return filament!");
        setTimeout(() => {
          setSearchParams({}, { replace: true});
        }, 2000);
        break;
      case "newuser":
        toast.error("User not created!");
        setTimeout(() => {
          setSearchParams({}, {replace: true});
        }, 2000);
        break;
    }
  }, [searchParams]);
  
  return (
    // <div className="h-screen flex items-center justify-center">
    //   <div className="w-[465px] justify-center bg-slate-600/60 border-2 border-slate-500 backdrop-blur-xs rounded-xl flex flex-row flex-wrap items-center  gap-4 p-4">
    //     <MainButton text="View Stock" link="inventory" />
    //     <MainButton text="Register New User" link="register"/>
    //     <MainButton text="Return Filament" link="return"/>
    //     {!user && <MainButton text="Login" link="job/auth"/>}
    //     {user && 
    //     <>
    //       <MainButton text="Create Job" link={`${user ? 'job/create': 'job/auth'}`}/>
    //       <MainButton text='My Print Jobs' link="view/jobs"/>
    //     </>}
    //     {admin && 
    //     <>
    //       {/* <MainButton text="Create Barcode" link="generateBarcode"/> */}
    //       <MainButton text="View All Users" link="view/accounts"/>
    //     </>}
    //   </div>   
    // </div>
    <></>
  );
}
