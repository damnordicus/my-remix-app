import {
  ClientLoaderFunctionArgs,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "react-router";
import type { LinksFunction } from "react-router";
import { default as RootLayout } from "./components/Layout";

import "./tailwind.css";
import { useCallback, useMemo } from "react";

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
];

export function Layout({ children }: { children: React.ReactNode }) {

  const getNumber = useMemo(() => {
    const randomBuffer = new Uint8Array(1);
    crypto.getRandomValues(randomBuffer);

    // Scale the random number to the range 1-15
    const randomNumber = 1 + (randomBuffer[0] % 14);
    return randomNumber
  }, [])

  const get2 = useCallback(() => {
    const randomBuffer = new Uint8Array(1);
    crypto.getRandomValues(randomBuffer);

    // Scale the random number to the range 1-15
    const randomNumber = 1 + (randomBuffer[0] % 14);
    return randomNumber
  }, [])

  console.log(get2())

  // const { rand } = useLoaderData<typeof clientLoader>();
  const backgroundUrl = `/fil${getNumber}.jpg`;
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>

    <RootLayout backgroundUrl={backgroundUrl}>
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