import { useEffect } from "react";
import toast from "react-hot-toast";
import { ClientLoaderFunctionArgs, LoaderFunctionArgs, useLoaderData, useSearchParams } from "react-router";
import Layout from "~/components/Layout";
import MainButton from "~/components/MainButton";
import { userSession } from "~/services/cookies.server";


export const loader = async({request}: LoaderFunctionArgs) => {
  const session = await userSession.parse(request.headers.get("Cookie")) || {};

  fetch(`https://travisspark.atlassian.net/rest/api/3/search?jql=project%20%3D%20%22Additive%20Manufacturing%22%20AND%20%22Contact%20Full%20Name%5BShort%20text%5D%22%20~%20'ignore-me'`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        `adam.nord@travisspark.com:${import.meta.env.VITE_JIRA_API_KEY}`
      ).toString('base64')}`,
      'Accept': 'application/json'
    }
  })
    .then(response => {
      console.log(
        `Response: ${response.status} ${response.statusText}`
      );
      return response.text();
    })
    .then(text => console.log(text))
    .catch(err => console.error(err));
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
