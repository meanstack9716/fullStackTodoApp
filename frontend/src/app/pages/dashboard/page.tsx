"use client";
import { useEffect, useState } from "react";
import MainLayout from "@/component/layout/MainLayout";
import { Task } from "@/interface/Task";
import { format, isToday } from "date-fns";
import Link from "next/link";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]") as Task[];
    setTasks(storedTasks);
  }, []);

  // Split tasks
  const upcomingTasks = tasks
    .filter((task) => task.status !== "Completed") 
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const completedToday = tasks
    .filter((task) => task.status === "Completed" && isToday(new Date(task.date))) 
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <MainLayout title="Dashboard">
      <div className="p-3 lg:p-4 xl:px-6 max-h-screen overflow-y-auto">
        <h1 className="text-xl font-bold mb-6 text-blue-950 xl:text-2xl">
          <span className="underline decoration-2 underline-offset-2">
            <span className="text-4xl text-blue-500 font-[cursive]">W</span>elcome ba
          </span>
          ck, User 👋
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">
             👇🏻 Upcoming Tasks
            </h2>
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-500"> ✍🏻 No upcoming tasks.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingTasks.map((task) => (
                  <li key={task.id} className="p-3 bg-white rounded-lg shadow">
                    <p className="font-bold text-blue-700 uppercase">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Expires : </span>
                      {task.expireAt  
                        ? format(new Date(task.expireAt), "yyyy-MM-dd HH:mm")
                        : "No expiry"}
                    </p>
                    <div className="flex justify-between">
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Priority: </span>
                        <span
                          className={`${task.priority === "Extreme"
                            ? "text-red-600"
                            : task.priority === "Moderate"
                              ? "text-yellow-600"
                              : "text-green-600"
                            }`}
                        >
                          {task.priority}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Status: </span>
                        <span
                          className={`${task.status === "Pending"
                            ? "text-blue-600"
                            : task.status === "In Progress"
                              ? "text-yellow-400" :
                              task.status === "Expired" ? "text-red-600"
                                : "text-green-500"
                            }`}
                        >
                          {task.status}
                        </span>
                      </p>
                    </div>

                  </li>
                ))}
              </ul>
            )}

          </div>

          {/* Completed Today */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-green-600 mb-2">
             ✅ Completed Today
            </h2>
            {completedToday.length === 0 ? (
              <p className="text-gray-500">No tasks completed today.</p>
            ) : (
              <ul className="space-y-3">
                {completedToday.map((task) => (
                  <li key={task.id} className="p-3 bg-white rounded-lg shadow">
                    <p className="font-semibold text-green-700 uppercase mb-1">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Completed at: {format(new Date(task.date), "HH:mm")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {tasks.length > 0 && (
          <div className="mt-4 text-right px-3">
            <Link
              href="/pages/myTask"
              className="text-blue-500 hover:underline hover:font-bold underline-offset-4"
            >
              View all tasks →
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
