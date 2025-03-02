import { useLoaderData } from "react-router";

export const loader = async({request}: LoaderFunctionArgs) => {
   //const session = await userSession.parse(request.headers.get("Cookie")) || {};
  
    // const response = await fetch(`https://travisspark.atlassian.net/rest/api/3/search?jql=project%20%3D%20%22Additive%20Manufacturing%22%20AND%20%22Contact%20Full%20Name%5BShort%20text%5D%22%20~%20'ignore-me'`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Basic ${Buffer.from(
    //       `adam.nord@travisspark.com:${import.meta.env.VITE_JIRA_API_KEY}`
    //     ).toString('base64')}`,
    //     'Accept': 'application/json'
    //   }
    // })
    //   .then(response => {
    //     // console.log(
    //     //   `Response: ${response.status} ${response.statusText}`
    //     // );
    //     return response;
    //   })
    // const result = await response.json();
    //   //.then(text => console.log(text))
    //   //.catch(err => console.error(err));
    // return {result}
  }

export default function AllJobs() {
    // const{ result } = useLoaderData<typeof loader>();

    // console.log(result)

    //const jobs = result.issues;

    const jobs = [
      {
          id: "1",
          fields: {
              creator: { displayName: "Alice Johnson" },
              created: "2025-02-28T14:30:00.000Z",
              summary: "Fix login bug",
              priority: 1,
              description: {
                  content: [
                      { content: [{ text: "Users unable to log in after recent update." }] }
                  ]
              }
          }
      },
      {
          id: "2",
          fields: {
              creator: { displayName: "Bob Smith" },
              created: "2025-02-27T09:15:00.000Z",
              summary: "Update dashboard UI",
              priority: 1,
              description: {
                  content: [
                      { content: [{ text: "Redesign the dashboard to improve user experience." }] }
                  ]
              }
          }
      },
      {
          id: "3",
          fields: {
              creator: { displayName: "Charlie Davis" },
              created: "2025-02-26T17:45:00.000Z",
              summary: "Optimize database queries",
              priority: 2,
              description: {
                  content: [
                      { content: [{ text: "Improve database performance by indexing critical tables." }] }
                  ]
              }
          }
      },
      {
          id: "4",
          fields: {
              creator: { displayName: "Dana Lee" },
              created: "2025-02-25T12:00:00.000Z",
              summary: "Fix mobile responsiveness",
              priority: 3,
              description: {
                  content: [
                      { content: [{ text: "Adjust CSS and media queries for better mobile compatibility." }] }
                  ]
              }
          }
      },
      {
        id: "5",
        fields: {
            creator: { displayName: "Alice Johnson" },
            created: "2025-02-28T14:30:00.000Z",
            summary: "Fix login bug",
            priority: 1,
            description: {
                content: [
                    { content: [{ text: "Users unable to log in after recent update." }] }
                ]
            }
        }
    },
    {
        id: "6",
        fields: {
            creator: { displayName: "Bob Smith" },
            created: "2025-02-27T09:15:00.000Z",
            summary: "Update dashboard UI",
            priority: 2,
            description: {
                content: [
                    { content: [{ text: "Redesign the dashboard to improve user experience." }] }
                ]
            }
        }
    },
    {
        id: "7",
        fields: {
            creator: { displayName: "Charlie Davis" },
            created: "2025-02-26T17:45:00.000Z",
            summary: "Optimize database queries",
            priority: 3,
            description: {
                content: [
                    { content: [{ text: "Improve database performance by indexing critical tables." }] }
                ]
            }
        }
    },
    {
        id: "8",
        fields: {
            creator: { displayName: "Dana Lee" },
            created: "2025-02-25T12:00:00.000Z",
            summary: "Fix mobile responsiveness",
            priority: 1,
            description: {
                content: [
                    { content: [{ text: "Adjust CSS and media queries for better mobile compatibility." }] }
                ]
            }
        }
    }
  ];
  


    return(
        <div className="h-screen items-center justify-center">
            <div className="relative top-20 w-4/5  grid grid-cols-4 gap-2 p-8 mx-auto border-2 border-slate-400 rounded-lg overflow-hidden drop-shadow-xl bg-slate-600/60">
                {/* Container for each job. */}
                {jobs.sort((a, b) => b.fields.priority - a.fields.priority).map(issue => {
                    return (
                        <div key="" className={`h-35 border-2 grid ${issue.fields.priority === 1 ? 'border-green-500 bg-green-500' : issue.fields.priority === 2 ? 'border-yellow-500 bg-yellow-500' : 'border-red-500 bg-red-500'}  rounded-2xl shadow-lg shadow-slate-800`}>
                            <div className="bg-gradient-to-br from-gray-600 to-gray-800 ml-3 rounded-e-2xl">
                              <div className="flex w-full justify-between items-center">
                                  <p className="inline pl-2 text-sm text-slate-300/70">{issue.fields.creator.displayName} </p>
                                  <p className="italic pr-2">{(issue.fields.created).slice(0, 10)}</p>
                              </div>
                              <div>
                                  <h2 className="text-lg text-blue-300 text-center line-clamp-1 mx-1">{issue.fields.summary}</h2>
                              </div>
                              <div>
                                  <p className="inline px-2 ">Description:</p><p className="line-clamp-2 px-2 pb-1 text-sm">{issue.fields.description.content[0].content[0].text}</p>
                              </div>
                            </div>
                        </div>
                    );
                })}
                
            </div>
        </div>
    )
}