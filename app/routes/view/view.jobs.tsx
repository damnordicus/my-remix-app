import { useEffect } from "react";
import {toast} from "react-toastify";
import { Link, LoaderFunctionArgs, redirect, useLoaderData, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { userSession } from "~/services/cookies.server";
import { getUserIssues } from "~/utils/jira.service";
import { redirectWithError } from "remix-toast";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await userSession.parse(request.headers.get("Cookie"));
  if(!session.username) return redirect("..")
  const result = await getUserIssues(session.username);
  if(result.error){
    // console.log('r: ',result.error)
     return redirectWithError("../inventory", "Couldn't connect to Jira");
  }
  return { result };
};

export default function AllJobs() {
  const  result  = useLoaderData<typeof loader>();

    return (
      <div className="mt-0 lg:mt-15 h-screen items-center justify-center">
      <div className={`relative lg:top-15 max-h-[calc(100vh-80px)] lg:w-4/5 gap-2 p-8 mx-auto lg:border-2 lg:border-slate-400 rounded-lg ${result.result.size > 5 ? 'overflow-y-scroll' : ''} drop-shadow-xl lg:bg-slate-600/60`}>
        {result.result.size === 0 && <div className="text-center text-2xl py-2"><p>You don&apos;t have any jobs. <Link to="../job/create" className="underline text-blue-300 italic">Print something? </Link></p></div>}
        {result.result.size > 0 && Array.from(result.result.entries())
          .sort(([_, a], [__, b]) => +a.priority.id - +b.priority.id)
          .map(([id, issue]) => {
            // console.log(id, issue);
            // console.log(issue.userId);
            let priorityColorClass = "";
            
            switch (issue.priority.id) {
              case "1":
                priorityColorClass = "border-red-500 bg-red-500";
                break;
                case "2":
                  priorityColorClass = "border-orange-500 bg-orange-500";
                  break;
              case "3":
                priorityColorClass = "border-yellow-500 bg-yellow-500";
                break;
                case "4":
                  priorityColorClass = "border-green-500 bg-green-500";
                break;
              case "5":
                priorityColorClass = "border-blue-500 bg-blue-500";
                break;
              default:
                return 1;
              }
              
              return (
              <div
              key=""
              className={`grid gird-cols-1 h-35 border-2 ${priorityColorClass}  rounded-2xl shadow-lg shadow-slate-800`}
              >
                <div className="bg-gradient-to-br from-gray-600 to-gray-800 ml-3 rounded-e-2xl">
                  <div className="flex w-full justify-between items-center">
                    <p className="inline pl-2 text-sm text-slate-300/70">
                      {issue.creator.displayName} - {"#"}{issue.id}{" "}
                    </p>
                    <p className="italic pr-2">{issue.created.slice(0, 10)}</p>
                  </div>
                  <div>
                    <h2 className="text-lg text-blue-300 text-center line-clamp-1 mx-1">
                      {issue.summary}
                    </h2>
                  </div>
                  <div>
                    <p className="inline px-2 ">Description:</p>
                    <p className="line-clamp-2 px-2 pb-1 text-sm">
                      {issue.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );

}
