import { useLoaderData } from "react-router";

export const loader = async({request}: LoaderFunctionArgs) => {
   // const session = await userSession.parse(request.headers.get("Cookie")) || {};
  
    const response = await fetch(`https://travisspark.atlassian.net/rest/api/3/search?jql=project%20%3D%20%22Additive%20Manufacturing%22%20AND%20%22Contact%20Full%20Name%5BShort%20text%5D%22%20~%20'ignore-me'`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `adam.nord@travisspark.com:${import.meta.env.VITE_JIRA_API_KEY}`
        ).toString('base64')}`,
        'Accept': 'application/json'
      }
    })
      .then(response => {
        // console.log(
        //   `Response: ${response.status} ${response.statusText}`
        // );
        return response;
      })
    const result = await response.json();
      //.then(text => console.log(text))
      //.catch(err => console.error(err));
    return {result}
  }

export default function AllJobs() {
    const{ result } = useLoaderData<typeof loader>();

    console.log(result.issues[0].fields)

    const jobs = result.issues;

    return(
        <div className="h-screen flex items-center justify-center">
            <div className="w-4/5 grid grid-cols-4 gap-2 p-2 mx-auto border-2 border-slate-400 rounded-lg overflow-hidden drop-shadow-xl bg-slate-800">
                {/* Container for each job. */}
                {jobs.map(issue => {
                    return (
                        <div key="" className="border-2 grid border-slate-500 bg-slate-600 rounded-lg">
                            
                            <div className="flex w-full justify-between">
                                <p className="inline pl-2">{issue.fields.creator.displayName} </p>
                                <p className="italic pr-2">{(issue.fields.created).slice(0, 10)}</p>
                            </div>
                            <div>
                                <h2 className="text-lg text-blue-300 text-center">{issue.fields.summary}</h2>
                            </div>
                            <div>
                                <p className="inline px-2">Description:</p><p className="line-clamp-2">{issue.fields.description.content[0].content[0].text}</p>
                            </div>
                        </div>
                    );
                })}
                
            </div>
        </div>
    )
}