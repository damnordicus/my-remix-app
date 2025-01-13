import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData, useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import { fetchData } from "@remix-run/react/dist/data";
import { useEffect, useState } from "react";

export const loader: LoaderFunction = async () => {
  const data = [
    { id: 1, name: "User 1", first: "Adam" },
    { id: 2, name: "User 2", first: "Jon" },
    { id: 3, name: "User 3", first: "Saajaadeen" },
    { id: 4, name: "User 4", first: "Matt" },
    { id: 5, name: "User 5", first: "Volin" },
  ];
  return { data };
};


export default function Index() {
  const { data } = useLoaderData();
  const fetcher = useFetcher();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [ searchParams, setSearchParams ] = useSearchParams();

  useEffect(() => {
    if (fetcher.state === "loading") {
      console.log('Fetching tasks...');
    } 

    if (fetcher.state === "idle" && fetcher.data) {
      console.log('Fetched tasks:', fetcher.data); // Log the fetched data when it's idle
      setUserTasks(fetcher.data); // Set tasks when the fetch completes
    }
  }, [fetcher.state, fetcher.data]);

  // useEffect(() => {
  //   console.log('params: ', searchParams.toString());
  // }, [searchParams]);

  const handleClick = (user) => {
    const currentSearchParams = new URLSearchParams(searchParams);
    if (selectedUser?.id === user.id) {
      // Deselect user and clear tasks
      currentSearchParams.delete('item');
      setSearchParams(currentSearchParams, { replace: true});
      setSelectedUser(null);
      setUserTasks(null);
    } else {
      // Select user and fetch their tasks
      setSelectedUser(user);
      currentSearchParams.set('item', user.id.toString());
      setSearchParams(currentSearchParams, { replace: true});
      console.log('params: ', currentSearchParams);
      //console.log(`/tasks/${user.id}`);
      fetcher.load(`/tasks/${user.id}`).catch((error) => {
        console.error("Error loading tasks:", error);
      });
      //console.log('fetcher: ', fetcher.state);
      
      
    }
  };

  console.log('usertasks: ', userTasks);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="text-2xl font-bold">Welcome to Remix</h1>
        </header>
        <nav className="flex flex-col items-center gap-4 p-6">
          <p>What's next?</p>
          <ul>
            {data.map((user) => (
              <div key={user.id} onClick={() => handleClick(user)}>
                {user.name}
              </div>
            ))}
          </ul>
        </nav>
        {selectedUser && (
          <div>
            <h2>Tasks for {selectedUser.name}:</h2>
            {fetcher.state === "loading" ? (
              <p>Loading tasks...</p>
            ) : userTasks && userTasks.length > 0 ? (
              <div className="w-[400px] h-[400px] bg-gray-500">
                {userTasks.map((task) => (
                  <div key={task.id}>{task.name}</div>
                ))}
              </div>
            ) : (
              <p>No tasks available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
