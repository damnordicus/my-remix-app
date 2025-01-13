import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const { item } = params;
    console.log("Loading tasks for user:", item);

    const taskData = {
      1: [
        { id: "0", name: "Task 1", uid: 1 },
        { id: "1", name: "Task 2", uid: 1 },
        { id: "2", name: "Task 3", uid: 1 },
      ],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    const tasks = taskData[item] || [];
    console.log("Tasks returned:", tasks);

    return tasks;
  } catch (error) {
    console.error("Error in loader:", error);
    return [];
  }
};
