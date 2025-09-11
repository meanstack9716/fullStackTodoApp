import { Task } from "@/interface/Task";

export const saveTaskToLocalStorage = (task: Task) => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]") as Task[];
  storedTasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(storedTasks));
};

