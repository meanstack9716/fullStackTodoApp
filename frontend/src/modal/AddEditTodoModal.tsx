'use client';
import React, { useRef, useState, useEffect } from "react";
import InputField from "@/component/InputField";
import { AiOutlineCalendar } from "react-icons/ai";
import { BiTask } from "react-icons/bi";
import { Task } from "@/interface/Task";
import { RichTextEditorHandle } from "@/component/RichTextEditor";
import dynamic from "next/dynamic";
import { validateDate, validateDescription, validatePriority, validateTitle } from "../../utils/validators";
import AddEditTodoModalProps from "@/interface/AddEditToDoModalProps";

const RichTextEditor = dynamic(() => import("@/component/RichTextEditor"), {
    ssr: false,
});

export default function AddEditTodoModal({ isOpen, onClose, onSave, task }: AddEditTodoModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        priority: ""
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const descriptionRef = useRef<RichTextEditorHandle>(null);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                date: task.date,
                priority: task.priority,
            });
        } else {
            setFormData({ title: "", date: "", priority: "" });
        }
    }, [task]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};
        const { title, date, priority } = formData;
        const rawDesc = descriptionRef.current?.getContent() || '';
        const description = rawDesc
        const plainText = description.replace(/<(.|\n)*?>/g, '').trim();
        const titleError = validateTitle(title);
        const dateError = validateDate(date);
        const priorityError = validatePriority(priority);
        const descError = validateDescription(plainText);

        if (titleError) newErrors.title = titleError;
        if (dateError) newErrors.date = dateError;
        if (priorityError) newErrors.priority = priorityError;
        if (descError) newErrors.description = descError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const updatedTask: Task = {
            id: task?.id || Date.now(),
            title,
            date,
            priority: priority as "Extreme" | "Moderate" | "Low",
            description,
            completed: task?.completed || false,
            status: task?.status || "Pending",
        };

        onSave(updatedTask);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 px-6 py-4 relative overflow-y-auto max-h-[90vh]">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-7 right-7 text-sm text-black font-medium hover:underline cursor-pointer"
                >
                    Go Back
                </button>

                {/* Heading */}
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
                    {task ? (
                        <span className="hover:underline underline-offset-4 decoration-blue-600 decoration-2 cursor-pointer"><span className="underline decoration-blue-600">Edit</span> Task</span>
                    ) : (
                        <span className="hover:underline underline-offset-4 decoration-blue-600 decoration-2 cursor-pointer"><span className="underline decoration-blue-600">Add Ne</span>w Task</span>
                    )}
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {/* Title */}
                    <InputField
                        label="Title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter task title"
                        error={errors.title}
                        icon={<BiTask />}
                    />

                    {/* Date */}
                    <InputField
                        label="Date"
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        placeholder="Select a date"
                        error={errors.date}
                        icon={<AiOutlineCalendar />}
                    />

                    {/* Priority */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                            Priority
                        </label>
                        <div className="flex gap-6">
                            {["Extreme", "Moderate", "Low"].map((level) => (
                                <label key={level} className="flex items-center gap-2 text-sm text-gray-500">
                                    <span
                                        className={`w-3 h-3 rounded-full ${level === "Extreme"
                                            ? "bg-red-500"
                                            : level === "Moderate"
                                                ? "bg-blue-500"
                                                : "bg-green-500"
                                            }`}
                                    />
                                    {level}
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={level}
                                        checked={formData.priority === level}
                                        onChange={handleChange}
                                    />
                                </label>
                            ))}
                        </div>
                        {errors.priority && <p className="text-red-500 text-xs">{errors.priority}</p>}
                    </div>

                    {/* Description */}
                    <div className="!text-black">
                        <label className="block text-gray-700 font-medium mb-1 text-sm">
                            Task Description
                        </label>
                        <RichTextEditor ref={descriptionRef} value={task?.description || ""} />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer"
                        >
                            {task ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
