'use client'
import { useEffect, useState } from "react";
import MainLayout from "@/component/layout/MainLayout";
import { FaRegEdit, FaRegTrashAlt, FaCheckCircle } from "react-icons/fa";
import { format } from "date-fns";
import DeleteToDoModal from "@/modal/DeleteTodoModal";
import AddEditTodoModal from "@/modal/AddEditTodoModal";
import { countDown } from "../../../../utils/countDown";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Todo } from "@/types/todo";
import { deleteTodo, editTodo, fetchTodos } from "@/features/todoSlice";

export default function MyTasks() {
    const dispatch = useDispatch<AppDispatch>();
    const { todos, loading, error, hasNextPage } = useSelector((state: RootState) => state.todos);
    const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
    const [activeModal, setActiveModal] = useState<null | "delete" | "edit">(null);
    const [page, setPage] = useState(1);
    const timeLeft = countDown(selectedTask?.expireAt, selectedTask?.status);

    useEffect(() => {
        dispatch(fetchTodos({ page, limit: 10 }));
    }, [dispatch, page]);

    useEffect(() => {
        if (todos.length > 0) {
            setSelectedTask(todos[0]);
        }
    }, [todos]);

    const handleDelete = async () => {
        if (!selectedTask) return;
        try {
            await dispatch(deleteTodo(selectedTask._id)).unwrap()
            setActiveModal(null);
        } catch (err) {
            console.error("Delete failed:", err);
        }
    }

    const handleSave = (updatedTask: Todo) => {
        setSelectedTask(updatedTask);
        setActiveModal(null)
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && hasNextPage) {
            setPage(prev => prev + 1);
        }
    };

    const handleComplete = async (task: Todo) => {
        if (!task) return;
        try {
            const updatedTask = await dispatch(
                editTodo({
                    id: task._id,
                    todoData: {
                        title: task.title,
                        description: task.description,
                        date: task.date,
                        priority: task.priority,
                        expireAt: task.expireAt,
                        completed: true,
                        status: "Completed"
                    }
                })
            ).unwrap();

            setSelectedTask(updatedTask);
        } catch (err) {
            console.error("Failed to complete task:", err);
        }
    }


    return (
        <MainLayout title="To-Do">
            <div className="flex flex-col lg:flex-row h-screen gap-5 p-3 lg:p-4 xl:p-6">

                {/* Left Column - Task List */}
                <div className="w-full lg:max-w-xs xl:max-w-sm rounded-md shadow-sm border border-gray-200 overflow-y-auto p-2 lg:p-4 flex-1"
                    onScroll={handleScroll}>
                    <h2 className="text-xl font-semibold mb-4 text-blue-950 cursor-pointer"><span className="underline  decoration-2 underline-offset-2"><span className="text-4xl text-blue-500 font-[cursive]">M</span>y</span> Tasks 📌</h2>

                    {error && (
                        <p className="text-red-500 text-sm mb-2">⚠️ {error}</p>
                    )}
                    {todos.length === 0 ? (
                        <>
                            <p className="text-gray-500 font-bold -mt-3">✍🏻 No tasks added yet.</p>
                            <p className="text-gray-600 text-sm">Click on add task button and add some tasks</p>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {todos.map((task, index) => (
                                <div
                                    key={`${task._id}-${index}`}
                                    onClick={() => setSelectedTask(task)}
                                    className={`rounded-md p-3 border cursor-pointer transition hover:bg-blue-50
                                        ${selectedTask?._id === task._id
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
                <div className="flex flex-col w-full lg:flex-1 rounded-md shadow-sm border-1 border-gray-200 overflow-auto p-2 lg:p-4">
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

                                <p className="text-xs text-gray-500 mb-1.5 font-semibold lg:text-sm">
                                    <span className="text-gray-600">📈 Status:</span> {selectedTask.status}
                                </p>

                                <p className="text-xs text-gray-500 mb-4 lg:text-sm">
                                    <span className="text-gray-600 font-semibold">⏳ Time Left:</span>{" "}
                                    {timeLeft || "No expiry set"}
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
                                {selectedTask.status !== "Completed" && (
                                    <button
                                        onClick={() => handleComplete(selectedTask)}
                                        className="bg-green-500 text-white px-3 py-3 rounded hover:bg-green-600 transition cursor-pointer"
                                    >
                                        <FaCheckCircle />
                                    </button>
                                )}
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