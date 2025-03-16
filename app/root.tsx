import {
  data,
  // ClientLoaderFunctionArgs,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "react-router";
import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import { default as RootLayout } from "./components/Layout";
import { getToast } from "remix-toast";
import { ToastContainer, toast as notify} from "react-toastify";
import toastStyles from "react-toastify/ReactToastify.css?url"

import "./tailwind.css";
// import { useCallback, useMemo } from "react";
import { userSession } from "./services/cookies.server";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet",
    href: toastStyles,
  }
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("root loader");
  const session =
    (await userSession.parse(request.headers.get("Cookie"))) || {};
  const { toast, headers } = await getToast(request);
  return data({
    user: session.username || null,
    id: session.id,
    admin: session.admin || false,
    toast,
  }, { headers });
};

export function Layout({ children }: { children: React.ReactNode }) {
  // const getNumber = useMemo(() => {
  //   const randomBuffer = new Uint8Array(1);
  //   crypto.getRandomValues(randomBuffer);

  //   // Scale the random number to the range 1-15
  //   const randomNumber = 1 + (randomBuffer[0] % 14);
  //   return randomNumber
  // }, [])

  // const get2 = useCallback(() => {
  //   const randomBuffer = new Uint8Array(1);
  //   crypto.getRandomValues(randomBuffer);

  //   // Scale the random number to the range 1-15
  //   const randomNumber = 1 + (randomBuffer[0] % 14)
  //   return randomNumber
  // }, [])

  // console.log(get2())

  // const { rand } = useLoaderData<typeof clientLoader>();
  const backgroundUrl = `/fil7.jpg`;
  const { toast, user, id, admin} = useLoaderData<typeof loader>();
  const data = {user: user, id: id, admin: admin};
  console.log("yep");

  useEffect(() => {
    if(toast){
      notify(toast.message, {type: toast.type});
    }
  }, [toast])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black text-white">
      <ToastContainer  
          position="top-center"
          autoClose={3000} // Closes after 3 seconds
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"/>
        <RootLayout backgroundUrl={backgroundUrl} user={data}>
          {children}
        </RootLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  }

  return (
    <>
      <h1>Error!</h1>
      <p>{error?.message ?? "Unknown error"}</p>
    </>
  );
}
