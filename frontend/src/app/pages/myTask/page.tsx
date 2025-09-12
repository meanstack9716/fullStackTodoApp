'use client'
import { useEffect, useState } from "react";
import MainLayout from "@/component/layout/MainLayout";
import { Task } from "@/interface/Task";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import DeleteToDoModal from "@/modal/DeleteTodoModal";
import AddEditTodoModal from "@/modal/AddEditTodoModal";

export default function MyTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [activeModal, setActiveModal] = useState<null | "delete" | "edit">(null);

    useEffect(() => {
        try {
            const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]") as Task[];
            const validTasks = storedTasks.filter(task => task.title && task.date && task.priority);
            const sortedTasks = validTasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setTasks(sortedTasks);
            if (sortedTasks.length > 0) setSelectedTask(sortedTasks[0]);
        } catch (error) {
            console.error("Error loading tasks from localStorage", error);
            setTasks([]);
        }
    }, [])

    const handleDelete = () => {
        if (!selectedTask) return;
        const updatedTasks = tasks.filter(t => t.id !== selectedTask.id);
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setSelectedTask(updatedTasks.length > 0 ? updatedTasks[0] : null);
        setActiveModal(null);
    }

    const handleSave = (updatedTask: Task) => {
        const updatedTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setSelectedTask(updatedTask);
        setActiveModal(null)
    }

    return (
        <MainLayout title="To-Do">
            <div className="flex flex-col lg:flex-row max-h-screen gap-5 p-3 lg:p-4 xl:p-6">

                {/* Left Column - Task List */}
                <div className="w-full lg:max-w-xs xl:max-w-sm rounded-md shadow-sm border-1 border-gray-200 overflow-y-auto p-2 lg:p-4 min-h-0">
                    <h2 className="text-xl font-semibold mb-4 text-blue-950 cursor-pointer"><span className="underline  decoration-2 underline-offset-2"><span className="text-4xl text-blue-500 font-[cursive]">M</span>y</span> Tasks 📌</h2>

                    {tasks.length === 0 ? (
                        <>
                            <p className="text-gray-500 font-bold -mt-3">✍🏻 No tasks added yet.</p>
                            <p className="text-gray-600 text-sm">Click on add task button and add some tasks</p>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    onClick={() => setSelectedTask(task)}
                                    className={`rounded-md p-3 border cursor-pointer transition hover:bg-blue-50
                                        ${selectedTask?.id === task.id
                                            ? 'border-blue-500 bg-blue-100'
                                            : 'border-gray-200 bg-white'}
                                    `}
                                >
                                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                    <div
                                        className="max-w-50 truncate text-gray-500 text-sm prose line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: task.description || "No description available" }}
                                    />

                                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                        <span
                                            className={`px-2 py-1 rounded-xl text-xs font-medium ${task.priority === 'Extreme'
                                                ? 'bg-red-100 text-red-600'
                                                : task.priority === 'Moderate'
                                                    ? 'bg-yellow-100 text-yellow-600'
                                                    : 'bg-green-100 text-green-600'
                                                }`}
                                        >
                                            {task.priority}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === 'Completed'
                                                ? 'bg-green-100 text-green-600'
                                                : task.status === 'In Progress'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {task.status}
                                        </span>
                                        <span>{format(new Date(task.date), "yyyy-MM-dd ")}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column - Task Details */}
                <div className="flex flex-col flex-1 rounded-md shadow-sm border-1 border-gray-200 overflow-auto p-2 lg:p-4 min-h-0">
                    {selectedTask ? (
                        <div className="flex flex-col h-full">
                            <div>
                                <h3 className="text-lg font-bold text-gray-600 lg:text-2xl"> <span className="text-blue-500 hover:underline underline-offset-5 cursor-pointer">📝 Task Title:</span> {selectedTask.title}</h3>
                                <p className="text-xs text-gray-500 my-1.5 font-semibold lg:text-sm">
                                    <span className="text-gray-600">🚨 Priority:</span> {selectedTask.priority}
                                </p>
                                <p className="text-xs text-gray-500 mb-1.5 lg:text-sm">
                                    <span className="text-gray-600 font-semibold">🗓️ Created:</span> {format(new Date(selectedTask.date), "yyyy-MM-dd HH:mm")}
                                </p>

                                <p className="text-xs text-gray-500 mb-4 font-semibold lg:text-sm">
                                    <span className="text-gray-600">📈 Status:</span> {selectedTask.status}
                                </p>

                                <div className="flex gap-0.5 text-sm text-gray-500 break-normal font-sans leading-5">
                                    <span className="text-gray-600 font-semibold">🗒️ Task Description:</span>
                                    <div
                                        className="prose"
                                        dangerouslySetInnerHTML={{ __html: selectedTask.description || "No description available" }}
                                    />
                                </div>

                            </div>

                            <div className="flex space-x-2 items-end justify-end mt-auto pt-4">
                                <button onClick={() => setActiveModal("delete")}
                                    className="bg-red-500 text-white px-3 py-3 rounded hover:bg-red-600 transition cursor-pointer">
                                    <FaRegTrashAlt />
                                </button>
                                <button onClick={() => setActiveModal("edit")} className="bg-blue-500 text-white px-3 py-3 rounded hover:bg-blue-600 transition cursor-pointer">
                                    <FaRegEdit />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">💁🏼 Select a task to see details.</p>
                    )}
                </div>
            </div>
            <DeleteToDoModal
                isOpen={activeModal === "delete"}
                onClose={() => setActiveModal(null)}
                onConfirm={handleDelete}
                taskTitle={selectedTask?.title}
            />

            {selectedTask && (
                <AddEditTodoModal
                    isOpen={activeModal === "edit"}
                    onClose={() => setActiveModal(null)}
                    task={selectedTask}
                    onSave={handleSave}
                />
            )}

        </MainLayout>
    );
}