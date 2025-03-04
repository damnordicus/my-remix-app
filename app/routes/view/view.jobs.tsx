import { Link, LoaderFunctionArgs, useLoaderData } from "react-router";
import { userSession } from "~/services/cookies.server";
import { getUserIssues } from "~/utils/jira.service";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await userSession.parse(request.headers.get("Cookie"));
  const result = await getUserIssues(session.username);
  return { result };
};

export default function AllJobs() {
  const { result } = useLoaderData<typeof loader>();

  return (
    <div className="h-screen items-center justify-center">
      <div className="relative top-20 w-4/5  grid grid-cols-4 gap-2 p-8 mx-auto border-2 border-slate-400 rounded-lg overflow-hidden drop-shadow-xl bg-slate-600/60">
        <div className="flex col-span-4 w-full -mt-2 justify-between text-lg">
          <Link to="/" className="">Back</Link>
          <p className="text-2xl -mt-2 pb-2 text-amber-400">
            Your Prints
          </p>
          <p></p>
        </div>
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
                      {issue.creator.displayName} - {issue.id}{" "}
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
