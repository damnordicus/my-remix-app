import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout";
import MainButton from "~/components/MainButton";

export const clientLoader = async ({
  request,
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  // call the server loader
  // const serverData = await serverLoader();
  // And/or fetch data on the client
  // const data = getDataFromClient();
  // Return the data to expose through useLoaderData()  
  const randomBuffer = new Uint8Array(1);
  crypto.getRandomValues(randomBuffer);

  // Scale the random number to the range 1-15
  const randomNumber = 1 + (randomBuffer[0] % 14);
  
  console.log(randomNumber)
  return {rand: randomNumber};
};
export function HydrateFallback() {
  return <p>Loading...</p>;
}
export default function Index() {

  const {rand} = useLoaderData();
  const backgroundUrl = `/fil${rand}.jpg`;
  
  return (
    <Layout backgroundUrl={backgroundUrl}>
      <div className="w-[465px] h-[360px] justify-center bg-slate-700 border-2 border-gray-600 bg-opacity-50 backdrop-blur-sm rounded-xl flex flex-row flex-wrap items-center  gap-4 p-4">
        <MainButton text="Pull From Stock" link="pullFilament"/>
        <MainButton text="Return To Stock" link="returnFilament"/>
        <MainButton text="View Stock" link="inventory" />
        <div className="flex items-center justify-center w-[200px] h-[150px] bg-gray-600 border-2 border-gray-500 rounded-xl ">

        </div>
      </div>   
    </Layout>
  );
}
