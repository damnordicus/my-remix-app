import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link, LoaderFunctionArgs, redirect, useLoaderData, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { userSession } from "~/services/cookies.server";
import { getUserIssues } from "~/utils/jira.service";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await userSession.parse(request.headers.get("Cookie"));
  if(!session.username) return redirect("..")
  const result = await getUserIssues(session.username);
  if(result.error){
    console.log('r: ',result.error)
     return {error: result.error};
  }
  return { result };
};

export default function AllJobs() {
  const  result  = useLoaderData<typeof loader>();

  if(result.error){
    return (
      <div className="relative top-15">
        Couldn't connect to Jira :(
      </div>
    );
  }else{

    return (
      <div className="mt-0 lg:mt-15 h-screen items-center justify-center">
      <div className={`relative lg:top-15 max-h-[calc(100vh-80px)] lg:w-4/5  grid grid-cols-1 gap-2 p-8 mx-auto lg:border-2 lg:border-slate-400 rounded-lg ${result.size > 5 ? 'overflow-y-scroll' : ''} lg:drop-shadow-xl lg:bg-slate-600/60`}>
        {result.size === 0 && <div className="col-span-1 flex justify-center text-2xl gap-2 py-2 bg-slate-500/60 backdrop-blur-sm border-2 border-slate-500 rounded-lg"><p>You don't have any jobs.</p> <Link to="../job/create" className=""><p className="underline text-blue-300 italic"> Print something?</p></Link></div>}
        {Array.from(result.entries())
          .sort(([_, a], [__, b]) => +a.priority.id - +b.priority.id)
          .map(([id, issue]) => {
            console.log(id, issue);
            console.log(issue.userId);
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
              className={`h-35 border-2 grid ${priorityColorClass}  rounded-2xl shadow-lg shadow-slate-800`}
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
}
