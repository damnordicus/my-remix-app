import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout";
import MainButton from "~/components/MainButton";


export default function Index() {

  
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[465px] h-[360px] justify-center bg-slate-600 border-2 border-slate-500 bg-opacity-60 backdrop-blur-sm rounded-xl flex flex-row flex-wrap items-center  gap-4 p-4">
        <MainButton text="Pull From Stock" link="pullFilament"/>
        <MainButton text="Return To Stock" link="returnFilament"/>
        <MainButton text="View Stock" link="inventory" />
        <MainButton text="Create Barcode" link="barcode"/>
      </div>   
      </div>
  );
}
